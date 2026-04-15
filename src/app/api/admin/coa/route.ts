export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/* ------------------------------------------------------------------ */
/*  POST /api/admin/coa — Upload COA PDF for a product                 */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const productId = formData.get("productId") as string | null;

    if (!file || !productId) {
      return NextResponse.json({ error: "File and productId required" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "png", "jpg", "jpeg"].includes(ext)) {
      return NextResponse.json({ error: "Only PDF, PNG, or JPG files accepted" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Get product slug for filename
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Save file to /public/coa/
    const coaDir = path.join(process.cwd(), "public", "coa");
    await mkdir(coaDir, { recursive: true });

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const filename = `${product.slug}-coa.${fileExt}`;
    const filepath = path.join(coaDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    // Update product with COA URL
    const coaUrl = `/coa/${filename}`;
    await prisma.product.update({
      where: { id: productId },
      data: { coaUrl },
    });

    return NextResponse.json({ success: true, coaUrl });
  } catch (err) {
    console.error("POST /api/admin/coa error:", err);
    return NextResponse.json({ error: "Failed to upload COA" }, { status: 500 });
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/admin/coa — Remove COA from a product                  */
/* ------------------------------------------------------------------ */

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    await prisma.product.update({
      where: { id: productId },
      data: { coaUrl: null },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/coa error:", err);
    return NextResponse.json({ error: "Failed to remove COA" }, { status: 500 });
  }
}
