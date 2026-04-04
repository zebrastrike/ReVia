import { prisma } from "@/lib/prisma";
import { getActiveTier, resolvePriceForVariant } from "@/lib/pricing";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyReVia from "@/components/WhyReVia";
import CategoriesSection from "@/components/CategoriesSection";
import NewsletterBanner from "@/components/NewsletterBanner";
import HomeFAQ from "@/components/HomeFAQ";
import FloatingPaths from "@/components/FloatingPaths";
export const revalidate = 60;

export default async function HomePage() {
  const tier = await getActiveTier();

  const rawFeatured = await prisma.product.findMany({
    where: { featured: true, active: true },
    include: { variants: true, category: true },
    take: 8,
  });

  const featuredProducts = rawFeatured.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({ ...v, price: resolvePriceForVariant(v, tier) })),
  }));

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="relative">
      <FloatingPaths />

      {/* Hero — gradient sky-50 → white */}
      <div className="bg-gradient-to-b from-sky-50 to-white">
        <HeroBanner />
      </div>

      {/* Why ReVia — tinted */}
      <div className="bg-sky-50/70">
        <WhyReVia />
      </div>

      {/* Featured Products — subtle radial glow */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/40 via-white to-sky-50/30" />
        <div className="relative">
          <FeaturedProducts
            products={featuredProducts.map((p) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              image: p.image,
              variants: p.variants.map((v) => ({ id: v.id, label: v.label, price: v.price })),
              category: { name: p.category.name },
            }))}
          />
        </div>
      </div>

      {/* Categories — tinted */}
      <div className="bg-sky-50/70">
        <CategoriesSection
          categories={categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            productCount: c._count.products,
          }))}
        />
      </div>

      {/* FAQ */}
      <HomeFAQ />

      {/* Newsletter */}
      <NewsletterBanner />
    </div>
  );
}
