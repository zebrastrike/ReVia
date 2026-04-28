import type { Metadata } from "next";
import {
  researchCompounds,
  getCompoundBySlug,
} from "@/data/research-compounds";
import ResearchDetailClient from "./ResearchDetailClient";
import { notFound } from "next/navigation";

/* ── Static generation ── */
export function generateStaticParams() {
  return researchCompounds.map((c) => ({ slug: c.slug }));
}

/* ── Dynamic metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const compound = getCompoundBySlug(slug);

  if (!compound) {
    return { title: "Compound Not Found | ReVia" };
  }

  const url = `https://revialife.com/research/${slug}`;
  return {
    title: `${compound.name} Research Summary | ReVia`,
    description: compound.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${compound.name} Research Summary | ReVia`,
      description: compound.description,
      type: "article",
      url,
    },
  };
}

/* ── Page component ── */
export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const compound = getCompoundBySlug(slug);

  if (!compound) {
    notFound();
  }

  return <ResearchDetailClient compound={compound} />;
}
