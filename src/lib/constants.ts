// All monetary values in CENTS (divide by 100 to display as dollars)

export const SHIPPING_METHODS = {
  standard: { label: "Standard Shipping", price: 795, estimate: "5-7 business days" },
  expedited: { label: "Expedited Shipping", price: 1495, estimate: "2-3 business days" },
  overnight: { label: "Overnight Shipping", price: 3495, estimate: "Next business day" },
} as const;

export type ShippingMethod = keyof typeof SHIPPING_METHODS;

// Legacy — kept for fallback only
export const FREE_SHIPPING_THRESHOLD = 15000;
export const SHIPPING_COST = 795;

export const PRICING_TIERS = {
  retail: { label: "Retail", key: "retail" },
  founders: { label: "Founders Member", key: "founders" },
  friends: { label: "Friends & Family", key: "friends" },
} as const;

export type PricingTier = keyof typeof PRICING_TIERS;
