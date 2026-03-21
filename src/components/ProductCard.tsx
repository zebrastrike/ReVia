"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";

interface Variant {
  id: string;
  label: string;
  price: number;
  [key: string]: unknown;
}

interface Product {
  name: string;
  slug: string;
  image?: string | null;
  category?: { name: string } | null;
  variants: Variant[];
  [key: string]: unknown;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  const cheapest = product.variants.length
    ? product.variants.reduce((min, v) => (v.price < min.price ? v : min), product.variants[0])
    : null;

  const hasMultipleVariants = product.variants.length > 1;
  const categoryName = product.category?.name ?? "Peptide";
  const initial = categoryName.charAt(0).toUpperCase();

  const handleAddToCart = (e: React.MouseEvent) => {
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
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] transition-colors hover:border-emerald-500/30"
      >
        {/* Image / Placeholder */}
        <div className="relative aspect-square w-full overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-900/40 to-emerald-700/20">
              <span className="text-5xl font-bold text-emerald-500/60">{initial}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">
            {categoryName}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-gray-100 line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-3 flex items-center justify-between">
            {cheapest && (
              <span className="text-sm font-medium text-gray-300">
                {hasMultipleVariants ? "From " : ""}${cheapest.price.toFixed(2)}
              </span>
            )}

            {hasMultipleVariants ? (
              <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors group-hover:bg-emerald-500/10">
                View Options
              </span>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
