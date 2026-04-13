export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDeliveryConfirmation } from "@/lib/email";

/* ------------------------------------------------------------------ */
/*  POST /api/webhooks/easypost — EasyPost tracking webhook            */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, result } = body as {
      description: string;
      result: {
        id: string;
        tracking_code: string;
        status: string;
        carrier: string;
        shipment_id?: string;
        tracking_details?: Array<{
          status: string;
          message: string;
          datetime: string;
        }>;
      };
    };

    console.log(`EasyPost webhook: ${description} — tracking ${result?.tracking_code} status: ${result?.status}`);

    if (!result?.tracking_code) {
      return NextResponse.json({ received: true });
    }

    // Find order by tracking number or EasyPost shipment ID
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { tracking: result.tracking_code },
          { easypostShipmentId: result.shipment_id || "none" },
        ],
      },
      include: { items: true },
    });

    if (!order) {
      console.log(`EasyPost webhook: No order found for tracking ${result.tracking_code}`);
      return NextResponse.json({ received: true, matched: false });
    }

    // Map EasyPost status to order status
    const statusMap: Record<string, string> = {
      "pre_transit": "shipped",
      "in_transit": "shipped",
      "out_for_delivery": "shipped",
      "delivered": "delivered",
      "available_for_pickup": "delivered",
      "return_to_sender": "on_hold",
      "failure": "on_hold",
      "cancelled": "on_hold",
      "error": "on_hold",
    };

    const newStatus = statusMap[result.status];
    if (!newStatus) {
      return NextResponse.json({ received: true, status: "unknown" });
    }

    // Only update if status is progressing forward
    const statusRank: Record<string, number> = {
      pending_payment: 0, processing: 1, shipped: 2, delivered: 3,
      on_hold: 1, cancelled: 4, expired: 4,
    };

    const currentRank = statusRank[order.status] ?? 0;
    const newRank = statusRank[newStatus] ?? 0;

    if (newRank <= currentRank && newStatus !== "on_hold") {
      return NextResponse.json({ received: true, skipped: true, reason: "status not progressing" });
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: { status: newStatus },
    });

    console.log(`EasyPost webhook: Order ${order.invoiceNumber} status → ${newStatus}`);

    // Send delivery confirmation email
    if (newStatus === "delivered") {
      try {
        await sendDeliveryConfirmation(order, order.email);
      } catch (emailErr) {
        console.error("Failed to send delivery confirmation:", emailErr);
      }
    }

    return NextResponse.json({
      received: true,
      matched: true,
      orderId: order.id,
      newStatus,
    });
  } catch (err) {
    console.error("EasyPost webhook error:", err);
    return NextResponse.json({ received: true, error: "Processing failed" }, { status: 200 });
  }
}
