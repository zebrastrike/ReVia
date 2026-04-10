export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRecentDeposits, getDepositStatus } from "@/lib/kraken";
import { sendPaymentConfirmation } from "@/lib/email";

/* ------------------------------------------------------------------ */
/*  POST /api/crypto/check-payments                                    */
/*  Backend polling endpoint — call via cron every 30-60 seconds       */
/*  Checks Kraken for incoming deposits and matches to pending orders  */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    // ── Verify cron secret (prevent public access) ──
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Get all pending crypto payments that haven't expired ──
    const pendingPayments = await prisma.cryptoPayment.findMany({
      where: {
        status: { in: ["pending", "detecting"] },
        expiresAt: { gt: new Date() },
      },
      include: {
        order: {
          include: { items: true },
        },
      },
    });

    if (pendingPayments.length === 0) {
      return NextResponse.json({ matched: 0, message: "No pending payments" });
    }

    // ── Get recent deposits from Kraken ──
    // Look back 2 hours to catch any delayed deposits
    const twoHoursAgo = Math.floor(Date.now() / 1000) - 7200;

    let deposits;
    try {
      deposits = await getRecentDeposits(twoHoursAgo);
    } catch (err) {
      console.error("Failed to fetch deposits from Kraken:", err);

      // Fallback: try deposit status endpoint
      try {
        const statusDeposits = await getDepositStatus("XBT");
        deposits = statusDeposits
          .filter((d) => d.status === "Success" || d.status === "Settled")
          .map((d) => ({
            id: d.refid,
            refid: d.refid,
            amount: parseFloat(d.amount),
            asset: d.asset,
            time: d.time,
            fee: parseFloat(d.fee),
            txHash: d.txid,
          }));
      } catch (fallbackErr) {
        console.error("Fallback deposit status also failed:", fallbackErr);
        return NextResponse.json(
          { error: "Failed to check Kraken deposits" },
          { status: 502 }
        );
      }
    }

    if (!deposits || deposits.length === 0) {
      return NextResponse.json({
        matched: 0,
        pending: pendingPayments.length,
        message: "No new deposits found",
      });
    }

    // ── Match deposits to pending payments ──
    let matched = 0;
    const matchLog: Array<{ invoice: string; amount: number; txHash?: string }> = [];

    for (const payment of pendingPayments) {
      // Find a deposit that matches by amount within tolerance
      const match = deposits.find((deposit) => {
        const diff = Math.abs(deposit.amount - payment.amountCrypto);
        return diff <= payment.tolerance;
      });

      if (match) {
        // ── Update crypto payment ──
        await prisma.cryptoPayment.update({
          where: { id: payment.id },
          data: {
            status: "confirmed",
            txHash: (match as { txHash?: string }).txHash || match.refid,
            amountReceived: match.amount,
            confirmedAt: new Date(),
          },
        });

        // ── Update order status ──
        await prisma.order.update({
          where: { id: payment.orderId },
          data: {
            status: "processing",
            paymentStatus: "confirmed",
          },
        });

        // ── Send payment confirmation email ──
        try {
          const order = payment.order;
          await sendPaymentConfirmation(
            {
              id: order.id,
              invoiceNumber: order.invoiceNumber,
              name: order.name,
              email: order.email,
              address: order.address,
              city: order.city,
              state: order.state,
              zip: order.zip,
              total: order.total,
              status: "processing",
              paymentMethod: order.paymentMethod,
              items: order.items,
              createdAt: new Date(),
            },
            order.email
          );
        } catch (emailErr) {
          console.error("Failed to send payment confirmation:", emailErr);
        }

        matched++;
        matchLog.push({
          invoice: payment.order.invoiceNumber,
          amount: match.amount,
          txHash: (match as { txHash?: string }).txHash || match.refid,
        });

        // Remove matched deposit so it's not double-matched
        const matchIndex = deposits.indexOf(match);
        deposits.splice(matchIndex, 1);
      }
    }

    // ── Check for overpayments / underpayments ──
    for (const payment of pendingPayments) {
      if (payment.status === "confirmed") continue; // already matched above

      const closeMatch = deposits.find((deposit) => {
        const diff = Math.abs(deposit.amount - payment.amountCrypto);
        // Within 5% but outside exact tolerance — flag for review
        return diff > payment.tolerance && diff <= payment.amountCrypto * 0.05;
      });

      if (closeMatch) {
        const isOverpaid = closeMatch.amount > payment.amountCrypto;
        await prisma.cryptoPayment.update({
          where: { id: payment.id },
          data: {
            status: isOverpaid ? "overpaid" : "underpaid",
            amountReceived: closeMatch.amount,
            txHash: (closeMatch as { txHash?: string }).txHash || closeMatch.refid,
          },
        });
      }
    }

    return NextResponse.json({
      matched,
      pending: pendingPayments.length - matched,
      deposits: deposits.length,
      matchLog,
    });
  } catch (err) {
    console.error("POST /api/crypto/check-payments error:", err);
    return NextResponse.json(
      { error: "Payment check failed" },
      { status: 500 }
    );
  }
}
