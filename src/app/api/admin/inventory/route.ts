export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const user = await getAuthUser(cookieStore);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { variantId, quantity, reorderThreshold, stockStatus } = body as {
    variantId: string;
    quantity?: number;
    reorderThreshold?: number;
    stockStatus?: string;
  };

  if (!variantId) {
    return NextResponse.json({ error: "variantId required" }, { status: 400 });
  }

  const data: { quantity?: number; reorderThreshold?: number; inStock?: boolean; stockStatus?: string } = {};

  if (typeof reorderThreshold === "number") {
    data.reorderThreshold = reorderThreshold;
  }

  // If admin explicitly sets stockStatus, that takes priority
  if (typeof stockStatus === "string" && ["in_stock", "pre_order", "out_of_stock"].includes(stockStatus)) {
    data.stockStatus = stockStatus;
    data.inStock = stockStatus !== "out_of_stock";
  }

  if (typeof quantity === "number") {
    data.quantity = quantity;

    // Auto-switch to pre_order when qty hits 0 (unless admin explicitly set out_of_stock)
    if (quantity === 0 && data.stockStatus !== "out_of_stock") {
      // Only auto-switch if admin didn't explicitly set a status in this same request
      if (!stockStatus) {
        data.stockStatus = "pre_order";
        data.inStock = true;
      }
    }

    // Auto-switch back to in_stock when qty goes above 0 (if currently pre_order)
    if (quantity > 0 && !stockStatus) {
      const current = await prisma.productVariant.findUnique({ where: { id: variantId }, select: { stockStatus: true } });
      if (current?.stockStatus === "pre_order") {
        data.stockStatus = "in_stock";
        data.inStock = true;
      }
    }
  }

  const variant = await prisma.productVariant.update({
    where: { id: variantId },
    data,
  });

  return NextResponse.json(variant);
}
