import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, FlaskConical, ShieldCheck, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getActiveTier, resolvePriceForVariant, getTierSavingsMessage } from "@/lib/pricing";
import AddToCart from "@/components/AddToCart";
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ── Stack metadata ──────────────────────────────────────────────────────────

const STACK_META: Record<
  string,
  {
    gradient: string;
    tagline: string;
    benefitTitle: string;
    benefits: { icon: React.ComponentType<{ size: number; className?: string }>; title: string; body: string }[];
    ingredients: { name: string; dose: string; role: string; slug?: string }[];
  }
> = {
  "revia-lean": {
    gradient: "from-sky-500 to-blue-600",
    tagline: "Dual-action metabolic support in one precision-blended vial",
    benefitTitle: "Why ReVia LEAN?",
    benefits: [
      { icon: Zap, title: "Dual Mechanism", body: "Combines GLP-1/GIP agonism with amylin analogue signaling for complementary metabolic pathways." },
      { icon: FlaskConical, title: "Single Vial Convenience", body: "Pre-blended by Lance's lab — no separate reconstitution or mixing required." },
      { icon: ShieldCheck, title: "Research-Grade Purity", body: "Lyophilized, third-party tested, produced in a certified facility." },
    ],
    ingredients: [
      { name: "Tirzepatide", dose: "10mg", role: "Dual GLP-1/GIP receptor agonist — studied for insulin secretion, appetite regulation, and fat oxidation.", slug: "tirzepatide" },
      { name: "Cagrilintide", dose: "5mg", role: "Long-acting amylin analogue — studied for satiety signaling and complementary metabolic regulation.", slug: "cagrilintide" },
    ],
  },
  "revia-lean-pro-plus": {
    gradient: "from-violet-500 to-purple-600",
    tagline: "Triple-compound advanced weight management and body composition",
    benefitTitle: "Why ReVia LEAN PRO+?",
    benefits: [
      { icon: Zap, title: "Triple Synergy", body: "Adds growth hormone secretagogue signaling to dual GLP-1/amylin action for enhanced body composition research." },
      { icon: FlaskConical, title: "Single Vial Convenience", body: "All three compounds precision-blended — research-ready from day one." },
      { icon: ShieldCheck, title: "Research-Grade Purity", body: "Lyophilized, third-party tested, produced in a certified facility." },
    ],
    ingredients: [
      { name: "Tirzepatide", dose: "10mg", role: "Dual GLP-1/GIP receptor agonist — studied for insulin secretion, appetite regulation, and fat oxidation.", slug: "tirzepatide" },
      { name: "Cagrilintide", dose: "5mg", role: "Long-acting amylin analogue — studied for satiety signaling and complementary metabolic regulation.", slug: "cagrilintide" },
      { name: "Ipamorelin", dose: "10mg", role: "Selective GH secretagogue — studied for pulsatile GH release and body composition support.", slug: "ipamorelin" },
    ],
  },
  "revia-renew": {
    gradient: "from-sky-500 to-blue-600",
    tagline: "Full-spectrum recovery — tissue repair, anti-inflammation, and regeneration",
    benefitTitle: "Why ReVia RENEW?",
    benefits: [
      { icon: Zap, title: "Systemic Recovery", body: "BPC-157 and TB-500 operate through complementary repair mechanisms for localized and systemic healing." },
      { icon: FlaskConical, title: "Regenerative Triad", body: "GHK-Cu adds copper peptide signaling for anti-inflammatory and skin/tissue regeneration support." },
      { icon: ShieldCheck, title: "Research-Grade Purity", body: "Lyophilized, third-party tested, produced in a certified facility." },
    ],
    ingredients: [
      { name: "BPC-157", dose: "10mg", role: "Body protective compound — studied for gut lining repair, tendon healing, and systemic anti-inflammatory effects.", slug: "bpc-157-tb-500" },
      { name: "TB-500", dose: "10mg", role: "Thymosin Beta-4 fragment — studied for systemic tissue repair, angiogenesis, and injury recovery.", slug: "bpc-157-tb-500" },
      { name: "GHK-Cu", dose: "100mg", role: "Copper peptide — studied for anti-inflammatory activity, collagen synthesis, and tissue regeneration.", slug: "ghk-cu" },
    ],
  },
  "revia-sculpt-glow": {
    gradient: "from-rose-500 to-pink-600",
    tagline: "Six-peptide formula — metabolic, recovery, and aesthetics in one vial",
    benefitTitle: "Why ReVia SCULPT & GLOW?",
    benefits: [
      { icon: Zap, title: "Six-Peptide Formula", body: "Covers metabolic support, GH secretagogue, recovery, and skin health signaling in a single research formulation." },
      { icon: FlaskConical, title: "Comprehensive Research Protocol", body: "Designed for studies examining the intersection of body composition, tissue repair, and aesthetic outcomes." },
      { icon: ShieldCheck, title: "Research-Grade Purity", body: "Lyophilized, third-party tested, produced in a certified facility." },
    ],
    ingredients: [
      { name: "Tirzepatide", dose: "10mg", role: "Dual GLP-1/GIP receptor agonist — metabolic and appetite regulation research.", slug: "tirzepatide" },
      { name: "Cagrilintide", dose: "5mg", role: "Amylin analogue — complementary satiety and metabolic signaling.", slug: "cagrilintide" },
      { name: "Ipamorelin", dose: "10mg", role: "Selective GH secretagogue — body composition and GH axis research.", slug: "ipamorelin" },
      { name: "BPC-157", dose: "10mg", role: "Body protective compound — gut and tissue repair, anti-inflammatory.", slug: "bpc-157-tb-500" },
      { name: "TB-500", dose: "10mg", role: "Thymosin Beta-4 fragment — systemic recovery and angiogenesis.", slug: "bpc-157-tb-500" },
      { name: "GHK-Cu", dose: "100mg", role: "Copper peptide — anti-inflammatory, collagen synthesis, skin regeneration.", slug: "ghk-cu" },
    ],
  },
};

