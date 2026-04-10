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
  recipient: "ReVia Research Supply LLC",
  email: "payments@revialife.com",
};

export const WIRE_INFO = {
  bankName: "Bank of America",
  accountName: "ReVia Research Supply LLC",
  routingNumber: "063100277",
  accountNumber: "898142637201",
  swiftCode: "BOFAUS3N",
  bankAddress: "100 N Tryon St, Charlotte, NC 28255",
};

export const KRAKEN_PAY_INFO = {
  paymentTag: "reviaresearch",
  supportedCurrency: "BTC",
};
