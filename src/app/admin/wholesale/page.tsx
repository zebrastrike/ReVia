"use client";

import { useState } from "react";
import { Send, Plus, Minus, Trash2, Loader2, CheckCircle, ShoppingCart } from "lucide-react";
export const dynamic = "force-dynamic";

// Wholesale catalog from AgeREcode price list (prices in CENTS)
const WHOLESALE_CATALOG = [
  { category: "ORAL CAPSULES", items: [
    { name: "REbalance Bottle", variant: "120 Capsules", sku: "RV-OCS-REB-120-ORA", price: 6800 },
    { name: "REbalance Sample", variant: "20 Capsules", sku: "RV-OCS-REB-20-ORA", price: 600 },
    { name: "REcover Bottle", variant: "60 Capsules", sku: "RV-OCS-REC-60-ORA", price: 5400 },
    { name: "REcover Sample", variant: "10 Capsules", sku: "RV-OCS-REC-10-ORA", price: 450 },
    { name: "REvive Bottle", variant: "60 Capsules", sku: "RV-OCS-REV-60-ORA", price: 6300 },
    { name: "REvive Sample", variant: "10 Capsules", sku: "RV-OCS-REV-10-ORA", price: 550 },
  ]},
  { category: "METABOLIC & metabolic optimization", items: [
    { name: "5-Amino-1MQ", variant: "5mg", sku: "RV-MWM-5AM-5-SC", price: 2250 },
    { name: "5-Amino-1MQ", variant: "10mg", sku: "RV-MWM-5AM-10-SC", price: 3375 },
    { name: "AOD-9604", variant: "5mg", sku: "RV-MWM-AOD-5-SC", price: 3275 },
    { name: "AOD-9604", variant: "10mg", sku: "RV-MWM-AOD-10-SC", price: 5075 },
    { name: "Adipotide", variant: "5mg", sku: "RV-MWM-ADI-5-SC", price: 6100 },
    { name: "Cagrilintide", variant: "5mg", sku: "RV-MWM-CAG-5-SC", price: 3375 },
    { name: "Cagrilintide", variant: "10mg", sku: "RV-MWM-CAG-10-SC", price: 5625 },
    { name: "MOTS-c", variant: "10mg", sku: "RV-MWM-MOT-10-SC", price: 2475 },
    { name: "MOTS-c", variant: "40mg", sku: "RV-MWM-MOT-40-SC", price: 6525 },
    { name: "Mazdutide", variant: "10mg", sku: "RV-MWM-MAZ-10-SC", price: 6500 },
    { name: "Retatrutide", variant: "5mg", sku: "RV-MWM-RET-5-SC", price: 2100 },
    { name: "Retatrutide", variant: "10mg", sku: "RV-MWM-RET-10-SC", price: 3275 },
    { name: "Retatrutide", variant: "30mg", sku: "RV-MWM-RET-30-SC", price: 7100 },
    { name: "Retatrutide", variant: "60mg", sku: "RV-MWM-RET-60-SC", price: 11000 },
    { name: "Semaglutide", variant: "5mg", sku: "RV-MWM-SEM-5-SC", price: 2475 },
    { name: "Semaglutide", variant: "10mg", sku: "RV-MWM-SEM-10-SC", price: 3300 },
    { name: "Semaglutide", variant: "30mg", sku: "RV-MWM-SEM-30-SC", price: 3700 },
    { name: "Survodutide", variant: "10mg", sku: "RV-MWM-SUR-10-SC", price: 8950 },
    { name: "Tirzepatide", variant: "5mg", sku: "RV-MWM-TIR-5-SC", price: 1900 },
    { name: "Tirzepatide", variant: "10mg", sku: "RV-MWM-TIR-10-SC", price: 2400 },
    { name: "Tirzepatide", variant: "15mg", sku: "RV-MWM-TIR-15-SC", price: 3100 },
    { name: "Tirzepatide", variant: "30mg", sku: "RV-MWM-TIR-30-SC", price: 3900 },
    { name: "Tirzepatide", variant: "60mg", sku: "RV-MWM-TIR-60-SC", price: 6175 },
  ]},
  { category: "GROWTH HORMONE & PERFORMANCE", items: [
    { name: "AICAR", variant: "5mg", sku: "RV-GHP-AIC-5-SC", price: 2400 },
    { name: "CJC-1295 (no DAC)", variant: "5mg", sku: "RV-GHP-CJC-5-SC", price: 2475 },
    { name: "CJC-1295 (no DAC)", variant: "10mg", sku: "RV-GHP-CJC-10-SC", price: 5100 },
    { name: "CJC-1295 with DAC", variant: "5mg", sku: "RV-GHP-CJCNOD-5-SC", price: 5075 },
    { name: "CJC-1295 + Ipamorelin", variant: "5/5mg", sku: "RV-GHP-CJC-5/5-SC", price: 3300 },
    { name: "Follistatin-344", variant: "1mg", sku: "RV-GHP-FOL-1-SC", price: 7700 },
    { name: "GHRP-2", variant: "5mg", sku: "RV-GHP-GH2-5-SC", price: 1475 },
    { name: "GHRP-2", variant: "10mg", sku: "RV-GHP-GH2-10-SC", price: 2100 },
    { name: "GHRP-6", variant: "5mg", sku: "RV-GHP-GH6-5-SC", price: 1475 },
    { name: "GHRP-6", variant: "10mg", sku: "RV-GHP-GH6-10-SC", price: 2100 },
    { name: "HGH Fragment 176-191", variant: "5mg", sku: "RV-GHP-HGH-5-SC", price: 3700 },
    { name: "Hexarellin Acetate", variant: "5mg", sku: "RV-GHP-HEX-5-SC", price: 2600 },
    { name: "IGF-1 LR3", variant: "0.1mg", sku: "RV-GHP-IGF-0.1-SC", price: 1300 },
    { name: "IGF-1 LR3", variant: "1mg", sku: "RV-GHP-IGF-1-SC", price: 6750 },
    { name: "Ipamorelin", variant: "5mg", sku: "RV-GHP-IPA-5-SC", price: 1500 },
    { name: "Ipamorelin", variant: "10mg", sku: "RV-GHP-IPA-10-SC", price: 2600 },
    { name: "MGF", variant: "2mg", sku: "RV-GHP-MGF-2-SC", price: 2400 },
    { name: "Sermorelin", variant: "5mg", sku: "RV-GHP-SER-5-SC", price: 2375 },
    { name: "Sermorelin", variant: "10mg", sku: "RV-GHP-SER-10-SC", price: 3700 },
    { name: "Tesamorelin", variant: "5mg", sku: "RV-GHP-TES-5-SC", price: 3600 },
    { name: "Tesamorelin", variant: "10mg", sku: "RV-GHP-TES-10-SC", price: 6600 },
  ]},
  { category: "HEALING, RECOVERY & IMMUNE", items: [
    { name: "ARA-290", variant: "10mg", sku: "RV-HRI-ARA-10-SC", price: 2300 },
    { name: "BPC-157", variant: "5mg", sku: "RV-HRI-BPC-5-SC", price: 1700 },
    { name: "BPC-157", variant: "10mg", sku: "RV-HRI-BPC-10-SC", price: 2250 },
    { name: "BPC-157/TB-500", variant: "5/5mg", sku: "RV-HRI-BPCTB-10-SC", price: 3375 },
    { name: "BPC-157/TB-500", variant: "10/10mg", sku: "RV-HRI-BPCTB-20-SC", price: 6200 },
    { name: "GHK-Cu", variant: "100mg", sku: "RV-HRI-GHK-100-SC", price: 1475 },
    { name: "KPV", variant: "5mg", sku: "RV-HRI-KPV-5-SC", price: 1350 },
    { name: "KPV", variant: "10mg", sku: "RV-HRI-KPV-10-SC", price: 1700 },
    { name: "LL-37", variant: "5mg", sku: "RV-HRI-LL3-5-SC", price: 3000 },
    { name: "Oxytocin Acetate", variant: "2mg", sku: "RV-HRI-OXY-2-SC", price: 1350 },
    { name: "TB-500", variant: "5mg", sku: "RV-HRI-TB5-5-SC", price: 2800 },
    { name: "TB-500", variant: "10mg", sku: "RV-HRI-TB5-10-SC", price: 4950 },
    { name: "Thymalin", variant: "10mg", sku: "RV-HRI-THY-10-SC", price: 2150 },
    { name: "Thymosin Alpha-1", variant: "5mg", sku: "RV-HRI-TA1-5-SC", price: 3100 },
    { name: "Thymosin Alpha-1", variant: "10mg", sku: "RV-HRI-TA1-10-SC", price: 5600 },
    { name: "VIP", variant: "5mg", sku: "RV-HRI-VIP-5-SC", price: 2800 },
    { name: "VIP", variant: "10mg", sku: "RV-HRI-VIP-10-SC", price: 5000 },
  ]},
  { category: "COGNITIVE & LONGEVITY", items: [
    { name: "Cerebrolysin", variant: "60mg (liquid)", sku: "RV-CL-CER-60-LIQ", price: 1500 },
    { name: "Dihexa", variant: "5mg", sku: "RV-CL-DIH-5-SC", price: 3400 },
    { name: "Dihexa", variant: "10mg", sku: "RV-CL-DIH-10-SC", price: 4500 },
    { name: "Epitalon", variant: "10mg", sku: "RV-CL-EPI-10-SC", price: 1700 },
    { name: "Epitalon", variant: "50mg", sku: "RV-CL-EPI-50-SC", price: 4950 },
    { name: "FOX-04", variant: "10mg", sku: "RV-CL-FOX-10-SC", price: 12900 },
    { name: "Humanin", variant: "5mg", sku: "RV-CL-HUM-5-SC", price: 2800 },
    { name: "Humanin", variant: "10mg", sku: "RV-CL-HUM-10-SC", price: 4500 },
    { name: "NAD+", variant: "100mg", sku: "RV-CL-NAD-100-SC", price: 1300 },
    { name: "NAD+", variant: "500mg", sku: "RV-CL-NAD-500-SC", price: 3000 },
    { name: "Pinealon", variant: "10mg", sku: "RV-CL-PIN-10-SC", price: 2300 },
    { name: "Pinealon", variant: "20mg", sku: "RV-CL-PIN-20-SC", price: 3150 },
    { name: "SLU-PP-332", variant: "5mg", sku: "RV-CL-SLU-5-SC", price: 4500 },
    { name: "SS-31", variant: "10mg", sku: "RV-CL-SS3-10-SC", price: 3150 },
    { name: "Selank", variant: "5mg", sku: "RV-CL-SEL-5-SC", price: 1350 },
    { name: "Selank", variant: "10mg", sku: "RV-CL-SEL-10-SC", price: 2250 },
    { name: "Semax", variant: "5mg", sku: "RV-CL-SEM-5-SC", price: 1250 },
    { name: "Semax", variant: "10mg", sku: "RV-CL-SEM-10-SC", price: 2025 },
  ]},
  { category: "SEXUAL HEALTH & SPECIALTY", items: [
    { name: "DSIP", variant: "5mg", sku: "RV-SHS-DSI-5-SC", price: 1800 },
    { name: "DSIP", variant: "15mg", sku: "RV-SHS-DSI-15-SC", price: 3300 },
    { name: "Kisspeptin", variant: "5mg", sku: "RV-SHS-KIS-5-SC", price: 2250 },
    { name: "Kisspeptin", variant: "10mg", sku: "RV-SHS-KIS-10-SC", price: 3700 },
    { name: "Melanotan-1", variant: "10mg", sku: "RV-SHS-MT1-10-SC", price: 1700 },
    { name: "Melanotan-2", variant: "10mg", sku: "RV-SHS-MT2-10-SC", price: 1575 },
    { name: "PT-141", variant: "10mg", sku: "RV-SHS-PT1-10-SC", price: 2400 },
  ]},
  { category: "TOPICALS & SERUMS", items: [
    { name: "SNAP-8", variant: "10mg", sku: "RV-TS-SNA-10-SC", price: 1250 },
    { name: "SNAP-8 + GHK-Cu Serum", variant: "30ml", sku: "RV-TS-SNA-30-SER", price: 2150 },
    { name: "PRiVIVE Transdermal", variant: "30ml", sku: "RV-TS-PRI-30-SER", price: 3875 },
  ]},
  { category: "SPECIALTY BLENDS", items: [
    { name: "GLOW", variant: "50/10/10mg", sku: "RV-SBL-GLO-70-SC", price: 6400 },
    { name: "Glutathione", variant: "1,500mg", sku: "RV-SBL-GLU-1500-SC", price: 2250 },
    { name: "KLOW", variant: "50/10/10/10mg", sku: "RV-SBL-KLO-80-SC", price: 6600 },
    { name: "L-Carnitine", variant: "600mg (liquid)", sku: "RV-SBL-LCA-600-LIQ", price: 2475 },
    { name: "LC120", variant: "10ml", sku: "RV-SBL-LC1-10-LIQ", price: 2150 },
    { name: "LC216", variant: "10ml", sku: "RV-SBL-LC2-10-LIQ", price: 2150 },
    { name: "Super Human Blend", variant: "10ml", sku: "RV-SBL-SUP-10-LIQ", price: 2925 },
  ]},
  { category: "SUPPLIES", items: [
    { name: "Acetic Acid Water", variant: "10ml", sku: "RV-H2O-AES-10-LIQ", price: 350 },
    { name: "BAC Water", variant: "10ml", sku: "RV-H2O-BAC-10-LIQ", price: 350 },
  ]},
];

