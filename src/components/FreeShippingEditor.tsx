"use client";

import { useState } from "react";

export default function FreeShippingEditor({ currentCents }: { currentCents: number }) {
  const [dollars, setDollars] = useState((currentCents / 100).toFixed(0));
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
        body: JSON.stringify({ freeShippingThreshold: cents }),
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
    <div className="flex items-center gap-3">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-stone-500">$</span>
        <input
          type="number"
          min="0"
          step="1"
          value={dollars}
          onChange={(e) => setDollars(e.target.value)}
          className="w-32 rounded-lg border border-neutral-300 bg-white pl-7 pr-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Update"}
      </button>
      {saved && (
        <span className="text-sm font-medium text-emerald-600">Saved!</span>
      )}
    </div>
  );
}
