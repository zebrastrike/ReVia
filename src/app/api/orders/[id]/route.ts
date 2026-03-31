export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { sendShippingNotification } from "@/lib/email";

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

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

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
    const { status, trackingNumber } = body as {
      status: string;
      trackingNumber?: string;
    };

    if (!status || !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const updateData: Record<string, string> = { status };
    if (status === "shipped" && trackingNumber) {
      updateData.tracking = trackingNumber;
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    // Send shipping notification when status changes to "shipped"
    if (status === "shipped") {
      try {
        await sendShippingNotification(
          order,
          order.email,
          trackingNumber || "N/A"
        );
      } catch (emailErr) {
        console.error("Failed to send shipping notification:", emailErr);
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
