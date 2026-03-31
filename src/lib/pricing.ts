import { prisma } from "@/lib/prisma";
import type { PricingTier } from "@/lib/constants";

export async function getActiveTier(): Promise<PricingTier> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  const tier = settings?.activePricingTier ?? "retail";
  return tier as PricingTier;
}

export function resolvePriceForVariant(
  variant: { price: number; retailPrice?: number | null; foundersPrice?: number | null; friendsPrice?: number | null },
  tier: PricingTier
): number {
  if (tier === "friends" && variant.friendsPrice != null) return variant.friendsPrice;
  if (tier === "founders" && variant.foundersPrice != null) return variant.foundersPrice;
  return variant.retailPrice ?? variant.price;
}

export function getTierSavingsMessage(
  variant: { price: number; retailPrice?: number | null; foundersPrice?: number | null; friendsPrice?: number | null },
  tier: PricingTier
): string | null {
  if (tier === "retail") return null;
  const retail = variant.retailPrice ?? variant.price;
  const tierPrice = resolvePriceForVariant(variant, tier);
  const savings = retail - tierPrice;
  if (savings <= 0) return null;
  return `Members save $${(savings / 100).toFixed(2)}`;
}
