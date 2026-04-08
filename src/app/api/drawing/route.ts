export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET — get current user's drawing status for this month
export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentMonth = new Date().toISOString().slice(0, 7);

    // Get user's entries this month
    const entry = await prisma.drawingEntry.findUnique({
      where: { userId_month: { userId: user.id, month: currentMonth } },
    });

    // Get total participants and entries this month
    const allEntries = await prisma.drawingEntry.findMany({
      where: { month: currentMonth },
    });
    const totalParticipants = allEntries.length;
    const totalEntries = allEntries.reduce((sum, e) => sum + e.entries, 0);

    // Check if this month's drawing already happened
    const result = await prisma.drawingResult.findUnique({ where: { month: currentMonth } });
    let userWon = null;
    if (result) {
      const winners = JSON.parse(result.winners) as { userId: string; prize: string; couponCode: string }[];
      const winEntry = winners.find((w) => w.userId === user.id);
      if (winEntry) {
        userWon = { prize: winEntry.prize, couponCode: winEntry.couponCode };
      }
    }

    // Get drawing settings
    const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    const entryAmount = (settings as { drawingEntryAmount?: number })?.drawingEntryAmount ?? 5000;
    const prize1 = (settings as { drawingPrize1?: number })?.drawingPrize1 ?? 10000;
    const prize2 = (settings as { drawingPrize2?: number })?.drawingPrize2 ?? 5000;
    const prize3 = (settings as { drawingPrize3?: number })?.drawingPrize3 ?? 2500;

    // Calculate days until end of month (drawing date)
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysRemaining = Math.max(0, endOfMonth.getDate() - now.getDate());

    return NextResponse.json({
      month: currentMonth,
      userEntries: entry?.entries ?? 0,
      totalParticipants,
      totalEntries,
      daysRemaining,
      drawingCompleted: !!result,
      userWon,
      entryAmount,
      prizes: [prize1, prize2, prize3],
    });
  } catch (err) {
    console.error("GET /api/drawing error:", err);
    return NextResponse.json({ error: "Failed to fetch drawing status" }, { status: 500 });
  }
}
