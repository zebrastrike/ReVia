import EasyPostClient from "@easypost/api";

/* ------------------------------------------------------------------ */
/*  EasyPost Shipping Client                                           */
/* ------------------------------------------------------------------ */

function getClient(): InstanceType<typeof EasyPostClient> {
  const key = process.env.EASYPOST_API_TEST_KEY || process.env.EASYPOST_API_KEY;
  if (!key) throw new Error("EASYPOST_API_KEY not configured");
  return new EasyPostClient(key);
}

// Ship-from address (ReVia warehouse)
const SHIP_FROM = {
  company: "ReVia Research Supply",
  street1: "15510 Old Wedgewood Ct",
  city: "Fort Myers",
  state: "FL",
  zip: "33908",
  country: "US",
  phone: "",
  email: "orders@revialife.com",
};

// Default parcel dimensions for peptide orders
const DEFAULT_PARCEL = {
  length: 6,
  width: 4,
  height: 3,
  weight: 8, // ounces
};

/* ------------------------------------------------------------------ */
/*  Create Shipment + Buy Cheapest USPS Label                          */
/* ------------------------------------------------------------------ */

interface ShipToAddress {
  name: string;
  street1: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  email?: string;
}

interface ShipResult {
  shipmentId: string;
  trackingNumber: string;
  carrier: string;
  serviceLevel: string;
  labelUrl: string;
  trackingUrl: string;
  rate: number; // cents
}

export async function createShipmentAndBuyLabel(
  toAddress: ShipToAddress
): Promise<ShipResult> {
  const client = getClient();

  // Create shipment
  const shipment = await client.Shipment.create({
    from_address: SHIP_FROM,
    to_address: {
      name: toAddress.name,
      street1: toAddress.street1,
      city: toAddress.city,
      state: toAddress.state,
      zip: toAddress.zip,
      country: toAddress.country || "US",
      email: toAddress.email,
    },
    parcel: DEFAULT_PARCEL,
  });

  // Filter to USPS rates only, sort by price
  const uspsRates = (shipment.rates || [])
    .filter((r: { carrier?: string }) => r.carrier === "USPS")
    .sort((a: { rate?: string }, b: { rate?: string }) => parseFloat(a.rate || "999") - parseFloat(b.rate || "999"));

  if (uspsRates.length === 0) {
    throw new Error("No USPS rates available for this shipment");
  }

  // Buy the cheapest USPS rate
  const cheapest = uspsRates[0] as { id: string; carrier: string; service: string; rate: string };
  const purchased = await client.Shipment.buy(shipment.id, cheapest.id);

  const tracker = purchased.tracker as { public_url?: string } | undefined;
  const postageLabel = purchased.postage_label as { label_url?: string } | undefined;

  return {
    shipmentId: purchased.id,
    trackingNumber: purchased.tracking_code || "",
    carrier: cheapest.carrier,
    serviceLevel: cheapest.service,
    labelUrl: postageLabel?.label_url || "",
    trackingUrl: tracker?.public_url || `https://tools.usps.com/go/TrackConfirmAction?tLabels=${purchased.tracking_code}`,
    rate: Math.round(parseFloat(cheapest.rate) * 100),
  };
}

/* ------------------------------------------------------------------ */
/*  Get available rates without buying                                 */
/* ------------------------------------------------------------------ */

export async function getRates(toAddress: ShipToAddress): Promise<Array<{
  carrier: string;
  service: string;
  rate: number; // cents
  estimatedDays: number | null;
}>> {
  const client = getClient();

  const shipment = await client.Shipment.create({
    from_address: SHIP_FROM,
    to_address: {
      name: toAddress.name,
      street1: toAddress.street1,
      city: toAddress.city,
      state: toAddress.state,
      zip: toAddress.zip,
      country: toAddress.country || "US",
    },
    parcel: DEFAULT_PARCEL,
  });

  return (shipment.rates || [])
    .filter((r: { carrier?: string }) => r.carrier === "USPS")
    .map((r: { carrier?: string; service?: string; rate?: string; est_delivery_days?: number }) => ({
      carrier: r.carrier || "USPS",
      service: r.service || "",
      rate: Math.round(parseFloat(r.rate || "0") * 100),
      estimatedDays: r.est_delivery_days || null,
    }))
    .sort((a: { rate: number }, b: { rate: number }) => a.rate - b.rate);
}

/* ------------------------------------------------------------------ */
/*  Build tracking URL by carrier                                      */
/* ------------------------------------------------------------------ */

export function getTrackingUrl(carrier: string, trackingNumber: string): string {
  switch (carrier.toUpperCase()) {
    case "USPS":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
    case "UPS":
      return `https://www.ups.com/track?tracknum=${trackingNumber}`;
    case "FEDEX":
      return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
    default:
      return "";
  }
}
