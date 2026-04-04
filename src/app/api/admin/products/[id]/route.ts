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

    const product = await prisma.product.update({
      where: { id },
      data,
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
