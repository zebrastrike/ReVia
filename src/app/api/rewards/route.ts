export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET — get current user's reward info
export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { rewardPoints: true, lifetimeSpent: true, referralCode: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const storeCredit = Math.floor(dbUser.rewardPoints / 100) * 500; // in cents: 100 pts = $5

    // Determine tier
    const spent = dbUser.lifetimeSpent;
    let tier = "Member";
    let discount = 0;
    if (spent >= 100000) { tier = "Platinum"; discount = 15; }
    else if (spent >= 50000) { tier = "Gold"; discount = 10; }
    else if (spent >= 25000) { tier = "Silver"; discount = 5; }

    return NextResponse.json({
      rewardPoints: dbUser.rewardPoints,
      lifetimeSpent: dbUser.lifetimeSpent,
      storeCredit,
      tier,
      tierDiscount: discount,
      referralCode: dbUser.referralCode,
    });
  } catch (err) {
    console.error("GET /api/rewards error:", err);
    return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 });
  }
}

// POST — redeem points for store credit at checkout
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pointsToRedeem } = await request.json();

    if (!pointsToRedeem || pointsToRedeem < 100) {
      return NextResponse.json({ error: "Minimum 100 points to redeem" }, { status: 400 });
    }

    // Round down to nearest 100
    const redeemable = Math.floor(pointsToRedeem / 100) * 100;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { rewardPoints: true },
    });

    if (!dbUser || dbUser.rewardPoints < redeemable) {
      return NextResponse.json({ error: "Not enough points" }, { status: 400 });
    }

    const creditCents = (redeemable / 100) * 500; // 100 pts = $5 = 500 cents

    // Deduct points
    await prisma.user.update({
      where: { id: user.id },
      data: { rewardPoints: { decrement: redeemable } },
    });

    return NextResponse.json({
      redeemed: redeemable,
      creditCents,
      remainingPoints: dbUser.rewardPoints - redeemable,
    });
  } catch (err) {
    console.error("POST /api/rewards error:", err);
    return NextResponse.json({ error: "Failed to redeem points" }, { status: 500 });
  }
}
