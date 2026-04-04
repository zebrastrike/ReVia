"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Factory,
  BadgeCheck,
  Award,
  Microscope,
  FileCheck,
  Sparkles,
  FlaskConical,
  Syringe,
  ShieldAlert,
  CircleCheck,
  CircleX,
} from "lucide-react";

const qualityStandards = [
  {
    icon: Factory,
    title: "USA Manufactured",
    description:
      "Processed and tested in the US. Active ingredients sourced from Germany and Ukraine.",
  },
  {
    icon: BadgeCheck,
    title: "cGMP Certified",
    description:
      "Current Good Manufacturing Practice — the FDA's mandatory production standard for pharmaceuticals.",
  },
  {
    icon: Award,
    title: "ISO Certified",
    description:
      "Third-party verified quality, safety, and consistency through International Organization for Standardization.",
  },
  {
    icon: Microscope,
    title: "FDA-Registered Labs",
    description:
      "Our labs are registered with the FDA, meeting all administrative compliance requirements.",
  },
  {
    icon: FileCheck,
    title: "Per-Batch COAs",
    description:
      "Certificate of Analysis issued by an independent US lab for every batch — not shared or reused.",
  },
  {
    icon: Sparkles,
    title: ">99% Purity",
    description:
      "Pharmaceutical grade (USP/NF/BP standard). Max contamination <0.1%, in line with human-grade standards.",
  },
  {
    icon: FlaskConical,
    title: "Sterility Tested",
    description:
      "Each batch is verified free of microorganisms, mold, and bacterial contamination.",
  },
  {
    icon: Syringe,
    title: "Endotoxin Tested",
    description:
      "Screened for bacterial endotoxins that can cause systemic inflammation and adverse reactions.",
  },
  {
    icon: ShieldAlert,
    title: "Heavy Metal Screened",
    description:
      "Tested for toxic heavy metals including lead, arsenic, mercury, and cadmium.",
  },
  {
    icon: Microscope,
    title: "LC-MS Verified",
    description:
      "Liquid chromatography–mass spectrometry testing after reconstitution — verifying the molecule exactly as it enters use. No other company does this.",
  },
];

const comparisonRows = [
  { label: "Manufacturing Standard", us: "cGMP Certified", them: "No cGMP compliance" },
  { label: "Quality System", us: "ISO Certified", them: "No ISO certification" },
  { label: "Lab Registration", us: "FDA-Registered Labs", them: "Unregistered facilities" },
  { label: "Purity Level", us: ">99% Pharma Grade", them: "70–85% typical" },
  { label: "Third-Party Testing", us: "Per-batch COAs", them: "Fake or reused COAs" },
  { label: "Sterility Testing", us: "Fully tested", them: "Rarely tested" },
  { label: "Endotoxin Testing", us: "Fully tested", them: "Not performed" },
  { label: "Heavy Metal Screening", us: "Fully tested", them: "Not performed" },
  { label: "LC-MS Post-Reconstitution", us: "Verified after reconstitution", them: "Never performed" },
];

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
    <section className="relative py-12 lg:py-16">
      <div className="relative mx-auto max-w-7xl px-6">
        {/* ── Header ── */}
        <div className="text-center mb-14">
          <motion.p {...anim(0)} className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-2">
            The ReVia Difference
          </motion.p>
          <motion.h2 {...anim(0.1)} className="text-2xl font-bold text-stone-800 sm:text-3xl lg:text-4xl">
            Why Our Products Are Better
          </motion.h2>
          <motion.p {...anim(0.2)} className="mt-4 text-stone-500 max-w-3xl mx-auto leading-relaxed">
            Most peptide vendors resell powder from overseas factories with no quality controls, no independent testing,
            and no accountability. We built something different: a fully US-manufactured, third-party tested,
            cGMP- and ISO-certified supply chain designed to deliver pharmaceutical-grade purity on every single batch.
          </motion.p>
        </div>

        {/* ── Quality Standards Grid ── */}
        <motion.h3
          {...anim(0.25)}
          className="text-lg font-semibold text-stone-800 mb-6 text-center sm:text-left"
        >
          Our Quality Standards
        </motion.h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-12">
          {qualityStandards.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                {...anim(0.3 + i * 0.06)}
                className="group relative rounded-2xl border border-sky-200/40 bg-white/80 p-5 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-sky-200/20 hover:-translate-y-1"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100/80 border border-sky-200/50 mb-3 transition-colors group-hover:bg-sky-500 group-hover:border-sky-500">
                  <Icon className="h-5 w-5 text-sky-600 transition-colors group-hover:text-white" strokeWidth={1.75} />
                </div>
                <h4 className="text-sm font-semibold text-stone-800 mb-1.5">{item.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Comparison: Two cards side by side ── */}
        <motion.div {...anim(0.3)} className="mb-8">
          <h3 className="text-lg font-semibold text-stone-800 mb-2 text-center">
            What&apos;s At Stake With Overseas Products
          </h3>
          <p className="text-sm text-stone-500 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
            Gray market peptides sourced from China and India aren&apos;t cheaper because of lower overhead — they&apos;re
            cheaper because corners are cut at every stage of manufacturing.
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* ReVia Card */}
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.03, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-1 rounded-2xl bg-sky-400/20 blur-md pointer-events-none"
              />
              <div
                className="relative rounded-2xl border-2 border-sky-400/70 bg-gradient-to-br from-sky-50/90 to-white p-6 sm:p-8 shadow-lg shadow-sky-500/15"
              >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500">
                  <CircleCheck className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-sky-700">ReVia Research Supply</h4>
                  <p className="text-xs text-sky-500 font-medium">US-Manufactured &middot; Pharma Grade</p>
                </div>
              </div>
              <ul className="space-y-3.5">
                {comparisonRows.map((row) => (
                  <li key={row.label} className="flex items-start gap-3">
                    <CircleCheck className="h-4.5 w-4.5 shrink-0 text-sky-500 mt-0.5" strokeWidth={2} />
                    <div>
                      <span className="text-sm font-semibold text-stone-800">{row.label}</span>
                      <span className="text-sm text-stone-600"> — {row.us}</span>
                    </div>
                  </li>
                ))}
              </ul>
              </div>
            </div>

            {/* Overseas Card */}
            <motion.div
              {...anim(0.4)}
              className="rounded-2xl border border-stone-300/50 bg-stone-100/60 p-6 sm:p-8 opacity-65"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-700">
                  <CircleX className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-stone-700">Overseas Competitors</h4>
                  <p className="text-xs text-stone-500 font-medium">Gray Market &middot; Unverified</p>
                </div>
              </div>
              <ul className="space-y-3.5">
                {comparisonRows.map((row) => (
                  <li key={row.label} className="flex items-start gap-3">
                    <CircleX className="h-4.5 w-4.5 shrink-0 text-red-400 mt-0.5" strokeWidth={2} />
                    <div>
                      <span className="text-sm font-semibold text-stone-700">{row.label}</span>
                      <span className="text-sm text-stone-500"> — {row.them}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.p {...anim(0.45)} className="mt-8 text-sm text-stone-500 max-w-3xl mx-auto text-center leading-relaxed">
            A product testing at 75% purity doesn&apos;t just deliver less active compound — the remaining 25% is
            unknown. Synthesis byproducts, truncated peptides, and unreacted reagents are common fillers. Without
            independent COAs, you have no way to know what you&apos;re actually receiving.
          </motion.p>
          <motion.p {...anim(0.5)} className="mt-4 text-sm font-medium text-stone-700 text-center italic">
            When purity and safety matter, the supply chain isn&apos;t a detail — it&apos;s the product.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
