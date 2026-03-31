import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getActiveTier, resolvePriceForVariant } from "@/lib/pricing";
import ProductCard from "@/components/ProductCard";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop | ReVia",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { category, q, sort } = await searchParams;

  /* ── Fetch categories for sidebar ── */
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const tier = await getActiveTier();

  /* ── Build product query filters ── */
  const where: Record<string, unknown> = { active: true };

  if (category) {
    where.category = { slug: category };
  }

  if (q) {
    where.name = { contains: q };
  }

  /* ── Sort ── */
  let orderBy: Record<string, string> = { name: "asc" };
  if (sort === "price-asc") {
    orderBy = { name: "asc" }; // will sort client-side below
  } else if (sort === "price-desc") {
    orderBy = { name: "asc" };
  } else if (sort === "name") {
    orderBy = { name: "asc" };
  }

  let products = await prisma.product.findMany({
    where,
    include: {
      variants: true,
      category: true,
    },
    orderBy,
  });

  /* Apply tier pricing to variants */
  const productsWithTierPricing = products.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({
      ...v,
      price: resolvePriceForVariant(v, tier),
    })),
  }));

  /* Price-based sorting (needs variant data) */
  let sortedProducts = productsWithTierPricing;
  if (sort === "price-asc") {
    sortedProducts = productsWithTierPricing.sort((a, b) => {
      const aMin = Math.min(...a.variants.map((v) => v.price));
      const bMin = Math.min(...b.variants.map((v) => v.price));
      return aMin - bMin;
    });
  } else if (sort === "price-desc") {
    sortedProducts = productsWithTierPricing.sort((a, b) => {
      const aMin = Math.min(...a.variants.map((v) => v.price));
      const bMin = Math.min(...b.variants.map((v) => v.price));
      return bMin - aMin;
    });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
        Shop All Products
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""}
      </p>

      {/* ── Search + Sort bar ── */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form action="/shop" method="GET" className="flex max-w-md flex-1 gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          {sort && <input type="hidden" name="sort" value={sort} />}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search products..."
              className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
          >
            Search
          </button>
        </form>

        {/* Sort dropdown as links */}
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <span>Sort:</span>
          <div className="flex gap-1">
            {[
              { value: "name", label: "Name" },
              { value: "price-asc", label: "Price: Low-High" },
              { value: "price-desc", label: "Price: High-Low" },
            ].map((s) => {
              const params = new URLSearchParams();
              if (category) params.set("category", category);
              if (q) params.set("q", q);
              params.set("sort", s.value);
              const isActive = sort === s.value || (!sort && s.value === "name");
              return (
                <Link
                  key={s.value}
                  href={`/shop?${params.toString()}`}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-sky-600 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main layout: sidebar + grid ── */}
      <div className="mt-10 flex flex-col gap-10 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-56">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Categories
          </h2>
          <ul className="mt-3 space-y-1">
            <li>
              <Link
                href="/shop"
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  !category
                    ? "bg-sky-50 text-sky-600"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                All
              </Link>
            </li>
            {categories.map((cat) => {
              const isActive = category === cat.slug;
              return (
                <li key={cat.id}>
                  <Link
                    href={`/shop?category=${cat.slug}${q ? `&q=${q}` : ""}${sort ? `&sort=${sort}` : ""}`}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-sky-50 text-sky-600"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Product grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3 items-start">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-20">
            <p className="text-neutral-500">No products found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
