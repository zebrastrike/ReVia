export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, excerpt, content, author, category } = body;

    const post = await prisma.blogPost.create({
      data: {
        title, slug, excerpt, content,
        author: author || "ReVia Research Team",
        category: category || "Industry News",
        published: true,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({
      ...post,
      publishedAt: post.publishedAt.toISOString(),
      createdAt: post.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("POST /api/admin/blog error:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    const post = await prisma.blogPost.update({ where: { id }, data });

    return NextResponse.json({
      ...post,
      publishedAt: post.publishedAt.toISOString(),
      createdAt: post.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("PATCH /api/admin/blog error:", err);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/blog error:", err);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