type OrderItem = { sku: string; productName: string; variant: string; quantity: number; wholesalePrice: number };

export default function WholesaleOrderPage() {
  const [cart, setCart] = useState<Map<string, OrderItem>>(new Map());
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ orderRef: string; totalCost: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addItem = (item: typeof WHOLESALE_CATALOG[0]["items"][0]) => {
    setCart(prev => {
      const next = new Map(prev);
      const existing = next.get(item.sku);
      if (existing) {
        next.set(item.sku, { ...existing, quantity: existing.quantity + 1 });
      } else {
        next.set(item.sku, { sku: item.sku, productName: item.name, variant: item.variant, quantity: 1, wholesalePrice: item.price });
      }
      return next;
    });
  };

  const updateQty = (sku: string, qty: number) => {
    setCart(prev => {
      const next = new Map(prev);
      if (qty <= 0) { next.delete(sku); } else {
        const existing = next.get(sku);
        if (existing) next.set(sku, { ...existing, quantity: qty });
      }
      return next;
    });
  };

  const totalItems = Array.from(cart.values()).reduce((s, i) => s + i.quantity, 0);
  const totalCost = Array.from(cart.values()).reduce((s, i) => s + i.wholesalePrice * i.quantity, 0);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: Array.from(cart.values()), notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setCart(new Map());
      setNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle className="h-16 w-16 text-emerald-500 mb-4" />
        <h1 className="text-2xl font-bold text-neutral-900">Wholesale Order Submitted</h1>
        <p className="text-sm text-neutral-500 mt-2">Ref: <span className="font-mono font-semibold">{result.orderRef}</span></p>
        <p className="text-sm text-neutral-500">Total: <span className="font-semibold">${(result.totalCost / 100).toFixed(2)}</span></p>
        <p className="text-xs text-neutral-400 mt-4">Order sent to orders@integrativepracticesolutions.com</p>
        <button onClick={() => setResult(null)} className="mt-6 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 transition">
          New Order
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Wholesale Order Form</h1>
          <p className="text-sm text-neutral-500 mt-1">AgeREcode wholesale pricing — orders sent to supplier</p>
        </div>
        {cart.size > 0 && (
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <ShoppingCart size={16} />
            {totalItems} items — <span className="font-semibold">${(totalCost / 100).toFixed(2)}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Catalog */}
      {WHOLESALE_CATALOG.map((section) => (
        <div key={section.category} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-200">
            <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">{section.category}</h2>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {section.items.map((item) => {
                const inCart = cart.get(item.sku);
                return (
                  <tr key={item.sku} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                    <td className="px-6 py-2.5 font-medium text-neutral-800">{item.name}</td>
                    <td className="px-4 py-2.5 text-neutral-500">{item.variant}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-neutral-400">{item.sku}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-neutral-700">${(item.price / 100).toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-right w-36">
                      {inCart ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => updateQty(item.sku, inCart.quantity - 1)} className="rounded-md bg-neutral-100 p-1 hover:bg-neutral-200">
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={inCart.quantity}
                            onChange={(e) => updateQty(item.sku, parseInt(e.target.value) || 0)}
                            className="w-14 rounded-md border border-neutral-200 px-2 py-1 text-center text-sm"
                          />
                          <button onClick={() => updateQty(item.sku, inCart.quantity + 1)} className="rounded-md bg-neutral-100 p-1 hover:bg-neutral-200">
                            <Plus size={14} />
                          </button>
                          <button onClick={() => updateQty(item.sku, 0)} className="text-neutral-300 hover:text-red-500">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => addItem(item)} className="rounded-md bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-100 transition">
                          <Plus size={12} className="inline mr-1" />Add
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {/* Order Summary + Submit */}
      {cart.size > 0 && (
        <div className="lg:sticky lg:bottom-4 rounded-2xl border border-sky-200 bg-sky-50 p-6 space-y-4">
          <h3 className="text-lg font-bold text-neutral-900">Order Summary</h3>
          <div className="space-y-2">
            {Array.from(cart.values()).map((item) => (
              <div key={item.sku} className="flex justify-between text-sm">
                <span className="text-neutral-700">{item.productName} ({item.variant}) x{item.quantity}</span>
                <span className="font-medium">${((item.wholesalePrice * item.quantity) / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <hr className="border-sky-200" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total ({totalItems} items)</span>
            <span>${(totalCost / 100).toFixed(2)}</span>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Order notes (optional)..."
            className="w-full rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm placeholder-neutral-400 outline-none focus:border-sky-400"
            rows={2}
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-60 transition"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Submit Wholesale Order
          </button>
        </div>
      )}
    </div>
  );
}
