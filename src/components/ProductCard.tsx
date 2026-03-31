"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import WishlistButton from "@/components/WishlistButton";
import { getProductImage } from "@/lib/product-images";

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
  Metabolic: "from-amber-100 to-orange-200",
  "Growth Hormone": "from-blue-100 to-indigo-200",
  Nootropic: "from-violet-100 to-purple-200",
  Longevity: "from-cyan-100 to-blue-200",
  Cosmetic: "from-pink-100 to-rose-200",
  Immune: "from-sky-100 to-blue-200",
  Mitochondrial: "from-sky-100 to-cyan-200",
  Sleep: "from-indigo-100 to-violet-200",
  Stacks: "from-sky-100 to-blue-200",
};

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  const cheapest = product.variants.length
    ? product.variants.reduce((min, v) => (v.price < min.price ? v : min), product.variants[0])
    : null;

  const hasMultiple = product.variants.length > 1;
  const catName = product.category?.name ?? "Peptide";
  const gradient = catColors[catName] ?? "from-sky-100 to-blue-200";
  const image = getProductImage(product.slug, product.image);

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
      image: product.image ?? undefined,
    });
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-sky-200/40 bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-sky-900/5 hover:-translate-y-1 hover:bg-white/80"
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="absolute right-2.5 top-2.5 z-10">
          <WishlistButton productId={product.id} />
        </div>

        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
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
      <div className="flex flex-1 flex-col p-4 pt-3">
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

          {hasMultiple ? (
            <span className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-600 border border-sky-200 transition group-hover:bg-sky-100">
              Options
            </span>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500 active:scale-95"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
