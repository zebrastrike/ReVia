// All monetary values in CENTS (divide by 100 to display as dollars)

// Fallback only — live rates come from SiteSettings DB
export const SHIPPING_METHODS = {
  standard: { label: "Standard Shipping", price: 795, estimate: "5-7 business days" },
  priority: { label: "Priority Shipping", price: 1295, estimate: "2-3 business days" },
  overnight: { label: "Overnight Shipping", price: 4995, estimate: "Next business day" },
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

/* ------------------------------------------------------------------ */
/*  Payment Methods                                                    */
/* ------------------------------------------------------------------ */

export const PAYMENT_METHODS = {
  zelle: {
    label: "Zelle",
    icon: "💳",
    description: "Send payment via Zelle — instant and fee-free",
  },
  wire: {
    label: "Wire Transfer",
    icon: "🏦",
    description: "Domestic or international wire transfer",
  },
  bitcoin: {
    label: "Bitcoin (Kraken Pay)",
    icon: "₿",
    description: "Pay with Bitcoin via Kraken Pay",
  },
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;

export const ZELLE_INFO = {
  recipient: "Revia LLC",
  email: "mss@revialife.com",
  tag: "revialife",
};

export const WIRE_INFO = {
  bankName: "JPMorgan Chase Bank, N.A.",
  accountName: "Revia LLC",
  routingNumber: "267084131",
  accountNumber: "2917059589",
  accountType: "Checking",
  bankAddress: "JPMorgan Chase Bank, N.A., 383 Madison Avenue, New York, NY 10179, United States",
  companyAddress: "15510 Old Wedgewood Ct, Fort Myers, FL 33908",
};

export const KRAKEN_PAY_INFO = {
  paymentTag: "revialife",
  supportedCurrency: "BTC",
};
