"use client";

import { useState, useTransition } from "react";
import { PRICING_TIERS } from "@/lib/constants";
import type { PricingTier } from "@/lib/constants";

export default function PricingTierToggle({ current }: { current: PricingTier }) {
  const [active, setActive] = useState<PricingTier>(current);
  const [isPending, startTransition] = useTransition();

  async function handleChange(tier: PricingTier) {
    startTransition(async () => {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activePricingTier: tier }),
      });
      if (res.ok) setActive(tier);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isPending ? "bg-yellow-400 animate-pulse" : "bg-sky-500"}`} />
        <span className="text-sm text-neutral-500">
          {isPending ? "Saving..." : "Live — changes take effect immediately"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(PRICING_TIERS) as PricingTier[]).map((tier) => {
          const isActive = active === tier;
          return (
            <button
              key={tier}
              onClick={() => handleChange(tier)}
              disabled={isPending}
              className={`relative rounded-xl border-2 px-4 py-4 text-left transition-all ${
                isActive
                  ? "border-sky-500 bg-sky-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              } disabled:opacity-60`}
            >
              {isActive && (
                <span className="absolute top-2 right-2 text-xs font-semibold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">
                  LIVE
                </span>
              )}
              <p className={`text-sm font-semibold ${isActive ? "text-stone-600" : "text-neutral-700"}`}>
                {PRICING_TIERS[tier].label}
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                {tier === "retail" && "Standard public pricing"}
                {tier === "founders" && "Founders Member pricing"}
                {tier === "friends" && "Friends & Family pricing"}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
