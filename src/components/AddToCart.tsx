"use client";

import { useState } from "react";
import { ShoppingCart, Check, Clock, XCircle } from "lucide-react";
import { useCartStore } from "@/store/cart";

interface AddToCartProps {
  variants: { id: string; label: string; price: number; inStock: boolean; stockStatus?: string }[];
  productName: string;
  productSlug: string;
  productImage?: string | null;
  onVariantChange?: (variantId: string) => void;
}

export default function AddToCart({
  variants,
  productName,
  productSlug,
  productImage,
  onVariantChange,
}: AddToCartProps) {
  const [selectedId, setSelectedId] = useState(
    () => {
      const initial = (variants.find((v) => v.stockStatus !== "out_of_stock") ?? variants[0])?.id ?? "";
      return initial;
    }
  );
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const selected = variants.find((v) => v.id === selectedId);
  const status = selected?.stockStatus ?? (selected?.inStock ? "in_stock" : "out_of_stock");
  const isPreOrder = status === "pre_order";
  const isOutOfStock = status === "out_of_stock";
  const canPurchase = !isOutOfStock;

  const handleAdd = () => {
    if (!selected || !canPurchase) return;
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
            const vStatus = v.stockStatus ?? (v.inStock ? "in_stock" : "out_of_stock");
            const vIsOut = vStatus === "out_of_stock";
            const vIsPreOrder = vStatus === "pre_order";
            return (
              <button
                key={v.id}
                onClick={() => { setSelectedId(v.id); onVariantChange?.(v.id); }}
                disabled={vIsOut}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  vIsOut
                    ? "cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300"
                    : isSelected
                    ? vIsPreOrder
                      ? "border-amber-500 bg-amber-50 text-stone-600"
                      : "border-sky-600 bg-sky-50 text-stone-600"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <span className={`block ${vIsOut ? "line-through" : ""}`}>{v.label}</span>
                <span className="mt-1 block text-xs">
                  {vIsOut ? (
                    <span className="text-red-400">Out of Stock</span>
                  ) : vIsPreOrder ? (
                    <span className="text-amber-600">Pre-Order · ${(v.price / 100).toFixed(2)}</span>
                  ) : (
                    `$${(v.price / 100).toFixed(2)}`
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price display */}
      {selected && !isOutOfStock && (
        <div>
          <p className="text-2xl font-bold text-neutral-900">
            ${(selected.price / 100).toFixed(2)}
          </p>
          {isPreOrder && (
            <div className="flex items-center gap-2 mt-2 text-amber-600">
              <Clock className="h-4 w-4" />
              <p className="text-sm font-medium">
                Pre-Order — Estimated to ship within 5–7 business days
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add to cart / Pre-order / Out of stock button */}
      <button
        onClick={handleAdd}
        disabled={!canPurchase}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition ${
          added
            ? "bg-sky-700 text-white"
            : isOutOfStock
            ? "cursor-not-allowed bg-neutral-200 text-neutral-400"
            : isPreOrder
            ? "bg-amber-500 text-white hover:bg-amber-600"
            : "bg-sky-400 text-white hover:bg-sky-500"
        }`}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Added to Cart
          </>
        ) : isOutOfStock ? (
          <>
            <XCircle className="h-5 w-5" />
            Out of Stock
          </>
        ) : isPreOrder ? (
          <>
            <Clock className="h-5 w-5" />
            Pre-Order Now
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
