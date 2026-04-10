export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderCancellation } from "@/lib/email";

/* ------------------------------------------------------------------ */
/*  POST /api/crypto/expire-payments                                   */
/*  Cron endpoint — marks expired crypto payments and their orders     */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    // ── Verify cron secret ──
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Find all pending crypto payments past their expiry ──
    const expired = await prisma.cryptoPayment.findMany({
      where: {
        status: "pending",
        expiresAt: { lte: new Date() },
      },
      include: {
        order: {
          include: { items: true },
        },
      },
    });

    if (expired.length === 0) {
      return NextResponse.json({ expired: 0 });
    }

    // ── Mark each as expired ──
    let expiredCount = 0;
    for (const cp of expired) {
      await prisma.cryptoPayment.update({
        where: { id: cp.id },
        data: { status: "expired" },
      });

      await prisma.order.update({
        where: { id: cp.orderId },
        data: {
          status: "expired",
          paymentStatus: "failed",
        },
      });

      // Notify customer
      try {
        const order = cp.order;
        await sendOrderCancellation(
          {
            id: order.id,
            invoiceNumber: order.invoiceNumber,
            name: order.name,
            email: order.email,
            address: order.address,
            city: order.city,
            state: order.state,
            zip: order.zip,
            total: order.total,
            status: "expired",
            paymentMethod: order.paymentMethod,
            items: order.items,
            createdAt: order.createdAt,
          },
          order.email,
          "Bitcoin payment was not received within the 30-minute payment window. You can place a new order to try again."
        );
      } catch (emailErr) {
        console.error("Failed to send expiration email:", emailErr);
      }

      expiredCount++;
    }

    return NextResponse.json({
      expired: expiredCount,
      message: `Expired ${expiredCount} payment(s)`,
    });
  } catch (err) {
    console.error("POST /api/crypto/expire-payments error:", err);
    return NextResponse.json(
      { error: "Expiration check failed" },
      { status: 500 }
    );
  }
}
