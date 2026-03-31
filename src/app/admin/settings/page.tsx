import { prisma } from "@/lib/prisma";
import PricingTierToggle from "@/components/PricingTierToggle";
import FreeShippingEditor from "@/components/FreeShippingEditor";
import type { PricingTier } from "@/lib/constants";
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const activeTier = (settings?.activePricingTier ?? "retail") as PricingTier;
  const freeShippingCents = settings?.freeShippingThreshold ?? 15000;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Site Settings</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Manage pricing tiers and site-wide configuration.
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
          <h3 className="text-base font-semibold text-neutral-900">Free Shipping Threshold</h3>
          <p className="text-sm text-neutral-500 mt-1">
            Orders at or above this amount qualify for free shipping. Updates the banner and checkout instantly.
          </p>
        </div>
        <FreeShippingEditor currentCents={freeShippingCents} />
      </div>
    </div>
  );
}
