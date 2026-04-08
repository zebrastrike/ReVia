"use client";

import { useState } from "react";

interface DrawingSettingsEditorProps {
  entryAmount: number;
  prize1: number;
  prize2: number;
  prize3: number;
}

export default function DrawingSettingsEditor({ entryAmount, prize1, prize2, prize3 }: DrawingSettingsEditorProps) {
  const [entry, setEntry] = useState((entryAmount / 100).toFixed(0));
  const [p1, setP1] = useState((prize1 / 100).toFixed(0));
  const [p2, setP2] = useState((prize2 / 100).toFixed(0));
  const [p3, setP3] = useState((prize3 / 100).toFixed(0));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const inputClass = "w-28 rounded-lg border border-neutral-300 bg-white pl-7 pr-3 py-2 text-sm text-neutral-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500";

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drawingEntryAmount: Math.round(parseFloat(entry) * 100),
          drawingPrize1: Math.round(parseFloat(p1) * 100),
          drawingPrize2: Math.round(parseFloat(p2) * 100),
          drawingPrize3: Math.round(parseFloat(p3) * 100),
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
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1.5">
          Spend amount per entry
        </label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-stone-500">$</span>
            <input type="number" min="1" value={entry} onChange={(e) => setEntry(e.target.value)} className={inputClass} />
          </div>
          <span className="text-sm text-stone-500">spent = 1 entry</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">1st Place Prize</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-stone-500">$</span>
            <input type="number" min="0" value={p1} onChange={(e) => setP1(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">2nd Place Prize</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-stone-500">$</span>
            <input type="number" min="0" value={p2} onChange={(e) => setP2(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">3rd Place Prize</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-stone-500">$</span>
            <input type="number" min="0" value={p3} onChange={(e) => setP3(e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && <span className="text-sm font-medium text-emerald-600">Saved!</span>}
      </div>
    </div>
  );
}
