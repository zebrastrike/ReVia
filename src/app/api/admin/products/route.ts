export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import slugify from "slugify";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, categoryId, description, variants, featured, tags } = body as {
      name: string;
      categoryId: string;
      description?: string;
      variants?: { label: string; price: number; sku: string }[];
      featured?: boolean;
      tags?: string[];
    };

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Name and categoryId are required" },
        { status: 400 }
      );
    }

    const slug = slugify(name, { lower: true, strict: true });

    // Check for duplicate slug
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A product with this name already exists" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description ?? null,
        categoryId,
        featured: featured ?? false,
        tags: tags ? JSON.stringify(tags) : "[]",
        variants:
          variants && variants.length > 0
            ? {
                create: variants.map((v) => ({
                  label: v.label,
                  price: v.price,
                  sku: v.sku,
                })),
              }
            : undefined,
      },
      include: { variants: true, category: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/products error:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
