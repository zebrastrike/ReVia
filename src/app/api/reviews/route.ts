export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/* ------------------------------------------------------------------ */
/*  GET /api/reviews?productId=xxx – get reviews for a product          */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId query param is required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return NextResponse.json({
      reviews,
      averageRating,
      count: reviews.length,
    });
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  POST /api/reviews – create a review                                 */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, rating, title, body: reviewBody } = body as {
      productId: string;
      rating: number;
      title: string;
      body: string;
    };

    if (!productId || !rating || !title || !reviewBody) {
      return NextResponse.json(
        { error: "productId, rating, title, and body are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if user already reviewed this product
    const existing = await prisma.review.findFirst({
      where: { userId: user.id, productId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 }
      );
    }

    // Check if user has ordered this product (for verified purchase badge)
    const hasOrdered = await prisma.order.findFirst({
      where: {
        userId: user.id,
        items: {
          some: {
            productName: {
              not: "",
            },
          },
        },
      },
      include: { items: true },
    });

    // More accurate check: see if any order item matches product name
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { name: true },
    });

    let verified = false;
    if (hasOrdered && product) {
      const userOrders = await prisma.order.findMany({
        where: { userId: user.id },
        include: { items: true },
      });
      verified = userOrders.some((order) =>
        order.items.some((item) => item.productName === product.name)
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId,
        rating,
        title,
        body: reviewBody,
        verified,
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
