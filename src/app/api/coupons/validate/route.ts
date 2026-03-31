export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body as { code: string; subtotal: number };

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon) {
      return NextResponse.json({
        valid: false,
        message: "Invalid coupon code",
      });
    }

    if (!coupon.active) {
      return NextResponse.json({
        valid: false,
        message: "This coupon is no longer active",
      });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({
        valid: false,
        message: "This coupon has expired",
      });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({
        valid: false,
        message: "This coupon has reached its usage limit",
      });
    }

    if (subtotal < coupon.minOrder) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order of $${(coupon.minOrder / 100).toFixed(2)} required`,
      });
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = Math.round(subtotal * (coupon.value / 100));
    } else {
      discount = Math.min(coupon.value, subtotal);
    }

    return NextResponse.json({
      valid: true,
      discount,
      type: coupon.type,
      value: coupon.value,
      message:
        coupon.type === "percentage"
          ? `${coupon.value}% off applied!`
          : `$${(coupon.value / 100).toFixed(2)} off applied!`,
    });
  } catch (err) {
    console.error("POST /api/coupons/validate error:", err);
    return NextResponse.json(
      { valid: false, message: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
