import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import JsonLd from "@/components/JsonLd";
export const revalidate = 60;

function readTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author],
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const related = await prisma.blogPost.findMany({
    where: { category: post.category, published: true, id: { not: post.id } },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "ReVia Research Supply",
      url: "https://revialife.com",
    },
    datePublished: post.publishedAt.toISOString(),
    image: post.image ?? undefined,
  };

  return (
    <>
      <JsonLd data={articleLd} />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-neutral-400">
          <Link href="/" className="hover:text-neutral-700">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/learn" className="hover:text-neutral-700">
            Learn
          </Link>{" "}
          / <span className="text-neutral-700">{post.title}</span>
        </nav>

        {/* Hero image */}
        {post.image && (
          <div className="mb-8 overflow-hidden rounded-2xl">
            <img
              src={post.image}
              alt={post.title}
              className="h-64 w-full object-cover sm:h-80"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600">
            {post.category}
          </span>
          <span>By {post.author}</span>
          <span>·</span>
          <span>
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>·</span>
          <span>{readTime(post.content)} min read</span>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          {post.title}
        </h1>

        {/* Content */}
        <div
          className="prose-revia mt-10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl border-t border-neutral-200 px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900">Related Articles</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/blog/${r.slug}`}
                className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-1"
              >
                <span className="text-xs text-sky-600">{r.category}</span>
                <h3 className="mt-2 font-semibold text-neutral-900 group-hover:text-sky-600 transition-colors line-clamp-2">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-500 line-clamp-2">
                  {r.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Prose styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .prose-revia h2 { font-size: 1.5rem; font-weight: 700; color: #171717; margin-top: 2rem; margin-bottom: 0.75rem; }
        .prose-revia p { color: #525252; line-height: 1.8; margin-bottom: 1.25rem; }
        .prose-revia ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .prose-revia li { color: #525252; line-height: 1.8; margin-bottom: 0.5rem; }
        .prose-revia li strong { color: #171717; }
        .prose-revia blockquote { border-left: 3px solid #059669; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #404040; }
        .prose-revia em { color: #737373; }
        .prose-revia a { color: #059669; text-decoration: underline; }
      `,
        }}
      />
    </>
  );
}
