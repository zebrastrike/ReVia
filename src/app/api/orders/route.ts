export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { serialize } from "cookie";
import { prisma } from "@/lib/prisma";
import { getAuthUser, hashPassword, generateToken, type AuthUser } from "@/lib/auth";
import { sendOrderConfirmation, sendAdminNewOrderAlert, sendVerificationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { validateShippingAddress, validateOrderItems, sanitizeString, validateEmail, validatePassword } from "@/lib/validation";
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

    // ── Auth (existing session) OR inline account creation from checkout fields ──
    const cookieStore = await cookies();
    let user: AuthUser | { id: string; email: string; name: string; role: string } | null =
      await getAuthUser(cookieStore);

    const body = await request.json();
    const { items, shipping, couponCode, paymentMethod, shippingCost: clientShippingCost, turnstileToken, affiliateCode, password } = body as {
      items: OrderItemInput[];
      shipping: ShippingInput;
      couponCode?: string;
      paymentMethod?: string;
      shippingCost?: number;
      turnstileToken?: string;
      affiliateCode?: string;
      password?: string;
    };

    // Inline signup: no existing session → use checkout name/email + password to create account
    let newUserAuthCookie: string | null = null;
    let createdNewUser = false;
    if (!user) {
      if (!password) {
        return NextResponse.json(
          { error: "Password required to create your account" },
          { status: 400 }
        );
      }
      const inlineEmail = sanitizeString(shipping?.email ?? "").toLowerCase();
      const inlineName = sanitizeString(shipping?.name ?? "");
      if (!validateEmail(inlineEmail)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
      if (!inlineName) {
        return NextResponse.json(
          { error: "Name is required" },
          { status: 400 }
        );
      }
      const pwCheck = validatePassword(password);
      if (!pwCheck.valid) {
        return NextResponse.json(
          { error: pwCheck.message },
          { status: 400 }
        );
      }
      const existing = await prisma.user.findUnique({ where: { email: inlineEmail } });
      if (existing) {
        return NextResponse.json(
          {
            error: "An account with this email already exists. Please sign in to continue.",
            code: "EMAIL_EXISTS",
          },
          { status: 409 }
        );
      }
      const hashed = await hashPassword(password);
      const verifyToken = crypto.randomBytes(32).toString("hex");
      const referralCode = `REVIA-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
      const created = await prisma.user.create({
        data: {
          email: inlineEmail,
          name: inlineName,
          password: hashed,
          verifyToken,
          emailVerified: false,
          referralCode,
        },
        select: { id: true, email: true, name: true, role: true },
      });
      sendVerificationEmail(inlineName, inlineEmail, verifyToken).catch((e) =>
        console.error("verification email failed:", e)
      );
      user = created;
      createdNewUser = true;
      const token = generateToken(created);
      newUserAuthCookie = serialize("auth-token", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
      });
    }

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
    const subtotal = sanitizedItems.reduce((sum, i) => {
      const dbPrice = variantPriceMap.get(i.variantId)!;
      return sum + dbPrice * i.quantity;
    }, 0);
    let total = subtotal;

    // ── Apply coupon if provided ──
    let appliedCouponId: string | null = null;
    let couponDiscountAmount = 0;
    let freeShippingFromCoupon = false;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });

      if (!coupon) {
        return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
      }

      if (!coupon.active) {
        return NextResponse.json({ error: "This promo code is no longer active" }, { status: 400 });
      }

      const now = new Date();
      if (coupon.startsAt && new Date(coupon.startsAt) > now) {
        return NextResponse.json(
          { error: `This promo code becomes active on ${new Date(coupon.startsAt).toLocaleDateString()}` },
          { status: 400 }
        );
      }

      if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
        return NextResponse.json({ error: "This promo code has expired" }, { status: 400 });
      }

      if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json({ error: "This promo code has reached its usage limit" }, { status: 400 });
      }

      const buyerEmail = sanitizedShipping.email;
      if (coupon.blockedEmails) {
        const blocked = coupon.blockedEmails.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
        if (blocked.includes(buyerEmail)) {
          return NextResponse.json({ error: "This promo code is not available for your account" }, { status: 400 });
        }
      }
      if (coupon.allowedEmails) {
        const allowed = coupon.allowedEmails.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
        if (allowed.length > 0 && !allowed.includes(buyerEmail)) {
          return NextResponse.json({ error: "This promo code is not available for your account" }, { status: 400 });
        }
      }

      if (coupon.perUserLimit > 0) {
        const userUseCount = await prisma.order.count({
          where: { couponId: coupon.id, email: buyerEmail },
        });
        if (userUseCount >= coupon.perUserLimit) {
          return NextResponse.json(
            { error: `You have already used this promo code the maximum of ${coupon.perUserLimit} time${coupon.perUserLimit === 1 ? "" : "s"}` },
            { status: 400 }
          );
        }
      }

      if (total < coupon.minOrder) {
        return NextResponse.json(
          { error: `Minimum order of $${(coupon.minOrder / 100).toFixed(2)} required for this promo code` },
          { status: 400 }
        );
      }

      if (coupon.type === "shipping") {
        freeShippingFromCoupon = true;
        // discount amount is recorded after we know the shipping fee, below
      } else if (coupon.type === "percentage") {
        const discount = Math.round(total * (coupon.value / 100));
        total = Math.max(0, total - discount);
        couponDiscountAmount = discount;
      } else {
        const discount = Math.min(coupon.value, total);
        total = Math.max(0, total - discount);
        couponDiscountAmount = discount;
      }
      appliedCouponId = coupon.id;
    }

    // ── Calculate tax based on state ──
    const tax = calculateTax(sanitizedShipping.state, total);
    total = total + tax;

    // ── Validate and add shipping cost ──
    const VALID_SHIPPING_COSTS = [0, 795, 995, 1295, 4995]; // all possible shipping rates in cents
    const baseShippingFee = typeof clientShippingCost === "number"
      && clientShippingCost >= 0
      && VALID_SHIPPING_COSTS.includes(clientShippingCost)
      ? clientShippingCost
      : 795; // default to standard $7.95 if invalid
    const shipping_fee = freeShippingFromCoupon ? 0 : baseShippingFee;
    if (freeShippingFromCoupon) {
      couponDiscountAmount = baseShippingFee;
    }
    total = total + shipping_fee;

    // ── Generate invoice number ──
    const invoiceNumber = generateInvoiceNumber();

    // ── Resolve affiliate attribution (explicit code wins over cookie) ──
    let affiliateId: string | null = null;
    const explicitCode = affiliateCode?.trim().toUpperCase();
    const refCookie = cookieStore.get("revia_ref")?.value?.trim().toUpperCase();
    const codeToUse = explicitCode || refCookie;
    if (codeToUse) {
      const affiliate = await prisma.affiliate.findUnique({ where: { affiliateCode: codeToUse } });
      if (affiliate && affiliate.status === "approved" && affiliate.userId !== user.id) {
        affiliateId = affiliate.id;
      }
    }

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
        subtotal,
        couponDiscount: couponDiscountAmount,
        taxAmount: tax,
        shippingCost: shipping_fee,
        total,
        affiliateId,
        couponId: appliedCouponId,
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

    const response = NextResponse.json(
      {
        order: {
          id: order.id,
          invoiceNumber: order.invoiceNumber,
          total: order.total,
          status: order.status,
          paymentMethod: order.paymentMethod,
        },
        accountCreated: createdNewUser,
      },
      { status: 201 }
    );
    if (newUserAuthCookie) response.headers.append("Set-Cookie", newUserAuthCookie);
    return response;
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
