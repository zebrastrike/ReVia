export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/*  GET /api/crypto/payment-status/[id]                                */
/*  Frontend polls this every 5-10s to check payment status            */
/* ------------------------------------------------------------------ */

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cryptoPayment = await prisma.cryptoPayment.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            invoiceNumber: true,
            status: true,
            paymentStatus: true,
          },
        },
      },
    });

    if (!cryptoPayment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Check if expired (and mark it if so)
    if (
      cryptoPayment.status === "pending" &&
      new Date(cryptoPayment.expiresAt) <= new Date()
    ) {
      await prisma.cryptoPayment.update({
        where: { id },
        data: { status: "expired" },
      });

      await prisma.order.update({
        where: { id: cryptoPayment.orderId },
        data: { status: "expired", paymentStatus: "failed" },
      });

      return NextResponse.json({
        payment: {
          id: cryptoPayment.id,
          status: "expired",
          currency: cryptoPayment.currency,
          amountBtc: cryptoPayment.amountCrypto,
          amountUsd: cryptoPayment.amountUsd,
          walletAddress: cryptoPayment.walletAddress,
          expiresAt: cryptoPayment.expiresAt,
          invoiceNumber: cryptoPayment.order.invoiceNumber,
        },
      });
    }

    return NextResponse.json({
      payment: {
        id: cryptoPayment.id,
        status: cryptoPayment.status,
        currency: cryptoPayment.currency,
        amountBtc: cryptoPayment.amountCrypto,
        amountUsd: cryptoPayment.amountUsd,
        exchangeRate: cryptoPayment.exchangeRate,
        walletAddress: cryptoPayment.walletAddress,
        txHash: cryptoPayment.txHash,
        amountReceived: cryptoPayment.amountReceived,
        expiresAt: cryptoPayment.expiresAt,
        confirmedAt: cryptoPayment.confirmedAt,
        invoiceNumber: cryptoPayment.order.invoiceNumber,
        orderStatus: cryptoPayment.order.status,
      },
    });
  } catch (err) {
    console.error("GET /api/crypto/payment-status error:", err);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
