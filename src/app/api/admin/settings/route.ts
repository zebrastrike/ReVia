export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { PricingTier } from "@/lib/constants";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const defaultRates = [
    { label: "Standard Shipping", price: 795, estimate: "5-7 business days", minOrder: 0 },
    { label: "Priority Shipping", price: 1295, estimate: "3-5 business days", minOrder: 20000 },
  ];
  return NextResponse.json({
    activePricingTier: "retail",
    freeShippingEnabled: false,
    freeShippingThreshold: 15000,
    freeShippingExpiry: null,
    shippingRates: JSON.stringify(defaultRates),
    drawingEntryAmount: 5000,
    drawingPrize1: 10000,
    drawingPrize2: 5000,
    drawingPrize3: 2500,
    ...settings,
  });
}

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const user = await getAuthUser(cookieStore);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { activePricingTier, freeShippingEnabled, freeShippingThreshold, freeShippingExpiry, shippingRates, drawingEntryAmount, drawingPrize1, drawingPrize2, drawingPrize3 } = body as {
    activePricingTier?: PricingTier;
    freeShippingEnabled?: boolean;
    freeShippingThreshold?: number;
    freeShippingExpiry?: string | null;
    shippingRates?: string;
    drawingEntryAmount?: number;
    drawingPrize1?: number;
    drawingPrize2?: number;
    drawingPrize3?: number;
  };

  const update: Record<string, unknown> = {};

  if (activePricingTier !== undefined) {
    const valid: PricingTier[] = ["retail", "founders", "friends"];
    if (!valid.includes(activePricingTier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }
    update.activePricingTier = activePricingTier;
  }

  if (freeShippingEnabled !== undefined) {
    update.freeShippingEnabled = freeShippingEnabled;
  }

  if (freeShippingThreshold !== undefined) {
    if (typeof freeShippingThreshold !== "number" || freeShippingThreshold < 0) {
      return NextResponse.json({ error: "Invalid threshold" }, { status: 400 });
    }
    update.freeShippingThreshold = freeShippingThreshold;
  }

  if (freeShippingExpiry !== undefined) {
    update.freeShippingExpiry = freeShippingExpiry ? new Date(freeShippingExpiry) : null;
  }

  if (shippingRates !== undefined) {
    // Validate JSON structure
    try {
      const parsed = JSON.parse(shippingRates);
      if (!Array.isArray(parsed)) throw new Error("Must be array");
      for (const r of parsed) {
        if (!r.label || typeof r.price !== "number" || !r.estimate) {
          throw new Error("Each rate needs label, price (cents), and estimate");
        }
      }
      update.shippingRates = shippingRates;
    } catch (e) {
      return NextResponse.json({ error: `Invalid shipping rates: ${(e as Error).message}` }, { status: 400 });
    }
  }

  if (drawingEntryAmount !== undefined) update.drawingEntryAmount = drawingEntryAmount;
  if (drawingPrize1 !== undefined) update.drawingPrize1 = drawingPrize1;
  if (drawingPrize2 !== undefined) update.drawingPrize2 = drawingPrize2;
  if (drawingPrize3 !== undefined) update.drawingPrize3 = drawingPrize3;

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
