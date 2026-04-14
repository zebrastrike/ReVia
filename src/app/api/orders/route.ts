export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { sendOrderConfirmation, sendAdminNewOrderAlert } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { validateShippingAddress, validateOrderItems, sanitizeString } from "@/lib/validation";
import { calculateTax } from "@/lib/tax";
import type { PaymentMethod } from "@/lib/constants";
import { verifyTurnstile } from "@/lib/turnstile";

/* ------------------------------------------------------------------ */
/*  Invoice number generator: RV-YYYYMMDD-XXXX                        */
/* ------------------------------------------------------------------ */

function generateInvoiceNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RV-${date}-${rand}`;
}

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

const VALID_PAYMENT_METHODS: PaymentMethod[] = ["zelle", "wire", "bitcoin"];

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 20 orders per IP per hour
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const { success, remaining } = rateLimit(`orders:${ip}`, 20, 60 * 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: "Too many order attempts. Please try again later." },
        { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
      );
    }

    // ── Check auth FIRST (required — checkout requires login) ──
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to place an order" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, shipping, couponCode, paymentMethod, shippingCost: clientShippingCost, turnstileToken } = body as {
      items: OrderItemInput[];
      shipping: ShippingInput;
      couponCode?: string;
      paymentMethod?: string;
      shippingCost?: number;
      turnstileToken?: string;
    };

    // ── Verify Turnstile (bot protection) ──
    if (turnstileToken) {
      const turnstileValid = await verifyTurnstile(turnstileToken);
      if (!turnstileValid) {
        return NextResponse.json(
          { error: "Bot verification failed. Please try again." },
          { status: 400 }
        );
      }
    }

    // ── Validate payment method ──
    const method = (paymentMethod && VALID_PAYMENT_METHODS.includes(paymentMethod as PaymentMethod))
      ? paymentMethod as PaymentMethod
      : "zelle";

    // ── Validate order items ──
    const itemValidation = validateOrderItems(items);
    if (!itemValidation.valid) {
      return NextResponse.json(
        { error: "Invalid order items", details: itemValidation.errors },
        { status: 400 }
      );
    }

    // ── Validate shipping ──
    const shippingValidation = validateShippingAddress(shipping as unknown as Record<string, unknown>);
    if (!shippingValidation.valid) {
      return NextResponse.json(
        { error: "Invalid shipping address", details: shippingValidation.errors },
        { status: 400 }
      );
    }

    // ── Sanitize inputs ──
    const sanitizedShipping: ShippingInput = {
      name: sanitizeString(shipping.name),
      email: sanitizeString(shipping.email).toLowerCase(),
      address: sanitizeString(shipping.address),
      city: sanitizeString(shipping.city),
      state: sanitizeString(shipping.state),
      zip: sanitizeString(shipping.zip),
    };

    const sanitizedItems = items.map((i) => ({
      ...i,
      productName: sanitizeString(i.productName),
      variantLabel: sanitizeString(i.variantLabel),
    }));

    // ── Verify variant prices against database (prevent price manipulation) ──
    const variantIds = sanitizedItems.map((i) => i.variantId);
    const dbVariants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: { id: true, price: true },
    });

    const variantPriceMap = new Map(dbVariants.map((v) => [v.id, v.price]));

    for (const item of sanitizedItems) {
      const dbPrice = variantPriceMap.get(item.variantId);
      if (dbPrice === undefined) {
        return NextResponse.json(
          { error: `Variant ${item.variantId} not found` },
          { status: 400 }
        );
      }
      if (Math.abs(dbPrice - item.price) > 0.01) {
        return NextResponse.json(
          { error: "Price mismatch detected. Please refresh and try again." },
          { status: 400 }
        );
      }
    }

    // ── Calculate total from verified prices ──
    let total = sanitizedItems.reduce((sum, i) => {
      const dbPrice = variantPriceMap.get(i.variantId)!;
      return sum + dbPrice * i.quantity;
    }, 0);

    // ── Apply coupon if provided ──
    let appliedCouponId: string | null = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });

      if (!coupon) {
        return NextResponse.json(
          { error: "Invalid coupon code" },
          { status: 400 }
        );
      }

      if (!coupon.active) {
        return NextResponse.json(
          { error: "This coupon is no longer active" },
          { status: 400 }
        );
      }

      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return NextResponse.json(
          { error: "This coupon has expired" },
          { status: 400 }
        );
      }

      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json(
          { error: "This coupon has reached its usage limit" },
          { status: 400 }
        );
      }

      if (total < coupon.minOrder) {
        return NextResponse.json(
          { error: `Minimum order of $${(coupon.minOrder / 100).toFixed(2)} required for this coupon` },
          { status: 400 }
        );
      }

      let discount = 0;
      if (coupon.type === "percentage") {
        discount = Math.round(total * (coupon.value / 100));
      } else {
        discount = Math.min(coupon.value, total);
      }

      total = Math.max(0, total - discount);
      appliedCouponId = coupon.id;
    }

    // ── Calculate tax based on state ──
    const tax = calculateTax(sanitizedShipping.state, total);
    total = total + tax;

    // ── Validate and add shipping cost ──
    const VALID_SHIPPING_COSTS = [0, 795, 995, 1295, 4995]; // all possible shipping rates in cents
    const shipping_fee = typeof clientShippingCost === "number"
      && clientShippingCost >= 0
      && VALID_SHIPPING_COSTS.includes(clientShippingCost)
      ? clientShippingCost
      : 795; // default to standard $7.95 if invalid
    total = total + shipping_fee;

    // ── Generate invoice number ──
    const invoiceNumber = generateInvoiceNumber();

    // ── Create order ──
    const order = await prisma.order.create({
      data: {
        invoiceNumber,
        email: sanitizedShipping.email,
        name: sanitizedShipping.name,
        address: sanitizedShipping.address,
        city: sanitizedShipping.city,
        state: sanitizedShipping.state,
        zip: sanitizedShipping.zip,
        total,
        paymentMethod: method,
        paymentStatus: "awaiting",
        status: "pending_payment",
        userId: user.id,
        items: {
          create: sanitizedItems.map((i) => ({
            productName: i.productName,
            variantLabel: i.variantLabel,
            price: variantPriceMap.get(i.variantId)!,
            quantity: i.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // ── Increment coupon usage ──
    if (appliedCouponId) {
      await prisma.coupon.update({
        where: { id: appliedCouponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    // NOTE: Reward points, lifetime spend, and drawing entries are awarded
    // when payment is CONFIRMED (not at order creation). See /api/orders/[id] PATCH.

    // ── Clear server-side cart if user is logged in ──
    if (user) {
      await prisma.cartItem.deleteMany({
        where: { sessionId: user.id },
      });
    }

    // ── Send confirmation email with payment instructions ──
    try {
      const orderForEmail = {
        ...order,
        paymentMethod: order.paymentMethod,
        invoiceNumber: order.invoiceNumber,
        shippingCost: shipping_fee,
      };
      await sendOrderConfirmation(orderForEmail, sanitizedShipping.email);
    } catch (emailErr) {
      console.error("Failed to send order confirmation email:", emailErr);
    }

    // ── Notify admin of new order ──
    try {
      const orderForAdmin = {
        ...order,
        paymentMethod: order.paymentMethod,
        invoiceNumber: order.invoiceNumber,
        shippingCost: shipping_fee,
      };
      await sendAdminNewOrderAlert(orderForAdmin);
    } catch (adminEmailErr) {
      console.error("Failed to send admin order alert:", adminEmailErr);
    }

    return NextResponse.json(
      {
        order: {
          id: order.id,
          invoiceNumber: order.invoiceNumber,
          total: order.total,
          status: order.status,
          paymentMethod: order.paymentMethod,
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
