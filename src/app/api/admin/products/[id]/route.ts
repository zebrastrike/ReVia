export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Handle new variant creation
    if (body.newVariant) {
      const { label, price, sku } = body.newVariant;
      if (!label || !sku) {
        return NextResponse.json({ error: "Variant label and SKU required" }, { status: 400 });
      }
      const variant = await prisma.productVariant.create({
        data: {
          productId: id,
          label,
          price: price || 0,
          retailPrice: price || 0,
          sku,
          inStock: false,
          quantity: 0,
        },
      });
      return NextResponse.json({ variant });
    }

    // Handle variant updates (label, price changes for existing variants)
    if (body.variants && Array.isArray(body.variants)) {
      for (const v of body.variants) {
        if (v.id && !v.id.startsWith("new-")) {
          await prisma.productVariant.update({
            where: { id: v.id },
            data: {
              label: v.label,
              price: v.price,
              retailPrice: v.price,
            },
          });
        }
      }
    }

    const { name, description, featured, active, categoryId, image, coaUrl } = body as {
      name?: string;
      description?: string;
      featured?: boolean;
      active?: boolean;
      categoryId?: string;
      image?: string;
      coaUrl?: string | null;
    };

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (featured !== undefined) data.featured = featured;
    if (active !== undefined) data.active = active;
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (image !== undefined) data.image = image;
    if (coaUrl !== undefined) data.coaUrl = coaUrl;

    if (Object.keys(data).length === 0 && !body.variants) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const product = Object.keys(data).length > 0
      ? await prisma.product.update({
          where: { id },
          data,
          include: { variants: true, category: true },
        })
      : await prisma.product.findUnique({
          where: { id },
          include: { variants: true, category: true },
        });

    return NextResponse.json({ product });
  } catch (err) {
    console.error("PATCH /api/admin/products/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Delete variants first
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    // Delete reviews referencing this product
    await prisma.review.deleteMany({ where: { productId: id } });
    // Then delete the product
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/products/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
