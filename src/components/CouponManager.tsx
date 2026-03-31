"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, X, ToggleLeft, ToggleRight } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrder: "",
    maxUses: "",
    expiresAt: "",
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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create coupon");
      }

      setCoupons((prev) => [data.coupon, ...prev]);
      setFormData({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiresAt: "" });
      setShowForm(false);
      setMessage({ type: "success", text: "Coupon created!" });
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to create",
      });
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
        setCoupons((prev) =>
          prev.map((c) =>
            c.id === coupon.id ? { ...c, active: !c.active } : c
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle coupon:", err);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });

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
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-sky-500/30 bg-sky-100 text-sky-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Create Button / Form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-sky-500"
        >
          <Plus size={16} />
          New Coupon
        </button>
      ) : (
        <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800">Create Coupon</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-stone-800/30 hover:text-stone-500 transition"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-500">
                  Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, code: e.target.value }))
                  }
                  placeholder="SAVE20"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-500">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, type: e.target.value }))
                  }
                  className={inputClass}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-500">
                  Value {formData.type === "percentage" ? "(%)" : "(cents)"}
                </label>
                <input
                  type="number"
                  required
                  value={formData.value}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, value: e.target.value }))
                  }
                  placeholder={formData.type === "percentage" ? "20" : "500"}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-500">
                  Min Order (cents, 0 = none)
                </label>
                <input
                  type="number"
                  value={formData.minOrder}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, minOrder: e.target.value }))
                  }
                  placeholder="0"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-500">
                  Max Uses (0 = unlimited)
                </label>
                <input
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, maxUses: e.target.value }))
                  }
                  placeholder="0"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-500">
                  Expires At (optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, expiresAt: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-sky-500 disabled:opacity-60"
              >
                {creating && <Loader2 size={14} className="animate-spin" />}
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl overflow-hidden">
        {coupons.length === 0 ? (
          <p className="text-stone-500 text-sm py-12 text-center">
            No coupons yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-stone-500 border-b border-sky-200/40 bg-white/500">
                  <th className="text-left px-6 py-4 font-medium">Code</th>
                  <th className="text-left px-6 py-4 font-medium">Type</th>
                  <th className="text-left px-6 py-4 font-medium">Value</th>
                  <th className="text-left px-6 py-4 font-medium">Min Order</th>
                  <th className="text-left px-6 py-4 font-medium">Uses</th>
                  <th className="text-left px-6 py-4 font-medium">Active</th>
                  <th className="text-left px-6 py-4 font-medium">Expires</th>
                  <th className="text-left px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="border-b border-sky-100/40 hover:bg-white/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sky-400 font-medium">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-800/50 capitalize">
                      {coupon.type}
                    </td>
                    <td className="px-6 py-4 text-stone-800 font-medium">
                      {coupon.type === "percentage"
                        ? `${coupon.value}%`
                        : `$${(coupon.value / 100).toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4 text-stone-800/50">
                      {coupon.minOrder > 0
                        ? `$${(coupon.minOrder / 100).toFixed(2)}`
                        : "None"}
                    </td>
                    <td className="px-6 py-4 text-stone-800/50">
                      {coupon.usedCount}
                      {coupon.maxUses > 0 ? `/${coupon.maxUses}` : "/Unlimited"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className="transition"
                      >
                        {coupon.active ? (
                          <ToggleRight
                            size={22}
                            className="text-sky-400"
                          />
                        ) : (
                          <ToggleLeft size={22} className="text-stone-800/20" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-stone-800/50 text-xs">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        disabled={deletingId === coupon.id}
                        className="text-stone-800/20 transition hover:text-red-400 disabled:opacity-50"
                      >
                        {deletingId === coupon.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
