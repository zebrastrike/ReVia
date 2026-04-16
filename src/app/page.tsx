import { cookies } from "next/headers";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
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
  const cookieStore = await cookies();
  const user = await getAuthUser(cookieStore);
  const isLoggedIn = !!user;

  // Always fetch featured products (for mystery carousel)
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
      price: isLoggedIn ? resolvePriceForVariant(v, tier) : 0,
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

        {/* Featured Products Carousel — always visible */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/40 via-white to-sky-50/30" />
          <div className="relative">
            {isLoggedIn ? (
              <FeaturedProducts products={featuredProducts} />
            ) : (
              /* Mystery locked carousel — visible but fogged */
              <div className="py-12">
                <div className="mx-auto max-w-7xl px-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-2">Featured Research Compounds</p>
                  <h2 className="text-3xl font-bold text-stone-800 mb-8 sm:text-4xl">Curated Selection</h2>
                </div>
                <div className="relative overflow-hidden min-h-[320px]">
                  {/* Visible but fogged product cards */}
                  <div className="flex gap-5 px-6 overflow-hidden">
                    {featuredProducts.slice(0, 6).map((p) => (
                      <div key={p.id} className="shrink-0 w-52 sm:w-56 rounded-2xl border border-sky-200/50 bg-sky-50/80 overflow-hidden select-none pointer-events-none">
                        <div className="aspect-square bg-white flex items-center justify-center p-6">
                          {p.image && <img src={p.image} alt="" className="max-h-full max-w-full object-contain opacity-70" />}
                        </div>
                        <div className="p-4 bg-sky-100/80">
                          <div className="h-4 bg-stone-300/30 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-stone-200/40 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Fog overlay with lock */}
                  <div className="absolute inset-0 backdrop-blur-[3px] bg-[#F0EDE5]/40 flex items-center justify-center">
                    <div className="text-center px-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-800/90 mx-auto mb-4 shadow-lg">
                        <svg className="h-7 w-7 text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </div>
                      <p className="text-xl font-bold text-stone-800">Sign in to browse our catalog</p>
                      <p className="text-sm text-stone-500 mt-1.5 mb-5 max-w-md mx-auto">Create a free research account to view our full selection of research-grade compounds</p>
                      <div className="flex items-center justify-center gap-3">
                        <Link href="/login" className="rounded-xl bg-sky-400 px-7 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition shadow-md shadow-sky-400/20">
                          Sign In
                        </Link>
                        <Link href="/register" className="rounded-xl border-2 border-sky-300 px-7 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-50 transition">
                          Create Account
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
