"use client";

import Link from "next/link";
import { ShoppingCart, Lock } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/lib/useAuth";
import { getProductImage, getVariantImages } from "@/lib/product-images";

interface Variant {
  id: string;
  label: string;
  price: number;
  [key: string]: unknown;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  category?: { name: string } | null;
  variants: Variant[];
  [key: string]: unknown;
}

const catColors: Record<string, string> = {
  Recovery: "from-sky-100 to-blue-200",
  "Metabolic Research": "from-amber-100 to-orange-200",
  "Performance & GH Research": "from-blue-100 to-indigo-200",
  Nootropic: "from-violet-100 to-purple-200",
  Longevity: "from-cyan-100 to-blue-200",
  Cosmetic: "from-pink-100 to-rose-200",
  "Immune Modulation Research": "from-sky-100 to-blue-200",
  Mitochondrial: "from-sky-100 to-cyan-200",
  "Circadian Research": "from-indigo-100 to-violet-200",
  Stacks: "from-sky-100 to-blue-200",
  "Inflammatory Response Research": "from-orange-100 to-red-200",
  "Endocrine Research": "from-purple-100 to-indigo-200",
  "Specialty Research": "from-rose-100 to-pink-200",
  "Melanogenesis Research": "from-amber-100 to-yellow-200",
  "Neuroprotection Research": "from-teal-100 to-cyan-200",
  "Reproductive Biology Research": "from-pink-100 to-rose-200",
};

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { isLoggedIn } = useAuth();

  const cheapest = product.variants.length
    ? product.variants.reduce((min, v) => (v.price < min.price ? v : min), product.variants[0])
    : null;

  const hasMultiple = product.variants.length > 1;
  const catName = product.category?.name ?? "Peptide";
  const gradient = catColors[catName] ?? "from-sky-100 to-blue-200";
  const image = getProductImage(product.slug, product.image);
  const variantImages = getVariantImages(product.slug, product.variants);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cheapest) return;
    addItem({
      variantId: cheapest.id,
      productName: product.name,
      variantLabel: cheapest.label,
      price: cheapest.price,
      slug: product.slug,
      image: variantImages[cheapest.id] ?? image ?? undefined,
    });
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-sky-300/50 bg-sky-50/80 shadow-md shadow-stone-300/25 transition-all duration-300 hover:shadow-lg hover:shadow-stone-400/20 hover:-translate-y-1 hover:border-sky-300/70"
    >
      {/* Image area */}
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        {image ? (
          <div className="flex h-full w-full items-center justify-center p-6">
            <img
              src={image}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-linear-to-br ${gradient}`}>
            <span className="text-6xl font-black text-sky-400/30 select-none">
              {catName.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Category pill */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-sky-50/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            {catName}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col bg-sky-100/80 p-4 pt-3">
        <h3 className="text-sm font-semibold text-stone-800 leading-snug line-clamp-2 group-hover:text-neutral-700 transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-3">
          {cheapest && (
            <span className="text-base font-bold text-stone-800">
              {hasMultiple && <span className="text-xs font-normal text-stone-500 mr-1">from</span>}
              ${(cheapest.price / 100).toFixed(2)}
            </span>
          )}
          {isLoggedIn ? (
            hasMultiple ? (
              <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-sky-700 border border-sky-300/50 transition group-hover:bg-sky-50">
                Options
              </span>
            ) : (
              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 border border-sky-300/50 transition hover:bg-sky-50 active:scale-95"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add
              </button>
            )
          ) : (
            <Link
              href="/login"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-600 border border-sky-200 transition hover:bg-sky-100"
            >
              <Lock className="h-3 w-3" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </Link>
  );
}
