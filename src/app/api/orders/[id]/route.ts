export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { sendShippingNotification, sendPaymentConfirmation, sendOrderCancellation, sendDeliveryConfirmation, sendOrderStatusUpdate } from "@/lib/email";

/* ------------------------------------------------------------------ */
/*  GET /api/orders/[id] – get a single order                         */
/* ------------------------------------------------------------------ */

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Non-admin users can only view their own orders
    if (!user || (user.role !== "admin" && order.userId !== user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error("GET /api/orders/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  PATCH /api/orders/[id] – update order status (admin only)          */
/* ------------------------------------------------------------------ */

const VALID_STATUSES = ["pending_payment", "processing", "shipped", "delivered", "cancelled", "expired", "on_hold"] as const;
const VALID_PAYMENT_STATUSES = ["awaiting", "confirmed", "failed"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, trackingNumber, paymentStatus } = body as {
      status?: string;
      trackingNumber?: string;
      paymentStatus?: string;
    };

    if (status && !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // Get current order state BEFORE updating (for duplicate prevention)
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      select: { paymentStatus: true },
    });

    const updateData: Record<string, string> = {};
    if (status) updateData.status = status;
    if (paymentStatus && VALID_PAYMENT_STATUSES.includes(paymentStatus as (typeof VALID_PAYMENT_STATUSES)[number])) {
      updateData.paymentStatus = paymentStatus;
    }
    if (status === "shipped" && trackingNumber) {
      updateData.tracking = trackingNumber;
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    // On payment confirmation: award rewards + send email
    // Only if transitioning FROM non-confirmed (prevent double rewards)
    if (paymentStatus === "confirmed" && currentOrder?.paymentStatus !== "confirmed") {
      // Award reward points, lifetime spend, and drawing entries
      if (order.userId) {
        try {
          const pointsEarned = Math.floor(order.total / 100); // 1 point per $1
          await prisma.user.update({
            where: { id: order.userId },
            data: {
              rewardPoints: { increment: pointsEarned },
              lifetimeSpent: { increment: Math.round(order.total) },
            },
          });

          // Award monthly drawing entries
          const drawingSettings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
          const entryAmount = (drawingSettings as { drawingEntryAmount?: number })?.drawingEntryAmount ?? 5000;
          const drawingEntries = Math.floor(order.total / entryAmount);
          if (drawingEntries > 0) {
            const currentMonth = new Date().toISOString().slice(0, 7);
            await prisma.drawingEntry.upsert({
              where: { userId_month: { userId: order.userId, month: currentMonth } },
              update: { entries: { increment: drawingEntries } },
              create: { userId: order.userId, month: currentMonth, entries: drawingEntries },
            });
          }

          console.log(`Awarded ${pointsEarned} points + ${drawingEntries} drawing entries to user ${order.userId}`);
        } catch (rewardErr) {
          console.error("Failed to award rewards:", rewardErr);
        }
      }

      // Send payment confirmation email
      try {
        await sendPaymentConfirmation(order, order.email);
      } catch (emailErr) {
        console.error("Failed to send payment confirmation:", emailErr);
      }
    }

    // Send shipping notification when status changes to "shipped"
    if (status === "shipped") {
      try {
        await sendShippingNotification(order, order.email, trackingNumber || "N/A");
      } catch (emailErr) {
        console.error("Failed to send shipping notification:", emailErr);
      }
    }

    // Send delivery confirmation
    if (status === "delivered") {
      try {
        await sendDeliveryConfirmation(order, order.email);
      } catch (emailErr) {
        console.error("Failed to send delivery confirmation:", emailErr);
      }
    }

    // Send cancellation email
    if (status === "cancelled") {
      try {
        await sendOrderCancellation(order, order.email, "Order cancelled by admin.");
      } catch (emailErr) {
        console.error("Failed to send cancellation email:", emailErr);
      }
    }

    // Send generic status update for statuses not covered above
    if (status && !["shipped", "delivered", "cancelled"].includes(status) && !paymentStatus) {
      try {
        await sendOrderStatusUpdate(order, order.email, status);
      } catch (emailErr) {
        console.error("Failed to send status update email:", emailErr);
      }
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error("PATCH /api/orders/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
