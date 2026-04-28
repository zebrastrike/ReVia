"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Check, Clock, XCircle, Lock, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/lib/useAuth";

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
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { isLoggedIn, loading: authLoading } = useAuth();

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
      isPreOrder,
    }, qty);
    setAdded(true);
    setQty(1);
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

      {/* Quantity selector */}
      {!isOutOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-neutral-500">Quantity</span>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="px-3 py-2 text-neutral-500 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={99}
              value={qty}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10);
                if (Number.isNaN(n)) { setQty(1); return; }
                setQty(Math.max(1, Math.min(99, n)));
              }}
              className="w-12 bg-transparent text-center text-sm font-semibold text-neutral-800 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Quantity"
            />
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              disabled={qty >= 99}
              className="px-3 py-2 text-neutral-500 hover:text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add to cart / Pre-order / Out of stock / Sign in button */}
      {isOutOfStock ? (
        <button
          disabled
          className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold cursor-not-allowed bg-neutral-200 text-neutral-400"
        >
          <XCircle className="h-5 w-5" />
          Out of Stock
        </button>
      ) : !authLoading && !isLoggedIn ? (
        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold bg-sky-400 text-white hover:bg-sky-500 transition"
        >
          <Lock className="h-5 w-5" />
          Sign In to Purchase
        </Link>
      ) : (
        <button
          onClick={handleAdd}
          disabled={!canPurchase || authLoading}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition ${
            added
              ? "bg-sky-700 text-white"
              : isPreOrder
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-sky-400 text-white hover:bg-sky-500"
          } disabled:opacity-60`}
        >
          {added ? (
            <>
              <Check className="h-5 w-5" />
              Added to Cart
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
      )}
    </div>
  );
}
