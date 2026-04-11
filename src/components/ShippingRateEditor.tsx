"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, Save, Truck } from "lucide-react";

interface ShippingRate {
  label: string;
  price: number; // cents
  estimate: string;
  minOrder: number; // cents — order subtotal must be >= this to see this rate
}

export default function ShippingRateEditor({
  initialRates,
}: {
  initialRates: ShippingRate[];
}) {
  const [rates, setRates] = useState<ShippingRate[]>(initialRates);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const updateRate = (index: number, field: keyof ShippingRate, value: string | number) => {
    setRates((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const addRate = () => {
    setRates((prev) => [
      ...prev,
      { label: "New Rate", price: 0, estimate: "3-5 business days", minOrder: 0 },
    ]);
  };

  const removeRate = (index: number) => {
    if (rates.length <= 1) return; // must have at least 1
    setRates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingRates: JSON.stringify(rates) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setMessage({ type: "success", text: "Shipping rates updated!" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30";

  return (
    <div className="space-y-4">
      {message && (
        <div className={`rounded-lg px-4 py-2.5 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      <p className="text-xs text-neutral-500">
        Configure shipping tiers. Use "Min Order" to show rates only above a certain subtotal (e.g. show Priority only for orders over $200). Set to 0 for all orders. When a shipping API key is added (EasyPost/PirateShip), live rates will override these.
      </p>

      <div className="space-y-3">
        {rates.map((rate, i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-sky-500" />
                <span className="text-sm font-semibold text-neutral-700">Rate {i + 1}</span>
              </div>
              {rates.length > 1 && (
                <button onClick={() => removeRate(i)} className="text-neutral-300 hover:text-red-500 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Label</label>
                <input
                  type="text"
                  value={rate.label}
                  onChange={(e) => updateRate(i, "label", e.target.value)}
                  className={inputClass}
                  placeholder="Standard Shipping"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Price (cents)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={rate.price}
                    onChange={(e) => updateRate(i, "price", parseInt(e.target.value) || 0)}
                    className={inputClass}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                    ${(rate.price / 100).toFixed(2)}
                  </span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Estimate</label>
                <input
                  type="text"
                  value={rate.estimate}
                  onChange={(e) => updateRate(i, "estimate", e.target.value)}
                  className={inputClass}
                  placeholder="5-7 business days"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Min Order (cents, 0 = all)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={rate.minOrder}
                    onChange={(e) => updateRate(i, "minOrder", parseInt(e.target.value) || 0)}
                    className={inputClass}
                  />
                  {rate.minOrder > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                      ${(rate.minOrder / 100).toFixed(0)}+
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={addRate}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Add Rate
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-60 transition"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Shipping Rates
        </button>
      </div>
    </div>
  );
}
