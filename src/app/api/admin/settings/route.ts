export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { PricingTier } from "@/lib/constants";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json(settings ?? { activePricingTier: "retail", freeShippingThreshold: 15000 });
}

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const user = await getAuthUser(cookieStore);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { activePricingTier, freeShippingThreshold } = body as {
    activePricingTier?: PricingTier;
    freeShippingThreshold?: number;
  };

  const update: Record<string, unknown> = {};

  if (activePricingTier !== undefined) {
    const valid: PricingTier[] = ["retail", "founders", "friends"];
    if (!valid.includes(activePricingTier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }
    update.activePricingTier = activePricingTier;
  }

  if (freeShippingThreshold !== undefined) {
    if (typeof freeShippingThreshold !== "number" || freeShippingThreshold < 0) {
      return NextResponse.json({ error: "Invalid threshold" }, { status: 400 });
    }
    update.freeShippingThreshold = freeShippingThreshold;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update,
    create: { id: "singleton", activePricingTier: "retail", freeShippingThreshold: 15000, ...update },
  });

  return NextResponse.json(settings);
}
