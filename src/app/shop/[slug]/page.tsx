import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import AddToCart from "@/components/AddToCart";
import WishlistButton from "@/components/WishlistButton";
import ReviewSection from "@/components/ReviewSection";
import JsonLd from "@/components/JsonLd";
import { getProductImage } from "@/lib/product-images";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, variants: true },
  });
  if (!product) return { title: "Product Not Found" };
  const minPrice = Math.min(...product.variants.map((v) => v.price));
  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} - Research-grade peptide from ReVia. Starting at $${(minPrice / 100).toFixed(2)}.`,
    openGraph: {
      title: `${product.name} | ReVia`,
      description: product.description || `Research-grade ${product.name}`,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: true,
      category: true,
    },
  });

  if (!product) return notFound();

  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const maxPrice = Math.max(...product.variants.map((v) => v.price));
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? `${product.name} research peptide from ReVia`,
    brand: { "@type": "Brand", name: "ReVia" },
    category: product.category.name,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: minPrice.toFixed(2),
      highPrice: maxPrice.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      offerCount: product.variants.length,
    },
  };

  /* ── Related products (same category, exclude current) ── */
  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { variants: true, category: true },
    take: 4,
  });

  return (
    <>
    <JsonLd data={productLd} />
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* ── Breadcrumb ── */}
      <nav className="mb-8 flex items-center gap-1 text-sm text-neutral-400">
        <Link href="/" className="transition hover:text-neutral-700">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="transition hover:text-neutral-700">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {product.category && (
          <>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="transition hover:text-neutral-700"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="text-neutral-700">{product.name}</span>
      </nav>

      {/* ── Product layout ── */}
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="absolute right-3 top-3 z-10">
            <WishlistButton productId={product.id} />
          </div>
          {getProductImage(product.slug, product.image) ? (
            <img
              src={getProductImage(product.slug, product.image)!}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center bg-linear-to-br from-sky-50 to-sky-100">
              <span className="text-7xl font-bold text-sky-600/40">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          {product.category && (
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
              {product.category.name}
            </p>
          )}

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {product.name}
          </h1>

          {product.description && (
            <p className="mt-4 text-base leading-relaxed text-neutral-500">
              {product.description}
            </p>
          )}

          {/* Variant selector + Add to Cart (client component) */}
          <div className="mt-8">
            <AddToCart
              variants={product.variants.map((v) => ({
                id: v.id,
                label: v.label,
                price: v.price,
                inStock: v.inStock,
              }))}
              productName={product.name}
              productSlug={product.slug}
              productImage={getProductImage(product.slug, product.image)}
            />
          </div>

          {/* RUO Disclaimer */}
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
            <strong className="font-semibold text-amber-900">
              For Research Use Only.
            </strong>{" "}
            This product is intended solely for laboratory research purposes. It is
            not intended for human or veterinary use, food, cosmetic, household, or
            agricultural applications. By purchasing, you confirm the product will be
            used exclusively for in-vitro research by qualified professionals.
          </div>
        </div>
      </div>

      {/* ── Reviews ── */}
      <ReviewSection productId={product.id} />

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl font-bold text-neutral-900">Related Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </section>
    </>
  );
}
