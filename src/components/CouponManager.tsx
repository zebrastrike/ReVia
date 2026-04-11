"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, X, ToggleLeft, ToggleRight, Pencil, Save, Ban, UserCheck } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  allowedEmails: string;
  blockedEmails: string;
  expiresAt: string | null;
  createdAt: string;
}

export default function CouponManager({
  initialCoupons,
}: {
  initialCoupons: Coupon[];
}) {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Coupon>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrder: "",
    maxUses: "",
    expiresAt: "",
    allowedEmails: "",
    blockedEmails: "",
  });

  const inputClass =
    "w-full rounded-lg border border-sky-200/40 bg-white/50 px-4 py-2.5 text-sm text-stone-800 placeholder-gray-500 outline-none transition focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.code,
          type: formData.type,
          value: Number(formData.value),
          minOrder: formData.minOrder ? Number(formData.minOrder) : 0,
          maxUses: formData.maxUses ? Number(formData.maxUses) : 0,
          expiresAt: formData.expiresAt || null,
          allowedEmails: formData.allowedEmails || "",
          blockedEmails: formData.blockedEmails || "",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create coupon");

      setCoupons((prev) => [data.coupon, ...prev]);
      setFormData({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiresAt: "", allowedEmails: "", blockedEmails: "" });
      setShowForm(false);
      setMessage({ type: "success", text: "Coupon created!" });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to create" });
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !coupon.active }),
      });
      if (res.ok) {
        setCoupons((prev) => prev.map((c) => c.id === coupon.id ? { ...c, active: !c.active } : c));
      }
    } catch (err) {
      console.error("Failed to toggle coupon:", err);
    }
  };

  const startEditing = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setEditData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder,
      maxUses: coupon.maxUses,
      allowedEmails: coupon.allowedEmails || "",
      blockedEmails: coupon.blockedEmails || "",
    });
  };

  const handleSaveEdit = async (id: string) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (res.ok) {
        setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, ...data.coupon } : c));
        setEditingId(null);
        setEditData({});
        setMessage({ type: "success", text: "Coupon updated!" });
      }
    } catch (err) {
      console.error("Failed to save coupon:", err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        setMessage({ type: "success", text: "Coupon deleted." });
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete coupon:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-600"}`}>
          {message.text}
        </div>
      )}

      {/* Create Button / Form */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
          <Plus size={16} /> New Coupon
        </button>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Create Coupon</h2>
            <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600 transition"><X size={18} /></button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Code</label>
                <input type="text" required value={formData.code} onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))} placeholder="SAVE20" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Type</label>
                <select value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))} className={inputClass}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Value {formData.type === "percentage" ? "(%)" : "(cents)"}</label>
                <input type="number" required value={formData.value} onChange={(e) => setFormData((p) => ({ ...p, value: e.target.value }))} placeholder={formData.type === "percentage" ? "20" : "500"} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Min Order (cents, 0 = none)</label>
                <input type="number" value={formData.minOrder} onChange={(e) => setFormData((p) => ({ ...p, minOrder: e.target.value }))} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Max Uses (0 = unlimited)</label>
                <input type="number" value={formData.maxUses} onChange={(e) => setFormData((p) => ({ ...p, maxUses: e.target.value }))} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Expires At (optional)</label>
                <input type="datetime-local" value={formData.expiresAt} onChange={(e) => setFormData((p) => ({ ...p, expiresAt: e.target.value }))} className={inputClass} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                  <UserCheck size={12} /> Allowed Emails (comma-separated, empty = anyone)
                </label>
                <input type="text" value={formData.allowedEmails} onChange={(e) => setFormData((p) => ({ ...p, allowedEmails: e.target.value }))} placeholder="vip@example.com, friend@example.com" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                  <Ban size={12} /> Blocked Emails (comma-separated)
                </label>
                <input type="text" value={formData.blockedEmails} onChange={(e) => setFormData((p) => ({ ...p, blockedEmails: e.target.value }))} placeholder="banned@example.com" className={inputClass} />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={creating} className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-60">
                {creating && <Loader2 size={14} className="animate-spin" />} Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      <div className="space-y-3">
        {coupons.length === 0 ? (
          <p className="text-neutral-400 text-sm py-12 text-center bg-white rounded-2xl border border-neutral-200">No coupons yet.</p>
        ) : (
          coupons.map((coupon) => {
            const isEditing = editingId === coupon.id;

            return (
              <div key={coupon.id} className={`rounded-2xl border bg-white p-5 transition ${coupon.active ? "border-neutral-200" : "border-neutral-100 opacity-60"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Code + Badge row */}
                    <div className="flex items-center gap-3 mb-2">
                      {isEditing ? (
                        <input type="text" value={editData.code ?? ""} onChange={(e) => setEditData(p => ({ ...p, code: e.target.value }))} className="font-mono text-lg font-bold text-sky-600 bg-sky-50 border border-sky-200 rounded-lg px-3 py-1 w-48 outline-none focus:border-sky-400" />
                      ) : (
                        <span className="font-mono text-lg font-bold text-sky-600">{coupon.code}</span>
                      )}
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${coupon.active ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-400"}`}>
                        {coupon.active ? "Active" : "Disabled"}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {coupon.type === "percentage" ? `${coupon.value}% off` : `$${(coupon.value / 100).toFixed(2)} off`}
                      </span>
                    </div>

                    {/* Details row */}
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-500">
                      <span>Used: {coupon.usedCount}{coupon.maxUses > 0 ? `/${coupon.maxUses}` : " (unlimited)"}</span>
                      <span>Min order: {coupon.minOrder > 0 ? `$${(coupon.minOrder / 100).toFixed(2)}` : "None"}</span>
                      <span>Expires: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}</span>
                    </div>

                    {/* User restrictions */}
                    {(coupon.allowedEmails || coupon.blockedEmails) && !isEditing && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {coupon.allowedEmails && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                            <UserCheck size={11} /> Allowed: {coupon.allowedEmails.split(",").length} email{coupon.allowedEmails.split(",").length !== 1 ? "s" : ""}
                          </span>
                        )}
                        {coupon.blockedEmails && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600">
                            <Ban size={11} /> Blocked: {coupon.blockedEmails.split(",").length} email{coupon.blockedEmails.split(",").length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Edit fields */}
                    {isEditing && (
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <label className="text-xs text-neutral-500">Type</label>
                          <select value={editData.type ?? coupon.type} onChange={(e) => setEditData(p => ({ ...p, type: e.target.value }))} className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm mt-0.5">
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed ($)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-neutral-500">Value</label>
                          <input type="number" value={editData.value ?? coupon.value} onChange={(e) => setEditData(p => ({ ...p, value: Number(e.target.value) }))} className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm mt-0.5" />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-500">Max Uses (0=unlimited)</label>
                          <input type="number" value={editData.maxUses ?? coupon.maxUses} onChange={(e) => setEditData(p => ({ ...p, maxUses: Number(e.target.value) }))} className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm mt-0.5" />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-500">Min Order (cents)</label>
                          <input type="number" value={editData.minOrder ?? coupon.minOrder} onChange={(e) => setEditData(p => ({ ...p, minOrder: Number(e.target.value) }))} className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm mt-0.5" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs text-neutral-500 flex items-center gap-1"><UserCheck size={11} /> Allowed emails (comma-separated)</label>
                          <input type="text" value={editData.allowedEmails ?? coupon.allowedEmails ?? ""} onChange={(e) => setEditData(p => ({ ...p, allowedEmails: e.target.value }))} placeholder="Leave empty = anyone" className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm mt-0.5" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs text-neutral-500 flex items-center gap-1"><Ban size={11} /> Blocked emails (comma-separated)</label>
                          <input type="text" value={editData.blockedEmails ?? coupon.blockedEmails ?? ""} onChange={(e) => setEditData(p => ({ ...p, blockedEmails: e.target.value }))} placeholder="user@example.com" className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm mt-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isEditing ? (
                      <>
                        <button onClick={() => handleSaveEdit(coupon.id)} disabled={savingId === coupon.id} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-60">
                          {savingId === coupon.id ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                        </button>
                        <button onClick={() => { setEditingId(null); setEditData({}); }} className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-200">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleToggleActive(coupon)} title={coupon.active ? "Disable" : "Enable"} className="transition">
                          {coupon.active ? <ToggleRight size={24} className="text-emerald-500" /> : <ToggleLeft size={24} className="text-neutral-300" />}
                        </button>
                        <button onClick={() => startEditing(coupon)} className="rounded-lg bg-neutral-100 p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 transition">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(coupon.id)} disabled={deletingId === coupon.id} className="rounded-lg bg-neutral-100 p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50">
                          {deletingId === coupon.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
