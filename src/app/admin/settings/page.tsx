import { prisma } from "@/lib/prisma";
import PricingTierToggle from "@/components/PricingTierToggle";
import FreeShippingEditor from "@/components/FreeShippingEditor";
import type { PricingTier } from "@/lib/constants";
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const activeTier = (settings?.activePricingTier ?? "retail") as PricingTier;
  const freeShippingEnabled = (settings as { freeShippingEnabled?: boolean })?.freeShippingEnabled ?? false;
  const freeShippingCents = settings?.freeShippingThreshold ?? 15000;
  const freeShippingExpiry = (settings as { freeShippingExpiry?: Date | null })?.freeShippingExpiry?.toISOString() ?? null;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Site Settings</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Manage pricing tiers, shipping promos, and site-wide configuration.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">Active Pricing Tier</h3>
          <p className="text-sm text-neutral-500 mt-1">
            Switches all product prices site-wide instantly. Select the tier to show customers.
          </p>
        </div>
        <PricingTierToggle current={activeTier} />
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">Free Shipping Promo</h3>
          <p className="text-sm text-neutral-500 mt-1">
            Enable a free shipping promotion for orders above a set amount. Standard rates are $7.95 / $14.95 / $34.95 when no promo is active.
          </p>
        </div>
        <FreeShippingEditor enabled={freeShippingEnabled} currentCents={freeShippingCents} expiry={freeShippingExpiry} />
      </div>

    </div>
  );
}
