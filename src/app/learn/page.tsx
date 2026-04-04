import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { researchCompounds, CATEGORIES, getCompoundsByCategory } from "@/data/research-compounds";
import LearnTabs from "@/components/LearnTabs";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Learn | ReVia",
  description:
    "Articles, industry news, and compound research summaries from the ReVia team. Explore published research and stay up to date.",
};

function readTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; category?: string }>;
}) {
  const { tab, category } = await searchParams;
  const activeTab = tab === "research" ? "research" : "articles";

  // Fetch blog posts
  const blogWhere: Record<string, unknown> = { published: true };
  if (activeTab === "articles" && category) blogWhere.category = category;

  const posts = await prisma.blogPost.findMany({
    where: blogWhere,
    orderBy: { publishedAt: "desc" },
  });

  const blogCategories = await prisma.blogPost.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
  });

  // Prepare research compounds
  const compounds = getCompoundsByCategory(activeTab === "research" ? (category ?? "") : "");

  // Serialize for client component
  const serializedPosts = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    category: p.category,
    author: p.author,
    image: p.image,
    publishedAt: p.publishedAt.toISOString(),
    readTime: readTime(p.content),
  }));

  return (
    <LearnTabs
      activeTab={activeTab}
      category={category}
      posts={serializedPosts}
      blogCategories={blogCategories.map((c) => c.category)}
      compounds={compounds}
      researchCategories={[...CATEGORIES]}
    />
  );
}
