"use client";

import { useState } from "react";
import { FileCheck } from "lucide-react";
import AddToCart from "@/components/AddToCart";

interface Variant {
  id: string;
  label: string;
  price: number;
  inStock: boolean;
  stockStatus?: string;
}

interface ProductDetailViewProps {
  productName: string;
  productSlug: string;
  productDescription?: string | null;
  categoryName?: string;
  defaultImage: string | null;
  variantImages: Record<string, string>;
  variants: Variant[];
  coaUrl?: string | null;
}

export default function ProductDetailView({
  productName,
  productSlug,
  productDescription,
  categoryName,
  defaultImage,
  variantImages,
  variants,
  coaUrl,
}: ProductDetailViewProps) {
  const initialVariant = (variants.find((v) => v.stockStatus !== "out_of_stock") ?? variants[0])?.id ?? "";
  const [selectedVariantId, setSelectedVariantId] = useState(initialVariant);

  const currentImage = variantImages[selectedVariantId] ?? defaultImage;

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {currentImage ? (
          <img
            key={currentImage}
            src={currentImage}
            alt={productName}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fall back to default image if variant image doesn't exist
              if (defaultImage && e.currentTarget.src !== defaultImage) {
                e.currentTarget.src = defaultImage;
              }
            }}
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center bg-linear-to-br from-sky-50 to-sky-100">
            <span className="text-7xl font-bold text-sky-600/40">
              {productName.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col justify-center">
        {categoryName && (
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
            {categoryName}
          </p>
        )}

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          {productName}
        </h1>

        {productDescription && (
          <p className="mt-4 text-base leading-relaxed text-neutral-500">
            {productDescription}
          </p>
        )}

        {/* Variant selector + Add to Cart */}
        <div className="mt-8">
          <AddToCart
            variants={variants}
            productName={productName}
            productSlug={productSlug}
            productImage={currentImage}
            onVariantChange={setSelectedVariantId}
          />
        </div>

        {/* COA Link */}
        {coaUrl && (
          <a
            href={coaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-2 rounded-xl border border-sky-200/60 bg-sky-50/80 px-4 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100 hover:border-sky-300/60"
          >
            <FileCheck className="h-4.5 w-4.5 shrink-0" />
            View Certificate of Analysis (COA)
            <span className="ml-auto text-xs text-sky-500">Independent Lab Verified</span>
          </a>
        )}

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs leading-relaxed text-stone-500">
          These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare professional before use.
        </div>
      </div>
    </div>
  );
}
