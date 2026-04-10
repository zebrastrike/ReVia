export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { usdToBtc, getDepositAddress, buildBitcoinUri } from "@/lib/kraken";
import QRCode from "qrcode";

/* ------------------------------------------------------------------ */
/*  POST /api/crypto/create-payment                                    */
/*  Creates a CryptoPayment record for a Bitcoin order                 */
/* ------------------------------------------------------------------ */

const PAYMENT_WINDOW_MINUTES = 30;

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    // ── Check order exists and is a bitcoin order ──
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { cryptoPayment: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.paymentMethod !== "bitcoin") {
      return NextResponse.json(
        { error: "Order is not a Bitcoin payment" },
        { status: 400 }
      );
    }

    // ── If crypto payment already exists and not expired, return it ──
    if (order.cryptoPayment) {
      const cp = order.cryptoPayment;
      if (cp.status === "confirmed") {
        return NextResponse.json({
          payment: {
            id: cp.id,
            status: "confirmed",
            amountBtc: cp.amountCrypto,
            walletAddress: cp.walletAddress,
            txHash: cp.txHash,
            confirmedAt: cp.confirmedAt,
          },
        });
      }

      if (cp.status === "pending" && new Date(cp.expiresAt) > new Date()) {
        // Still valid — generate fresh QR
        const qrDataUrl = await QRCode.toDataURL(cp.paymentUri, {
          width: 300,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
        });

        return NextResponse.json({
          payment: {
            id: cp.id,
            status: cp.status,
            currency: cp.currency,
            amountBtc: cp.amountCrypto,
            amountUsd: cp.amountUsd,
            exchangeRate: cp.exchangeRate,
            walletAddress: cp.walletAddress,
            paymentUri: cp.paymentUri,
            qrCode: qrDataUrl,
            expiresAt: cp.expiresAt,
            invoiceNumber: order.invoiceNumber,
          },
        });
      }

      // Expired — mark it and create a new one
      if (cp.status === "pending" && new Date(cp.expiresAt) <= new Date()) {
        await prisma.cryptoPayment.update({
          where: { id: cp.id },
          data: { status: "expired" },
        });
      }
    }

    // ── Get BTC price and convert ──
    const { amountBtc, exchangeRate } = await usdToBtc(order.total);

    // ── Get deposit address from Kraken ──
    const walletAddress = await getDepositAddress("XBT");

    // ── Build bitcoin: URI ──
    const paymentUri = buildBitcoinUri(
      walletAddress,
      amountBtc,
      "ReVia Research Supply",
      `Invoice ${order.invoiceNumber}`
    );

    // ── Generate QR code ──
    const qrDataUrl = await QRCode.toDataURL(paymentUri, {
      width: 300,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });

    // ── Set expiration ──
    const expiresAt = new Date(
      Date.now() + PAYMENT_WINDOW_MINUTES * 60 * 1000
    );

    // ── Create crypto payment record ──
    const cryptoPayment = await prisma.cryptoPayment.create({
      data: {
        orderId: order.id,
        currency: "BTC",
        amountCrypto: amountBtc,
        amountUsd: order.total,
        exchangeRate,
        walletAddress,
        paymentUri,
        expiresAt,
      },
    });

    return NextResponse.json(
      {
        payment: {
          id: cryptoPayment.id,
          status: cryptoPayment.status,
          currency: cryptoPayment.currency,
          amountBtc: cryptoPayment.amountCrypto,
          amountUsd: cryptoPayment.amountUsd,
          exchangeRate: cryptoPayment.exchangeRate,
          walletAddress: cryptoPayment.walletAddress,
          paymentUri: cryptoPayment.paymentUri,
          qrCode: qrDataUrl,
          expiresAt: cryptoPayment.expiresAt,
          invoiceNumber: order.invoiceNumber,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/crypto/create-payment error:", err);
    return NextResponse.json(
      { error: "Failed to create crypto payment" },
      { status: 500 }
    );
  }
}
