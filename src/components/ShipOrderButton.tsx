"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Loader2, CheckCircle, Download, ExternalLink } from "lucide-react";

interface ShipResult {
  trackingNumber: string;
  carrier: string;
  serviceLevel: string;
  labelUrl: string;
  trackingUrl: string;
  ratePaid: number;
}

export default function ShipOrderButton({
  orderId,
  invoiceNumber,
  hasEasypostKey,
}: {
  orderId: string;
  invoiceNumber: string;
  hasEasypostKey: boolean;
}) {
  const router = useRouter();
  const [shipping, setShipping] = useState(false);
  const [result, setResult] = useState<ShipResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleShip = async () => {
    if (!confirm(`Create shipment and buy USPS label for invoice ${invoiceNumber}?`)) return;

    setShipping(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/ship`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create shipment");

      setResult(data.shipment);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Shipment failed");
    } finally {
      setShipping(false);
    }
  };

  if (!hasEasypostKey) {
    return (
      <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4">
        <p className="text-sm text-neutral-500">
          EasyPost not configured. Add <code className="text-xs bg-neutral-100 px-1 rounded">EASYPOST_API_KEY</code> to .env to enable automatic label generation.
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-emerald-800">Shipment Created!</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-neutral-500">Tracking</p>
            <p className="font-mono font-semibold text-neutral-800">{result.trackingNumber}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Service</p>
            <p className="text-neutral-800">{result.carrier} {result.serviceLevel}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Label Cost</p>
            <p className="text-neutral-800">${(result.ratePaid / 100).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          {result.labelUrl && (
            <a
              href={result.labelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400 transition"
            >
              <Download className="h-3.5 w-3.5" />
              Download Label
            </a>
          )}
          {result.trackingUrl && (
            <a
              href={result.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-white border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Track Package
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        onClick={handleShip}
        disabled={shipping}
        className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-60 transition shadow-sm"
      >
        {shipping ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Shipment...
          </>
        ) : (
          <>
            <Truck className="h-4 w-4" />
            Create Shipment & Print Label
          </>
        )}
      </button>
      <p className="text-xs text-neutral-400">
        Buys the cheapest USPS rate via EasyPost. Label PDF will be available for download.
      </p>
    </div>
  );
}
