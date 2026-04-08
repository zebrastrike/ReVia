export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import crypto from "crypto";
import { sendDrawingWinnerEmail } from "@/lib/email";

// GET — get drawing info for a month
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const month = request.nextUrl.searchParams.get("month") || new Date().toISOString().slice(0, 7);

    // Get all entries for this month
    const entries = await prisma.drawingEntry.findMany({
      where: { month },
      orderBy: { entries: "desc" },
    });

    // Get user info for each entry
    const userIds = entries.map((e) => e.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const enrichedEntries = entries.map((e) => ({
      ...e,
      userName: userMap.get(e.userId)?.name ?? "Unknown",
      userEmail: userMap.get(e.userId)?.email ?? "Unknown",
    }));

    const totalEntries = entries.reduce((sum, e) => sum + e.entries, 0);

    // Check if drawing already happened
    const result = await prisma.drawingResult.findUnique({ where: { month } });

    return NextResponse.json({
      month,
      entries: enrichedEntries,
      totalEntries,
      totalParticipants: entries.length,
      result: result ? { ...result, winners: JSON.parse(result.winners) } : null,
    });
  } catch (err) {
    console.error("GET /api/admin/drawing error:", err);
    return NextResponse.json({ error: "Failed to fetch drawing" }, { status: 500 });
  }
}

// POST — run the monthly drawing
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { month } = await request.json();
    if (!month) {
      return NextResponse.json({ error: "Month is required (e.g. 2026-04)" }, { status: 400 });
    }

    // Check if already drawn
    const existing = await prisma.drawingResult.findUnique({ where: { month } });
    if (existing) {
      return NextResponse.json({ error: "Drawing already completed for this month" }, { status: 400 });
    }

    // Get all entries
    const entries = await prisma.drawingEntry.findMany({ where: { month } });
    if (entries.length === 0) {
      return NextResponse.json({ error: "No entries for this month" }, { status: 400 });
    }

    // Build weighted pool (more entries = more chances)
    const pool: string[] = [];
    for (const entry of entries) {
      for (let i = 0; i < entry.entries; i++) {
        pool.push(entry.userId);
      }
    }

    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Get prize amounts from settings
    const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    const p1 = (settings as { drawingPrize1?: number })?.drawingPrize1 ?? 10000;
    const p2 = (settings as { drawingPrize2?: number })?.drawingPrize2 ?? 5000;
    const p3 = (settings as { drawingPrize3?: number })?.drawingPrize3 ?? 2500;

    // Pick winners (unique users, up to 3)
    const prizes = [
      { place: 1, amount: p1, label: `$${(p1 / 100).toFixed(0)} Store Credit` },
      { place: 2, amount: p2, label: `$${(p2 / 100).toFixed(0)} Store Credit` },
      { place: 3, amount: p3, label: `$${(p3 / 100).toFixed(0)} Store Credit` },
    ];

    const winners: { userId: string; name: string; email: string; prize: string; amount: number; couponCode: string }[] = [];
    const picked = new Set<string>();

    for (const prize of prizes) {
      const winner = pool.find((id) => !picked.has(id));
      if (!winner) break;
      picked.add(winner);

      const winnerUser = await prisma.user.findUnique({
        where: { id: winner },
        select: { name: true, email: true },
      });

      // Create a unique coupon code for the winner
      const couponCode = `WINNER-${month.replace("-", "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

      await prisma.coupon.create({
        data: {
          code: couponCode,
          type: "fixed",
          value: prize.amount,
          minOrder: 0,
          maxUses: 1,
          usedCount: 0,
          active: true,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        },
      });

      winners.push({
        userId: winner,
        name: winnerUser?.name ?? "Unknown",
        email: winnerUser?.email ?? "Unknown",
        prize: prize.label,
        amount: prize.amount,
        couponCode,
      });
    }

    // Send winner emails
    for (const w of winners) {
      try {
        await sendDrawingWinnerEmail(w.name, w.email, w.prize, w.couponCode, month);
      } catch (err) {
        console.error(`Failed to send winner email to ${w.email}:`, err);
      }
    }

    // Save drawing result
    const totalEntries = pool.length;
    const result = await prisma.drawingResult.create({
      data: {
        month,
        winners: JSON.stringify(winners),
        totalEntries,
      },
    });

    return NextResponse.json({
      result: { ...result, winners },
      message: `Drawing complete! ${winners.length} winner(s) selected.`,
    });
  } catch (err) {
    console.error("POST /api/admin/drawing error:", err);
    return NextResponse.json({ error: "Failed to run drawing" }, { status: 500 });
  }
}
