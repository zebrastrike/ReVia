"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";
export const dynamic = "force-dynamic";

type VariantRow = {
  id: string;
  sku: string;
  label: string;
  quantity: number;
  reorderThreshold: number;
  inStock: boolean;
  product: { name: string; active: boolean };
};

type SortKey = "product" | "sku" | "variant" | "status" | "qty" | "reorder";
type SortDir = "asc" | "desc" | null;

function statusRank(qty: number, threshold: number) {
  if (qty === 0) return 0; // out of stock
  if (threshold > 0 && qty <= threshold) return 1; // low
  return 2; // in stock
}

function statusBadge(qty: number, threshold: number) {
  if (qty === 0)
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-red-600">
        <XCircle size={13} /> Out of Stock
      </span>
    );
  if (threshold > 0 && qty <= threshold)
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
        <AlertTriangle size={13} /> Low Stock
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-sky-600">
      <CheckCircle size={13} /> In Stock
    </span>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="inline h-3.5 w-3.5 ml-1 text-stone-300" />;
  return dir === "asc" ? (
    <ChevronUp className="inline h-3.5 w-3.5 ml-1 text-sky-500" />
  ) : (
    <ChevronDown className="inline h-3.5 w-3.5 ml-1 text-sky-500" />
  );
}

export default function AdminInventoryPage() {
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, { quantity?: string; reorderThreshold?: string }>>({});
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  useEffect(() => {
    fetch("/api/admin/inventory/list")
      .then((r) => r.json())
      .then((data) => { setVariants(data); setLoading(false); });
  }, []);

  function handleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  async function save(variantId: string) {
    const edit = edits[variantId];
    if (!edit) return;
    setSaving(variantId);
    const body: Record<string, number> = {};
    if (edit.quantity !== undefined) body.quantity = Number(edit.quantity);
    if (edit.reorderThreshold !== undefined) body.reorderThreshold = Number(edit.reorderThreshold);
    const res = await fetch("/api/admin/inventory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, ...body }),
    });
    if (res.ok) {
      const updated = await res.json();
      setVariants((prev) =>
        prev.map((v) =>
          v.id === variantId
            ? { ...v, quantity: updated.quantity, reorderThreshold: updated.reorderThreshold, inStock: updated.inStock }
            : v
        )
      );
      setEdits((prev) => { const next = { ...prev }; delete next[variantId]; return next; });
    }
    setSaving(null);
  }

  const filtered = variants.filter((v) => {
    if (filter === "out" && v.quantity !== 0) return false;
    if (filter === "low" && !(v.reorderThreshold > 0 && v.quantity > 0 && v.quantity <= v.reorderThreshold)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!v.product.name.toLowerCase().includes(q) && !v.sku.toLowerCase().includes(q) && !v.label.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortKey) {
      case "product":
        return dir * a.product.name.localeCompare(b.product.name);
      case "sku":
        return dir * a.sku.localeCompare(b.sku);
      case "variant":
        return dir * a.label.localeCompare(b.label);
      case "status":
        return dir * (statusRank(a.quantity, a.reorderThreshold) - statusRank(b.quantity, b.reorderThreshold));
      case "qty":
        return dir * (a.quantity - b.quantity);
      case "reorder":
        return dir * (a.reorderThreshold - b.reorderThreshold);
      default:
        return 0;
    }
  });

  if (loading) return <div className="text-sm text-neutral-500">Loading inventory...</div>;

  const columns: { key: SortKey; label: string; align?: "right" }[] = [
    { key: "product", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "variant", label: "Variant" },
    { key: "status", label: "Status" },
    { key: "qty", label: "Qty", align: "right" },
    { key: "reorder", label: "Reorder At", align: "right" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Inventory</h2>
          <p className="text-sm text-neutral-500 mt-1">{variants.length} variants across all products</p>
        </div>
        <div className="flex gap-2">
          {(["all", "low", "out"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === f ? "bg-sky-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {f === "all" ? "All" : f === "low" ? "Low Stock" : "Out of Stock"}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name, SKU, or variant..."
          className="w-full max-w-md bg-white border border-neutral-200 rounded-xl pl-9 pr-4 py-2.5 text-neutral-800 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-sky-500 transition-colors"
        />
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`${col.align === "right" ? "text-right" : "text-left"} px-4 py-3 font-medium text-neutral-600 cursor-pointer select-none hover:text-neutral-800 transition-colors`}
                >
                  {col.label}
                  <SortIcon active={sortKey === col.key} dir={sortKey === col.key ? sortDir : null} />
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {sorted.map((v) => {
              const edit = edits[v.id] ?? {};
              const qtyVal = edit.quantity ?? String(v.quantity);
              const thrVal = edit.reorderThreshold ?? String(v.reorderThreshold);
              const isDirty = edits[v.id] !== undefined;
              return (
                <tr key={v.id} className={`hover:bg-neutral-50 ${!v.product.active ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3 font-medium text-neutral-800">
                    {v.product.name}
                    {!v.product.active && <span className="ml-2 text-xs text-neutral-400">(hidden)</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">{v.sku}</td>
                  <td className="px-4 py-3 text-neutral-600">{v.label}</td>
                  <td className="px-4 py-3">{statusBadge(v.quantity, v.reorderThreshold)}</td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      min="0"
                      value={qtyVal}
                      onChange={(e) => setEdits((prev) => ({ ...prev, [v.id]: { ...prev[v.id], quantity: e.target.value } }))}
                      className="w-20 rounded-lg border border-neutral-200 px-2 py-1 text-right text-sm focus:border-sky-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      min="0"
                      value={thrVal}
                      onChange={(e) => setEdits((prev) => ({ ...prev, [v.id]: { ...prev[v.id], reorderThreshold: e.target.value } }))}
                      className="w-20 rounded-lg border border-neutral-200 px-2 py-1 text-right text-sm focus:border-sky-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isDirty && (
                      <button
                        onClick={() => save(v.id)}
                        disabled={saving === v.id}
                        className="flex items-center gap-1 rounded-lg bg-sky-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600 disabled:opacity-60 ml-auto"
                      >
                        {saving === v.id ? <RefreshCw size={12} className="animate-spin" /> : null}
                        Save
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-400">
                  No variants match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
