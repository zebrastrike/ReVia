export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getBtcUsdPrice } from "@/lib/kraken";

/* ------------------------------------------------------------------ */
/*  GET /api/crypto/btc-price                                          */
/*  Public endpoint — returns current BTC/USD price from Kraken        */
/* ------------------------------------------------------------------ */

// Cache price for 30 seconds to avoid hammering Kraken
let cachedPrice: { price: number; timestamp: number } | null = null;
const CACHE_TTL = 30_000;

export async function GET() {
  try {
    if (cachedPrice && Date.now() - cachedPrice.timestamp < CACHE_TTL) {
      return NextResponse.json({
        price: cachedPrice.price,
        cached: true,
        timestamp: cachedPrice.timestamp,
      });
    }

    const price = await getBtcUsdPrice();
    cachedPrice = { price, timestamp: Date.now() };

    return NextResponse.json({
      price,
      cached: false,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("GET /api/crypto/btc-price error:", err);

    // Return cached price if available, even if stale
    if (cachedPrice) {
      return NextResponse.json({
        price: cachedPrice.price,
        cached: true,
        stale: true,
        timestamp: cachedPrice.timestamp,
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch BTC price" },
      { status: 502 }
    );
  }
}
