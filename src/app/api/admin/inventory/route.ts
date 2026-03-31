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
  const { variantId, quantity, reorderThreshold } = body as {
    variantId: string;
    quantity?: number;
    reorderThreshold?: number;
  };

  if (!variantId) {
    return NextResponse.json({ error: "variantId required" }, { status: 400 });
  }

  const data: { quantity?: number; reorderThreshold?: number; inStock?: boolean } = {};
  if (typeof quantity === "number") {
    data.quantity = quantity;
    data.inStock = quantity > 0;
  }
  if (typeof reorderThreshold === "number") {
    data.reorderThreshold = reorderThreshold;
  }

  const variant = await prisma.productVariant.update({
    where: { id: variantId },
    data,
  });

  return NextResponse.json(variant);
}
