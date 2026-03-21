import { prisma } from "@/lib/prisma";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import Link from "next/link";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: { variants: true, category: true },
    take: 8,
  });

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <HeroBanner />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Products</h2>
          <Link
            href="/shop"
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: product.image,
                variants: product.variants.map((v) => ({
                  id: v.id,
                  label: v.label,
                  price: v.price,
                })),
                category: { name: product.category.name },
              }}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              productCount={cat._count.products}
            />
          ))}
        </div>
      </section>

      {/* RUO Banner */}
      <section className="bg-emerald-900/20 border-y border-emerald-900/30 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold text-emerald-400 mb-3">
            For Research Use Only
          </h3>
          <p className="text-zinc-400 leading-relaxed">
            All products sold by ReVia are intended for laboratory research use
            only. They are not intended for human or animal consumption, or for
            use in the diagnosis, treatment, cure, or prevention of any disease.
          </p>
        </div>
      </section>
    </>
  );
}
