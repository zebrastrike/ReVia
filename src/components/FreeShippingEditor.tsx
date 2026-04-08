"use client";

import { useState } from "react";

interface FreeShippingEditorProps {
  enabled: boolean;
  currentCents: number;
  expiry: string | null;
}

export default function FreeShippingEditor({ enabled: initialEnabled, currentCents, expiry: initialExpiry }: FreeShippingEditorProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [dollars, setDollars] = useState((currentCents / 100).toFixed(0));
  const [expiry, setExpiry] = useState(initialExpiry ? initialExpiry.slice(0, 16) : "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    const cents = Math.round(parseFloat(dollars) * 100);
    if (isNaN(cents) || cents < 0) return;

    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freeShippingEnabled: enabled,
          freeShippingThreshold: cents,
          freeShippingExpiry: expiry ? new Date(expiry).toISOString() : null,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 accent-sky-500"
        />
        <span className="text-sm font-medium text-neutral-700">
          Enable free shipping promo
        </span>
        {enabled && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
            ACTIVE
          </span>
        )}
      </label>

      {enabled && (
        <div className="space-y-3 pl-7">
          {/* Minimum spend */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Minimum order amount for free shipping
            </label>
            <div className="relative w-40">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-stone-500">$</span>
              <input
                type="number"
                min="0"
                step="1"
                value={dollars}
                onChange={(e) => setDollars(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white pl-7 pr-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Expiration */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Promo expires (leave blank for no expiration)
            </label>
            <input
              type="datetime-local"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            {expiry && new Date(expiry) < new Date() && (
              <p className="mt-1 text-xs text-red-500">This date has already passed — promo is expired.</p>
            )}
          </div>
        </div>
      )}

      {!enabled && (
        <p className="text-xs text-neutral-400 pl-7">
          Standard shipping rates: $7.95 / $14.95 / $34.95 (Standard / Expedited / Overnight)
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && (
          <span className="text-sm font-medium text-emerald-600">Saved!</span>
        )}
      </div>
    </div>
  );
}
