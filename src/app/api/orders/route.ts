import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { sendOrderConfirmation } from "@/lib/email";

/* ------------------------------------------------------------------ */
/*  POST /api/orders – create a new order                              */
/* ------------------------------------------------------------------ */

interface OrderItemInput {
  variantId: string;
  productName: string;
  variantLabel: string;
  price: number;
  quantity: number;
}

interface ShippingInput {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shipping } = body as {
      items: OrderItemInput[];
      shipping: ShippingInput;
    };

    // ── Validate ──
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required" },
        { status: 400 }
      );
    }

    if (!shipping || !shipping.name || !shipping.email || !shipping.address || !shipping.city || !shipping.state || !shipping.zip) {
      return NextResponse.json(
        { error: "All shipping fields are required" },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!item.variantId || !item.productName || !item.variantLabel || !item.price || !item.quantity) {
        return NextResponse.json(
          { error: "Each item must have variantId, productName, variantLabel, price, and quantity" },
          { status: 400 }
        );
      }
      if (item.quantity < 1 || item.price < 0) {
        return NextResponse.json(
          { error: "Invalid item quantity or price" },
          { status: 400 }
        );
      }
    }

    // ── Calculate total ──
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // ── Check auth (optional) ──
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);

    // ── Create order ──
    const order = await prisma.order.create({
      data: {
        email: shipping.email,
        name: shipping.name,
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        zip: shipping.zip,
        total,
        userId: user?.id ?? null,
        items: {
          create: items.map((i) => ({
            productName: i.productName,
            variantLabel: i.variantLabel,
            price: i.price,
            quantity: i.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // ── Clear server-side cart if user is logged in ──
    if (user) {
      await prisma.cartItem.deleteMany({
        where: { sessionId: user.id },
      });
    }

    // ── Send confirmation email ──
    try {
      await sendOrderConfirmation(order, shipping.email);
    } catch (emailErr) {
      console.error("Failed to send order confirmation email:", emailErr);
    }

    return NextResponse.json(
      {
        order: {
          id: order.id,
          total: order.total,
          status: order.status,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  GET /api/orders – list all orders (admin only)                     */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
