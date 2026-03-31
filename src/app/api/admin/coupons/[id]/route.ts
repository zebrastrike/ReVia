export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { code, type, value, minOrder, maxUses, active, expiresAt } = body as {
      code?: string;
      type?: string;
      value?: number;
      minOrder?: number;
      maxUses?: number;
      active?: boolean;
      expiresAt?: string | null;
    };

    const data: Record<string, unknown> = {};
    if (code !== undefined) data.code = code.toUpperCase().trim();
    if (type !== undefined) data.type = type;
    if (value !== undefined) data.value = value;
    if (minOrder !== undefined) data.minOrder = minOrder;
    if (maxUses !== undefined) data.maxUses = maxUses;
    if (active !== undefined) data.active = active;
    if (expiresAt !== undefined) {
      data.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data,
    });

    return NextResponse.json({ coupon });
  } catch (err) {
    console.error("PATCH /api/admin/coupons/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/coupons/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
