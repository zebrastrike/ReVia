import { prisma } from "@/lib/prisma";
import { getActiveTier, resolvePriceForVariant } from "@/lib/pricing";
import HeroBanner from "@/components/HeroBanner";
import HeroCarousel from "@/components/HeroCarousel";
import FloatingPaths from "@/components/FloatingPaths";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoriesSection from "@/components/CategoriesSection";
import NewsletterBanner from "@/components/NewsletterBanner";
import HomeFAQ from "@/components/HomeFAQ";
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
      {/* Floating paths - in front of hero bg, behind all content */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <FloatingPaths />
      </div>

      {/* All page content - above the paths */}
      <div className="relative z-[2]">
        {/* Hero + Carousel */}
        <div>
          <HeroBanner />
          <HeroCarousel />
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
    </div>
  );
}
