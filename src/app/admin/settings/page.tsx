import { prisma } from "@/lib/prisma";
import PricingTierToggle from "@/components/PricingTierToggle";
import FreeShippingEditor from "@/components/FreeShippingEditor";
import ShippingRateEditor from "@/components/ShippingRateEditor";
import type { PricingTier } from "@/lib/constants";
export const dynamic = "force-dynamic";

const DEFAULT_SHIPPING_RATES = [
  { label: "Standard Shipping", price: 795, estimate: "5-7 business days", minOrder: 0 },
  { label: "Priority Shipping", price: 1295, estimate: "3-5 business days", minOrder: 20000 },
];

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const activeTier = (settings?.activePricingTier ?? "retail") as PricingTier;
  const freeShippingEnabled = (settings as { freeShippingEnabled?: boolean })?.freeShippingEnabled ?? false;
  const freeShippingCents = settings?.freeShippingThreshold ?? 15000;
  const freeShippingExpiry = (settings as { freeShippingExpiry?: Date | null })?.freeShippingExpiry?.toISOString() ?? null;

  let shippingRates = DEFAULT_SHIPPING_RATES;
  try {
    const raw = (settings as { shippingRates?: string })?.shippingRates;
    if (raw) shippingRates = JSON.parse(raw);
  } catch { /* use defaults */ }

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
          <h3 className="text-base font-semibold text-neutral-900">Shipping Rates</h3>
          <p className="text-sm text-neutral-500 mt-1">
            Configure shipping tiers and pricing. These are used when no live shipping API key (EasyPost/PirateShip) is configured.
          </p>
        </div>
        <ShippingRateEditor initialRates={shippingRates} />
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">Free Shipping Promo</h3>
          <p className="text-sm text-neutral-500 mt-1">
            Enable a free shipping promotion for orders above a set amount. Overrides the rates above when active.
          </p>
        </div>
        <FreeShippingEditor enabled={freeShippingEnabled} currentCents={freeShippingCents} expiry={freeShippingExpiry} />
      </div>

    </div>
  );
}
