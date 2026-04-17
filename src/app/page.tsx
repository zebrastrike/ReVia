import { prisma } from "@/lib/prisma";
import { getActiveTier, resolvePriceForVariant } from "@/lib/pricing";
import HeroBanner from "@/components/HeroBanner";
import HeroCarousel from "@/components/HeroCarousel";
import FloatingPaths from "@/components/FloatingPaths";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewsletterBanner from "@/components/NewsletterBanner";
import HomeFAQ from "@/components/HomeFAQ";
import TrustTicker from "@/components/TrustTicker";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tier = await getActiveTier();
  const rawFeatured = await prisma.product.findMany({
    where: { featured: true, active: true },
    include: { variants: true, category: true },
    take: 8,
  });
  const featuredProducts = rawFeatured.map((p) => ({
    id: p.id, name: p.name, slug: p.slug, image: p.image,
    variants: p.variants.map((v) => ({
      id: v.id, label: v.label,
      price: resolvePriceForVariant(v, tier),
    })),
    category: { name: p.category.name },
  }));

  return (
    <div className="relative">
      {/* Hero background */}
      <div className="absolute top-4 left-4 right-4 h-[55vh] sm:top-6 sm:left-8 sm:right-8 sm:h-[65vh] lg:left-12 lg:right-12 z-0 overflow-hidden rounded-2xl sm:rounded-3xl">
        <img src="/images/hero-vials.webp" alt="" className="h-full w-full object-cover object-[65%_20%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F0EDE5] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[#F0EDE5]/70 sm:hidden" />
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-[#F0EDE5]/80 from-10% to-transparent to-50%" />
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <FloatingPaths />
      </div>

      <div className="relative z-[2]">
        {/* Hero */}
        <HeroBanner />

        {/* Image links (3 cards) */}
        <HeroCarousel />

        {/* Featured Products Carousel */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/40 via-white to-sky-50/30" />
          <div className="relative">
            <FeaturedProducts products={featuredProducts} />
          </div>
        </div>

        {/* Quality Assurance */}
        <TrustTicker />

        {/* FAQ */}
        <HomeFAQ />

        {/* Newsletter */}
        <NewsletterBanner />
      </div>
    </div>
  );
}
