export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/* ------------------------------------------------------------------ */
/*  GET /api/wishlist – list user's wishlist items                      */
/* ------------------------------------------------------------------ */

export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            variants: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/wishlist error:", err);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  POST /api/wishlist – add item to wishlist                           */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body as { productId: string };

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const entry = await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId,
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (err: unknown) {
    // Handle unique constraint (already in wishlist)
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Product already in wishlist" },
        { status: 409 }
      );
    }
    console.error("POST /api/wishlist error:", err);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/wishlist – remove item from wishlist                     */
/* ------------------------------------------------------------------ */

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body as { productId: string };

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/wishlist error:", err);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
