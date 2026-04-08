"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Factory,
  BadgeCheck,
  Award,
  Microscope,
  FileCheck,
  FlaskConical,
  ShieldCheck,
  Atom,
  CircleCheck,
  CircleX,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function WhyReVia() {
  const shouldReduceMotion = useReducedMotion();

  const anim = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.55, delay, ease: "easeOut" as const },
        };

  return (
    <section className="relative py-16 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-6">

        {/* ── Section 1: Hero Statement ── */}
        <div className="text-center mb-20">
          <motion.p {...anim(0)} className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-3">
            The ReVia Difference
          </motion.p>
          <motion.h1 {...anim(0.1)} className="text-3xl font-bold text-stone-800 sm:text-4xl lg:text-5xl leading-tight">
            Not All Peptides Are<br />Created Equal
          </motion.h1>
          <motion.p {...anim(0.2)} className="mt-6 text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
            Most vendors resell unverified powder from overseas factories. We built a fully US-manufactured,
            third-party tested supply chain with pharmaceutical-grade standards on every batch.
          </motion.p>
        </div>

        {/* ── Section 2: Key Differentiators (6 pillars) ── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-24">
          {[
            {
              icon: Factory,
              title: "US Manufactured",
              description: "Processed and tested entirely in the United States. Active ingredients sourced from Germany and Ukraine — never China or India.",
            },
            {
              icon: BadgeCheck,
              title: "cGMP & ISO Certified",
              description: "Our facilities meet both FDA cGMP manufacturing standards and ISO quality system certification — the highest bar in the industry.",
            },
            {
              icon: Microscope,
              title: "FDA-Registered Labs",
              description: "All testing performed in labs registered with the FDA, meeting federal administrative compliance requirements.",
            },
            {
              icon: FileCheck,
              title: "Per-Batch COAs",
              description: "Every batch gets its own Certificate of Analysis from an independent US lab. Never shared, reused, or fabricated.",
            },
            {
              icon: FlaskConical,
              title: ">99% Purity",
              description: "Pharmaceutical grade (USP/NF/BP standard) with less than 0.1% contamination — in line with human-grade standards.",
            },
            {
              icon: Atom,
              title: "LC-MS Post-Reconstitution",
              description: "We test the molecule after reconstitution — exactly as it enters use. No other peptide company does this.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                {...anim(0.1 + i * 0.08)}
                className="group rounded-2xl border border-sky-200/40 bg-white/80 p-6 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-sky-200/20 hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100/80 border border-sky-200/50 mb-4 transition-colors group-hover:bg-sky-500 group-hover:border-sky-500">
                  <Icon className="h-5 w-5 text-sky-600 transition-colors group-hover:text-white" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-semibold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Section 3: Testing Pipeline ── */}
        <motion.div {...anim(0.2)} className="mb-24">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-2">
              Our Testing Process
            </p>
            <h2 className="text-2xl font-bold text-stone-800 sm:text-3xl">
              5-Stage Quality Verification
            </h2>
            <p className="mt-3 text-stone-500 max-w-xl mx-auto">
              Every batch goes through a rigorous multi-stage testing pipeline before it ships.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { step: "01", title: "HPLC Purity", desc: "High-performance liquid chromatography confirms >99% purity" },
              { step: "02", title: "LC-MS Identity", desc: "Mass spectrometry verifies the correct molecular structure" },
              { step: "03", title: "Sterility & Endotoxin", desc: "Screened for microorganisms, mold, and bacterial endotoxins" },
              { step: "04", title: "Heavy Metals", desc: "Tested for lead, arsenic, mercury, and cadmium contamination" },
              { step: "05", title: "COA Issued", desc: "Independent lab issues a batch-specific Certificate of Analysis" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                {...anim(0.3 + i * 0.1)}
                className="relative rounded-2xl border border-sky-200/40 bg-white/80 p-5 text-center"
              >
                <span className="text-3xl font-black text-sky-100">{item.step}</span>
                <h4 className="text-sm font-semibold text-stone-800 mt-2">{item.title}</h4>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">{item.desc}</p>
                {i < 4 && (
                  <ArrowRight className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-300 z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Section 4: ReVia vs Overseas Comparison ── */}
        <motion.div {...anim(0.2)} className="mb-16">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-2">
              The Reality
            </p>
            <h2 className="text-2xl font-bold text-stone-800 sm:text-3xl">
              ReVia vs. Gray Market Vendors
            </h2>
            <p className="mt-3 text-sm text-stone-500 max-w-2xl mx-auto">
              Gray market peptides aren&apos;t cheaper because of lower overhead — they&apos;re cheaper because
              corners are cut at every stage.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-hidden rounded-2xl border border-sky-200/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky-50/80">
                  <th className="text-left px-5 py-4 font-semibold text-stone-600 text-xs uppercase tracking-wider">Standard</th>
                  <th className="text-center px-5 py-4 font-semibold text-sky-700 text-xs uppercase tracking-wider">ReVia</th>
                  <th className="text-center px-5 py-4 font-semibold text-stone-400 text-xs uppercase tracking-wider">Overseas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100/50">
                {[
                  { label: "Manufacturing", us: "cGMP Certified, USA", them: "No cGMP, unregistered" },
                  { label: "Quality System", us: "ISO Certified", them: "No ISO certification" },
                  { label: "Lab Registration", us: "FDA-Registered", them: "Unregistered facilities" },
                  { label: "Purity Level", us: ">99% Pharma Grade", them: "70–85% typical" },
                  { label: "Third-Party COAs", us: "Per-batch, independent", them: "Fake or reused" },
                  { label: "Sterility Testing", us: "Every batch", them: "Rarely tested" },
                  { label: "Heavy Metal Screening", us: "Every batch", them: "Not performed" },
                  { label: "LC-MS Verification", us: "Post-reconstitution", them: "Never performed" },
                ].map((row) => (
                  <tr key={row.label} className="bg-white/60 hover:bg-sky-50/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-stone-700">{row.label}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1.5 text-sky-600 font-medium">
                        <CircleCheck className="h-4 w-4" />
                        {row.us}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1.5 text-stone-400">
                        <CircleX className="h-4 w-4 text-red-300" />
                        {row.them}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-sm text-stone-500 max-w-3xl mx-auto text-center leading-relaxed">
            A product testing at 75% purity doesn&apos;t just deliver less active compound — the remaining 25% is
            unknown. Without independent COAs, there&apos;s no way to know what you&apos;re actually receiving.
          </p>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div {...anim(0.3)} className="text-center">
          <p className="text-lg font-semibold text-stone-700 italic mb-6">
            When purity and safety matter, the supply chain isn&apos;t a detail — it&apos;s the product.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-8 py-4 text-base font-bold text-white transition hover:bg-sky-500"
          >
            Explore the Catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
