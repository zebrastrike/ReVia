"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  FlaskConical,
  Atom,
  Beaker,
  FileText,
  ChevronRight,
} from "lucide-react";
import type { ResearchCompound } from "@/data/research-compounds";

function Section({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ResearchDetailClient({
  compound,
}: {
  compound: ResearchCompound;
}) {
  const chemProps = compound.chemicalProperties;
  const hasChemProps =
    chemProps &&
    (chemProps.molecularFormula ||
      chemProps.molarMass ||
      chemProps.casNumber ||
      chemProps.pubchemCid ||
      chemProps.type);

  return (
    <div>
      {/* ── Hero header with accent background ── */}
      <div className="bg-gradient-to-b from-sky-100/80 via-sky-50/40 to-transparent pb-12 pt-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Section>
            <Link
              href="/learn?tab=research"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 transition hover:text-sky-500"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Learn
            </Link>
          </Section>

          <Section delay={0.1} className="mt-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="rounded-full bg-sky-500/10 border border-sky-400/30 px-3.5 py-1 text-xs font-semibold text-sky-700 tracking-wide">
                {compound.category}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-stone-300" />
              <span className="rounded-full bg-stone-100 border border-stone-200/60 px-3.5 py-1 text-xs font-medium text-stone-500">
                {compound.type}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              {compound.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-stone-500 max-w-3xl">
              {compound.description}
            </p>
          </Section>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
        {/* ── Mechanism of Action ── */}
        <Section delay={0.15} className="mt-10">
          <div className="rounded-2xl border border-sky-200/50 bg-white/90 shadow-sm overflow-hidden">
            <div className="border-b border-sky-100 bg-sky-50/50 px-6 py-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
                <Atom className="h-4.5 w-4.5 text-sky-600" />
              </div>
              <h2 className="text-lg font-semibold text-stone-800">
                Mechanism of Action
              </h2>
            </div>
            <div className="px-6 py-5">
              <p className="leading-relaxed text-stone-600">
                {compound.mechanism}
              </p>
            </div>
          </div>
        </Section>

        {/* ── Research Applications ── */}
        <Section delay={0.1} className="mt-8">
          <div className="rounded-2xl border border-sky-200/50 bg-white/90 shadow-sm overflow-hidden">
            <div className="border-b border-sky-100 bg-sky-50/50 px-6 py-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
                <FlaskConical className="h-4.5 w-4.5 text-sky-600" />
              </div>
              <h2 className="text-lg font-semibold text-stone-800">
                Research Applications
              </h2>
            </div>
            <div className="px-6 py-5">
              <ul className="space-y-3">
                {compound.researchApplications.map((app, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                    <span className="leading-relaxed text-stone-600">{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* ── Key Published Studies ── */}
        <Section delay={0.1} className="mt-8">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
              <BookOpen className="h-4.5 w-4.5 text-sky-600" />
            </div>
            <h2 className="text-lg font-semibold text-stone-800">
              Key Published Studies
            </h2>
          </div>
          <div className="space-y-4">
            {compound.keyStudies.map((study, i) => (
              <Section key={i} delay={0.05 * i}>
                <div className="rounded-2xl border border-sky-200/50 bg-white/90 shadow-sm p-5 transition-all duration-300 hover:shadow-md hover:border-sky-300/60">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-600">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-relaxed text-stone-700">
                        {study.citation}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-stone-500">
                        <span className="inline-flex items-center gap-1 font-semibold text-sky-600">
                          <FileText className="h-3.5 w-3.5" />
                          Key finding:
                        </span>{" "}
                        {study.finding}
                      </p>
                    </div>
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </Section>

        {/* ── Chemical Properties ── */}
        {hasChemProps && (
          <Section delay={0.1} className="mt-8">
            <div className="rounded-2xl border border-sky-200/50 bg-white/90 shadow-sm overflow-hidden">
              <div className="border-b border-sky-100 bg-sky-50/50 px-6 py-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
                  <Beaker className="h-4.5 w-4.5 text-sky-600" />
                </div>
                <h2 className="text-lg font-semibold text-stone-800">
                  Chemical Properties
                </h2>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-sky-100/80">
                  {chemProps.type && (
                    <tr>
                      <td className="bg-sky-50/30 px-6 py-3.5 font-medium text-stone-600 w-1/3">
                        Type
                      </td>
                      <td className="px-6 py-3.5 text-stone-700 font-mono text-xs">
                        {chemProps.type}
                      </td>
                    </tr>
                  )}
                  {chemProps.molecularFormula && (
                    <tr>
                      <td className="bg-sky-50/30 px-6 py-3.5 font-medium text-stone-600 w-1/3">
                        Molecular Formula
                      </td>
                      <td className="px-6 py-3.5 text-stone-700 font-mono text-xs">
                        {chemProps.molecularFormula}
                      </td>
                    </tr>
                  )}
                  {chemProps.molarMass && (
                    <tr>
                      <td className="bg-sky-50/30 px-6 py-3.5 font-medium text-stone-600 w-1/3">
                        Molar Mass
                      </td>
                      <td className="px-6 py-3.5 text-stone-700 font-mono text-xs">
                        {chemProps.molarMass}
                      </td>
                    </tr>
                  )}
                  {chemProps.casNumber && (
                    <tr>
                      <td className="bg-sky-50/30 px-6 py-3.5 font-medium text-stone-600 w-1/3">
                        CAS Number
                      </td>
                      <td className="px-6 py-3.5 text-stone-700 font-mono text-xs">
                        {chemProps.casNumber}
                      </td>
                    </tr>
                  )}
                  {chemProps.pubchemCid && (
                    <tr>
                      <td className="bg-sky-50/30 px-6 py-3.5 font-medium text-stone-600 w-1/3">
                        PubChem CID
                      </td>
                      <td className="px-6 py-3.5 text-stone-700 font-mono text-xs">
                        {chemProps.pubchemCid}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* ── RUO Disclaimer ── */}
        <Section delay={0.1} className="mt-12">
          <div className="rounded-2xl border border-sky-200/40 bg-sky-50/40 p-6">
            <p className="text-xs leading-relaxed text-stone-400">
              <strong className="text-stone-500">
                Research Use Only (RUO):
              </strong>{" "}
              This page summarizes published scientific research and is provided
              for educational and informational purposes only. It is not intended
              as medical advice, diagnosis, or treatment recommendations. The
              compound described carries a Research Use Only designation and is
              intended for laboratory research use only. It is not intended for
              human or animal consumption, or for use in the diagnosis, treatment,
              cure, or prevention of any disease. Consult qualified professionals
              before making any health-related decisions.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}
