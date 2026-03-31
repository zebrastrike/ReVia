export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();
  const user = await getAuthUser(cookieStore);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const variants = await prisma.productVariant.findMany({
    include: { product: { select: { name: true, active: true } } },
    orderBy: [{ product: { name: "asc" } }, { label: "asc" }],
  });

  return NextResponse.json(variants);
}
