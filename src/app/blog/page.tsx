import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Industry news, product updates, and insights from the ReVia team. The ReVia Journal.",
};

function readTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const where: Record<string, unknown> = { published: true };
  if (category) where.category = category;

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });

  const categories = await prisma.blogPost.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          The ReVia Blog
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-500">
          Industry news, product updates, and insights from the ReVia team.
        </p>
      </div>

      {/* Category filters */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/blog"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            !category
              ? "bg-sky-400 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.category}
            href={`/blog?category=${encodeURIComponent(c.category)}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              category === c.category
                ? "bg-sky-400 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {c.category}
          </Link>
        ))}
      </div>

      {/* Post grid */}
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                <span>{readTime(post.content)} min read</span>
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

      {posts.length === 0 && (
        <p className="mt-16 text-center text-neutral-500">
          No posts found in this category.
        </p>
      )}
    </section>
  );
}
