export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/* ------------------------------------------------------------------ */
/*  GET /api/cart – return cart items for the logged-in user            */
/* ------------------------------------------------------------------ */

export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.cartItem.findMany({
      where: { sessionId: user.id },
    });

    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/cart error:", err);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  POST /api/cart – add item to cart                                   */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { variantId, quantity = 1 } = body as {
      variantId: string;
      quantity?: number;
    };

    if (!variantId) {
      return NextResponse.json(
        { error: "variantId is required" },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existing = await prisma.cartItem.findFirst({
      where: { sessionId: user.id, variantId },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
      return NextResponse.json({ item: updated });
    }

    const item = await prisma.cartItem.create({
      data: {
        sessionId: user.id,
        variantId,
        quantity,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("POST /api/cart error:", err);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/cart – clear entire cart                                */
/* ------------------------------------------------------------------ */

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.cartItem.deleteMany({
      where: { sessionId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/cart error:", err);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
