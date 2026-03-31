"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";

interface AddToCartProps {
  variants: { id: string; label: string; price: number; inStock: boolean }[];
  productName: string;
  productSlug: string;
  productImage?: string | null;
}

export default function AddToCart({
  variants,
  productName,
  productSlug,
  productImage,
}: AddToCartProps) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const selected = variants.find((v) => v.id === selectedId);

  const handleAdd = () => {
    if (!selected || !selected.inStock) return;
    addItem({
      variantId: selected.id,
      productName,
      variantLabel: selected.label,
      price: selected.price,
      slug: productSlug,
      image: productImage ?? undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Variant selector */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-neutral-500">Select Variant</h3>
        <div className="flex flex-wrap gap-3">
          {variants.map((v) => {
            const isSelected = v.id === selectedId;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                disabled={!v.inStock}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  isSelected
                    ? "border-sky-600 bg-sky-50 text-stone-600"
                    : v.inStock
                    ? "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                    : "cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300 line-through"
                }`}
              >
                <span className="block">{v.label}</span>
                <span className="mt-1 block text-xs">
                  {v.inStock ? `$${(v.price / 100).toFixed(2)}` : "Out of stock"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price display */}
      {selected && (
        <p className="text-2xl font-bold text-neutral-900">
          ${(selected.price / 100).toFixed(2)}
        </p>
      )}

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        disabled={!selected?.inStock}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition ${
          added
            ? "bg-sky-700 text-white"
            : selected?.inStock
            ? "bg-sky-600 text-white hover:bg-sky-500"
            : "cursor-not-allowed bg-neutral-200 text-neutral-400"
        }`}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
