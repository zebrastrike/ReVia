import { prisma } from "@/lib/prisma";
import BlogManager from "./BlogManager";
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Blog Management</h1>
          <p className="text-sm text-stone-500 mt-1">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <BlogManager
        initialPosts={posts.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          content: p.content,
          author: p.author,
          category: p.category,
          published: p.published,
          publishedAt: p.publishedAt.toISOString(),
          createdAt: p.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
