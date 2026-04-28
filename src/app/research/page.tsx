import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import {
  researchCompounds,
  CATEGORIES,
  getCompoundsByCategory,
} from "@/data/research-compounds";

export const metadata: Metadata = {
  title: "Compound Research Library | ReVia",
  description:
    "Explore published research summaries for peptides, small molecules, and amino acid blends. All compounds are sold for research use only (RUO).",
  alternates: { canonical: "https://revialife.com/research" },
};

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { category } = await searchParams;

  const compounds = getCompoundsByCategory(category ?? "");

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* ── Hero ── */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100">
          <FlaskConical className="h-7 w-7 text-sky-400" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Compound Research Library
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-500">
          Published research summaries for peptides, small molecules, and amino
          acid blends. All compounds carry a Research Use Only (RUO) designation
          and are intended for laboratory research purposes.
        </p>
      </div>

      {/* ── Category filter tabs ── */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/research"
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            !category
              ? "bg-sky-400 text-white shadow-sm"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((cat) => {
          const isActive = category === cat;
          return (
            <Link
              key={cat}
              href={`/research?category=${encodeURIComponent(cat)}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-sky-400 text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* ── Count ── */}
      <p className="mt-6 text-center text-sm text-stone-400">
        Showing {compounds.length} compound{compounds.length !== 1 ? "s" : ""}
        {category ? ` in "${category}"` : ""}
      </p>

      {/* ── Compound grid ── */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {compounds.map((compound) => (
          <Link
            key={compound.slug}
            href={`/research/${compound.slug}`}
            className="group flex flex-col rounded-2xl border border-sky-200/60 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md"
          >
            {/* Category pill (only shown when viewing "All") */}
            <div className="flex flex-wrap items-center gap-2">
              {!category && (
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600">
                  {compound.category}
                </span>
              )}
            </div>

            {/* Name */}
            <h2 className="mt-3 text-lg font-semibold text-stone-900 group-hover:text-sky-600 transition-colors">
              {compound.name}
            </h2>

            {/* Description snippet */}
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-500">
              {compound.description}
            </p>

            {/* Arrow link */}
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-sky-600">
              View research summary
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── RUO Disclaimer ── */}
      <div className="mt-16 rounded-2xl border border-sky-200/40 bg-sky-50/60 p-6 text-center">
        <p className="text-xs leading-relaxed text-stone-400">
          <strong className="text-stone-500">Research Use Only (RUO):</strong>{" "}
          The information presented in this library summarizes published
          scientific research and is provided for educational and informational
          purposes only. It is not intended as medical advice, diagnosis, or
          treatment recommendations. All compounds referenced carry a Research
          Use Only designation and are intended for laboratory research use only.
          They are not intended for human or animal consumption. Consult
          qualified professionals before making any health-related decisions.
        </p>
      </div>
    </section>
  );
}
