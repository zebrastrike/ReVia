"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, Plus, X, Loader2, Star } from "lucide-react";

interface Variant {
  id: string;
  label: string;
  price: number;
  sku: string;
  inStock: boolean;
  isNew?: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string;
  featured: boolean;
  tags: string;
  variants: Variant[];
  category: Category;
}

export default function ProductEditForm({
  product,
  categories,
}: {
  product: ProductData;
  categories: Category[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [featured, setFeatured] = useState(product.featured);
  const [variants, setVariants] = useState<Variant[]>(
    product.variants.map((v) => ({ ...v, isNew: false }))
  );

  const inputClass =
    "w-full rounded-lg border border-sky-200/40 bg-white/50 px-4 py-2.5 text-sm text-stone-800 placeholder-gray-500 outline-none transition focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30";

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Update product fields
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, categoryId, featured }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update product");
      }

      // Handle new variants - create them via separate API calls
      for (const v of variants) {
        if (v.isNew) {
          const varRes = await fetch(`/api/admin/products/${product.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              newVariant: { label: v.label, price: v.price, sku: v.sku },
            }),
          });
          if (!varRes.ok) {
            console.error("Failed to create variant:", v.label);
          }
        }
      }

      setMessage({ type: "success", text: "Product saved successfully!" });
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete",
      });
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleToggleFeatured = async () => {
    const res = await fetch(`/api/admin/products/${product.id}/featured`, {
      method: "PATCH",
    });
    if (res.ok) {
      setFeatured(!featured);
    }
  };

  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        label: "",
        price: 0,
        sku: "",
        inStock: true,
        isNew: true,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
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

      {/* Product Details */}
      <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-stone-800">Product Details</h2>

        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Product name"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} min-h-[100px] resize-y`}
            placeholder="Product description..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputClass}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleToggleFeatured}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                featured
                  ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-400"
                  : "border-sky-200/40 bg-white/50 text-stone-500 hover:text-stone-800/70"
              }`}
            >
              <Star
                size={16}
                className={featured ? "fill-yellow-400" : ""}
              />
              {featured ? "Featured" : "Not Featured"}
            </button>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white/50 backdrop-blur border border-sky-200/40 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-800">Variants</h2>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1.5 rounded-lg bg-sky-500/20 px-3 py-1.5 text-xs font-medium text-sky-400 transition hover:bg-sky-500/30"
          >
            <Plus size={14} />
            Add Variant
          </button>
        </div>

        {variants.length === 0 ? (
          <p className="text-sm text-stone-500 py-4 text-center">
            No variants. Add one to set pricing.
          </p>
        ) : (
          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="flex items-center gap-3 rounded-xl border border-sky-100/40 bg-white/500 p-3"
              >
                <div className="flex-1 grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-medium text-stone-500 uppercase tracking-wider">
                      Label
                    </label>
                    <input
                      type="text"
                      value={variant.label}
                      onChange={(e) =>
                        updateVariant(index, "label", e.target.value)
                      }
                      className={inputClass}
                      placeholder="e.g. 5mg"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-medium text-stone-500 uppercase tracking-wider">
                      Price (cents)
                    </label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) =>
                        updateVariant(index, "price", Number(e.target.value))
                      }
                      className={inputClass}
                      placeholder="4999"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-medium text-stone-500 uppercase tracking-wider">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) =>
                        updateVariant(index, "sku", e.target.value)
                      }
                      className={inputClass}
                      placeholder="SKU-001"
                      disabled={!variant.isNew}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="mt-4 text-stone-800/20 transition hover:text-red-400"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition ${
            confirmDelete
              ? "bg-red-600 text-stone-800 hover:bg-red-500"
              : "border border-red-500/20 text-red-400 hover:bg-red-500/10"
          }`}
        >
          {deleting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
          {confirmDelete ? "Confirm Delete" : "Delete Product"}
        </button>

        {confirmDelete && (
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="text-sm text-stone-500 hover:text-stone-800/70 transition"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-sky-500 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
}
