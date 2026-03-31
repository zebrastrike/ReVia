import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getActiveTier, resolvePriceForVariant, getTierSavingsMessage } from "@/lib/pricing";
import { ArrowRight } from "lucide-react";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ReVia Stacks | Precision-Blended Peptide Formulas",
  description:
    "ReVia's flagship blended vials — precision-formulated peptide stacks for weight management, recovery, and aesthetics.",
};

const STACK_GRADIENTS: Record<string, string> = {
  "revia-lean": "from-sky-500 to-blue-600",
  "revia-lean-pro-plus": "from-violet-500 to-purple-600",
  "revia-renew": "from-sky-500 to-blue-600",
  "revia-sculpt-glow": "from-rose-500 to-pink-600",
};

const STACK_TAGLINES: Record<string, string> = {
  "revia-lean": "Dual-action metabolic support in one vial",
  "revia-lean-pro-plus": "Triple-compound advanced weight management",
  "revia-renew": "Full-spectrum recovery and regeneration",
  "revia-sculpt-glow": "Six-peptide body composition and aesthetics",
};

export default async function StacksPage() {
  const tier = await getActiveTier();

  const stacks = await prisma.product.findMany({
    where: { active: true, tags: { contains: "hero-stack" } },
    include: { variants: true, category: true },
    orderBy: { name: "asc" },
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-3">
          Flagship Formulas
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          ReVia Stacks
        </h1>
        <p className="mt-4 text-lg text-neutral-500">
          Precision-blended vials combining synergistic peptides. Each stack is formulated for a
          specific research outcome — no mixing, no guesswork.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {stacks.map((stack) => {
          const variant = stack.variants[0];
          if (!variant) return null;
          const displayPrice = resolvePriceForVariant(variant, tier);
          const savings = getTierSavingsMessage(variant, tier);
          const gradient = STACK_GRADIENTS[stack.slug] ?? "from-sky-500 to-blue-600";
          const tagline = STACK_TAGLINES[stack.slug] ?? stack.description ?? "";

          return (
            <Link
              key={stack.id}
              href={`/stacks/${stack.slug}`}
              className="group relative overflow-hidden rounded-3xl bg-white border border-neutral-200 hover:shadow-xl transition-all duration-300"
            >
              {/* Gradient header */}
              <div className={`h-40 bg-gradient-to-br ${gradient} flex items-end p-6`}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                    ReVia Stack
                  </p>
                  <h2 className="text-2xl font-bold text-white mt-1">{stack.name}</h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-neutral-500">{tagline}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">
                      ${(displayPrice / 100).toFixed(2)}
                    </p>
                    {savings && (
                      <p className="text-xs font-medium text-sky-600 mt-0.5">{savings}</p>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-sky-600 group-hover:gap-2 transition-all">
                    View Stack <ArrowRight size={16} />
                  </span>
                </div>

                <div className="text-xs text-neutral-400 border-t border-neutral-100 pt-3">
                  {variant.label} · SKU: {variant.sku}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* RUO disclaimer */}
      <p className="mt-16 text-center text-xs text-neutral-400 max-w-2xl mx-auto">
        For Research Use Only. Not for human consumption. These products are intended solely for
        in vitro research and are not approved for diagnostic or therapeutic use.
      </p>
    </section>
  );
}
