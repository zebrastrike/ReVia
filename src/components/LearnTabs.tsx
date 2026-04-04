"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, Newspaper } from "lucide-react";
import type { ResearchCompound } from "@/data/research-compounds";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  image: string | null;
  publishedAt: string;
  readTime: number;
}

interface LearnTabsProps {
  activeTab: "articles" | "research";
  category?: string;
  posts: BlogPost[];
  blogCategories: string[];
  compounds: ResearchCompound[];
  researchCategories: string[];
}

export default function LearnTabs({
  activeTab,
  category,
  posts,
  blogCategories,
  compounds,
  researchCategories,
}: LearnTabsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Learn
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-500">
          Articles, research summaries, and insights from the ReVia team.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="mt-10 flex items-center justify-center gap-2">
        <Link
          href="/learn?tab=articles"
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "articles"
              ? "bg-sky-400 text-white shadow-sm"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <Newspaper className="h-4 w-4" />
          Articles
        </Link>
        <Link
          href="/learn?tab=research"
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "research"
              ? "bg-sky-400 text-white shadow-sm"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <FlaskConical className="h-4 w-4" />
          Compound Library
        </Link>
      </div>

      {/* Category filters */}
      {activeTab === "articles" && blogCategories.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/learn?tab=articles"
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              !category
                ? "bg-sky-100 text-sky-700 border border-sky-200"
                : "bg-stone-50 text-stone-500 hover:bg-stone-100 border border-stone-200/60"
            }`}
          >
            All
          </Link>
          {blogCategories.map((c) => (
            <Link
              key={c}
              href={`/learn?tab=articles&category=${encodeURIComponent(c)}`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                category === c
                  ? "bg-sky-100 text-sky-700 border border-sky-200"
                  : "bg-stone-50 text-stone-500 hover:bg-stone-100 border border-stone-200/60"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
      )}

      {activeTab === "research" && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/learn?tab=research"
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              !category
                ? "bg-sky-100 text-sky-700 border border-sky-200"
                : "bg-stone-50 text-stone-500 hover:bg-stone-100 border border-stone-200/60"
            }`}
          >
            All
          </Link>
          {researchCategories.map((cat) => (
            <Link
              key={cat}
              href={`/learn?tab=research&category=${encodeURIComponent(cat)}`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                category === cat
                  ? "bg-sky-100 text-sky-700 border border-sky-200"
                  : "bg-stone-50 text-stone-500 hover:bg-stone-100 border border-stone-200/60"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      {/* Content */}
      {activeTab === "articles" ? (
        <>
          {posts.length === 0 ? (
            <p className="mt-16 text-center text-stone-500">
              No articles found{category ? ` in "${category}"` : ""}.
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                >
                  {post.image && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <span className="rounded-full bg-sky-50 px-2.5 py-0.5 font-medium text-sky-600">
                        {post.category}
                      </span>
                      <span>{post.readTime} min read</span>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-neutral-900 line-clamp-2 group-hover:text-sky-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <p className="mt-4 text-xs text-neutral-400">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <p className="mt-4 text-center text-sm text-stone-400">
            Showing {compounds.length} compound{compounds.length !== 1 ? "s" : ""}
            {category ? ` in "${category}"` : ""}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {compounds.map((compound) => (
              <Link
                key={compound.slug}
                href={`/research/${compound.slug}`}
                className="group flex flex-col rounded-2xl border border-sky-200/60 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {!category && (
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600">
                      {compound.category}
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-lg font-semibold text-stone-900 group-hover:text-sky-600 transition-colors">
                  {compound.name}
                </h2>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-500">
                  {compound.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-sky-600">
                  View research summary
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          {/* RUO Disclaimer */}
          <div className="mt-16 rounded-2xl border border-sky-200/40 bg-sky-50/60 p-6 text-center">
            <p className="text-xs leading-relaxed text-stone-400">
              <strong className="text-stone-500">Research Use Only (RUO):</strong>{" "}
              The information presented in this library summarizes published
              scientific research and is provided for educational and informational
              purposes only. It is not intended as medical advice, diagnosis, or
              treatment recommendations. All compounds referenced carry a Research
              Use Only designation and are intended for laboratory research use only.
            </p>
          </div>
        </>
      )}
    </section>
  );
}