// ── Page ────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, include: { variants: true } });
  if (!product) return { title: "Stack Not Found" };
  const meta = STACK_META[slug];
  return {
    title: `${product.name} | ReVia Stacks`,
    description: meta?.tagline ?? product.description ?? `${product.name} — precision peptide stack from ReVia.`,
  };
}

export default async function StackDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: true, category: true },
  });

  if (!product) return notFound();

  // Must be a hero stack
  const tags: string[] = JSON.parse(product.tags || "[]");
  if (!tags.includes("hero-stack")) return notFound();

  const tier = await getActiveTier();
  const meta = STACK_META[slug];

  const variantsWithTierPricing = product.variants.map((v) => ({
    ...v,
    price: resolvePriceForVariant(v, tier),
  }));

  const displayPrice = variantsWithTierPricing[0]?.price ?? 0;
  const savings = product.variants[0] ? getTierSavingsMessage(product.variants[0], tier) : null;

  // Related stacks
  const relatedStacks = await prisma.product.findMany({
    where: {
      active: true,
      tags: { contains: "hero-stack" },
      NOT: { slug },
    },
    include: { variants: true },
    take: 3,
  });

  const gradient = meta?.gradient ?? "from-sky-500 to-blue-600";

  return (
    <div className="min-h-screen">
      {/* ── Breadcrumb ── */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 text-xs text-neutral-400">
          <Link href="/" className="hover:text-neutral-700">Home</Link>
          <ChevronRight size={12} />
          <Link href="/stacks" className="hover:text-neutral-700">Stacks</Link>
          <ChevronRight size={12} />
          <span className="text-neutral-700">{product.name}</span>
        </nav>
      </div>

      {/* ── Hero ── */}
      <div className={`bg-gradient-to-br ${gradient} py-20`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-3">
              ReVia Flagship Stack
            </p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-lg text-white/80">
              {meta?.tagline ?? product.description}
            </p>
            <div className="mt-8 flex items-end gap-4">
              <div>
                <p className="text-3xl font-bold text-white">
                  ${(displayPrice / 100).toFixed(2)}
                </p>
                {savings && (
                  <p className="text-sm font-medium text-white/80 mt-0.5">{savings}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">

        {/* ── What's Inside ── */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">What&apos;s Inside</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(meta?.ingredients ?? []).map((ing) => (
              <div key={ing.name} className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-neutral-900">{ing.name}</h3>
                  <span className="text-xs font-mono font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                    {ing.dose}
                  </span>
                </div>
                <p className="text-sm text-neutral-500">{ing.role}</p>
                {ing.slug && (
                  <Link
                    href={`/shop/${ing.slug}`}
                    className="inline-block text-xs font-medium text-sky-600 hover:text-sky-500 mt-1"
                  >
                    View standalone →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Why This Stack ── */}
        {meta?.benefits && (
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">{meta.benefitTitle}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {meta.benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="flex gap-4">
                    <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 text-sm">{b.title}</h3>
                      <p className="text-sm text-neutral-500 mt-1">{b.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Add to Cart ── */}
        <section className="bg-neutral-50 rounded-3xl p-8">
          <div className="max-w-md">
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Select & Add to Cart</h2>
            <p className="text-sm text-neutral-500 mb-6">
              {variantsWithTierPricing[0]?.label} · SKU: {variantsWithTierPricing[0]?.sku}
            </p>
            {savings && (
              <div className="mb-4 flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-xl px-4 py-2">
                <ShieldCheck size={14} className="text-sky-600 shrink-0" />
                <span className="text-sm font-medium text-stone-600">{savings}</span>
              </div>
            )}
            <AddToCart
              variants={variantsWithTierPricing.map((v) => ({
                id: v.id,
                label: v.label,
                price: v.price,
                inStock: v.inStock,
              }))}
              productName={product.name}
              productSlug={product.slug}
              productImage={product.image}
            />
          </div>
        </section>

        {/* ── Related Stacks ── */}
        {relatedStacks.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">Other Stacks</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {relatedStacks.map((stack) => {
                const rv = stack.variants[0];
                const relatedPrice = rv ? resolvePriceForVariant(rv, tier) : 0;
                const relatedGradient = STACK_META[stack.slug]?.gradient ?? "from-sky-500 to-blue-600";
                return (
                  <Link
                    key={stack.id}
                    href={`/stacks/${stack.slug}`}
                    className="group rounded-2xl overflow-hidden border border-neutral-200 bg-white hover:shadow-md transition-all"
                  >
                    <div className={`h-20 bg-gradient-to-br ${relatedGradient}`} />
                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-900 text-sm">{stack.name}</h3>
                      <p className="text-sm text-neutral-500 mt-0.5">
                        ${(relatedPrice / 100).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── RUO Disclaimer ── */}
        <p className="text-xs text-neutral-400 text-center max-w-2xl mx-auto pb-4">
          For Research Use Only. Not for human consumption. These products are intended solely for
          in vitro research and are not approved for diagnostic or therapeutic use. ReVia makes no
          claims regarding the therapeutic efficacy of any product.
        </p>
      </div>
    </div>
  );
}
