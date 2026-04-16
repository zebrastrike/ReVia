import { prisma } from "@/lib/prisma";
import { getActiveTier, resolvePriceForVariant } from "@/lib/pricing";
import HeroBanner from "@/components/HeroBanner";
import HeroCarousel from "@/components/HeroCarousel";
import FloatingPaths from "@/components/FloatingPaths";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoriesSection from "@/components/CategoriesSection";
import NewsletterBanner from "@/components/NewsletterBanner";
import HomeFAQ from "@/components/HomeFAQ";
export const dynamic = "force-dynamic";

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

  const allCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Count products per category including tag-based matches
  const allActiveProducts = await prisma.product.findMany({
    where: { active: true },
    select: { categoryId: true, tags: true },
  });

  const catCounts = new Map<string, number>();
  for (const cat of allCategories) {
    catCounts.set(
      cat.id,
      allActiveProducts.filter(
        (p) => p.categoryId === cat.id || (p.tags && p.tags.includes(cat.slug))
      ).length
    );
  }

  // Only show categories with products
  const categories = allCategories.filter((c) => (catCounts.get(c.id) ?? 0) > 0);

  return (
    <div className="relative">
      {/* Hero background image — backmost layer */}
      <div className="absolute top-4 left-4 right-4 h-[55vh] sm:top-6 sm:left-8 sm:right-8 sm:h-[65vh] lg:left-12 lg:right-12 z-0 overflow-hidden rounded-2xl sm:rounded-3xl">
        <img
          src="/images/hero-vials.webp"
          alt=""
          className="h-full w-full object-cover object-[65%_20%]"
        />
        {/* Bottom fade so it blends into the page */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F0EDE5] via-transparent to-transparent" />
        {/* Mobile: strong overlay so text is readable */}
        <div className="absolute inset-0 bg-[#F0EDE5]/70 sm:hidden" />
        {/* Desktop: left fade only */}
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-[#F0EDE5]/80 from-10% to-transparent to-50%" />
      </div>

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
              productCount: catCounts.get(c.id) ?? 0,
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
