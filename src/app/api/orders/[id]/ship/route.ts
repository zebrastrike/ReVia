export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { createShipmentAndBuyLabel, getTrackingUrl } from "@/lib/easypost";
import { sendShippingNotification } from "@/lib/email";

/* ------------------------------------------------------------------ */
/*  POST /api/orders/[id]/ship — Create EasyPost shipment + buy label  */
/* ------------------------------------------------------------------ */

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.easypostShipmentId) {
      return NextResponse.json(
        { error: "Shipment already created for this order" },
        { status: 400 }
      );
    }

    if (order.paymentStatus !== "confirmed") {
      return NextResponse.json(
        { error: "Cannot ship an order that hasn't been paid" },
        { status: 400 }
      );
    }

    // Create shipment via EasyPost
    const result = await createShipmentAndBuyLabel({
      name: order.name,
      street1: order.address,
      city: order.city,
      state: order.state,
      zip: order.zip,
      country: order.country,
      email: order.email,
    });

    // Update order in DB
    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: "shipped",
        tracking: result.trackingNumber,
        easypostShipmentId: result.shipmentId,
        carrier: result.carrier,
        serviceLevel: result.serviceLevel,
        labelUrl: result.labelUrl,
      },
      include: { items: true },
    });

    // Send shipping notification email
    try {
      const trackingUrl = getTrackingUrl(result.carrier, result.trackingNumber);
      await sendShippingNotification(
        updated,
        order.email,
        result.trackingNumber,
        result.carrier,
        trackingUrl
      );
    } catch (emailErr) {
      console.error("Failed to send shipping notification:", emailErr);
    }

    return NextResponse.json({
      success: true,
      shipment: {
        trackingNumber: result.trackingNumber,
        carrier: result.carrier,
        serviceLevel: result.serviceLevel,
        labelUrl: result.labelUrl,
        trackingUrl: getTrackingUrl(result.carrier, result.trackingNumber),
        ratePaid: result.rate,
      },
    });
  } catch (err) {
    console.error("POST /api/orders/[id]/ship error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create shipment" },
      { status: 500 }
    );
  }
}
