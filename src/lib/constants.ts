// All monetary values in CENTS (divide by 100 to display as dollars)
export const FREE_SHIPPING_THRESHOLD = 15000; // $150.00
export const SHIPPING_COST = 2500; // $25.00

export const PRICING_TIERS = {
  retail: { label: "Retail", key: "retail" },
  founders: { label: "Founders Member", key: "founders" },
  friends: { label: "Friends & Family", key: "friends" },
} as const;

export type PricingTier = keyof typeof PRICING_TIERS;
