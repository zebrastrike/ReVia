export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

/* ------------------------------------------------------------------ */
/*  POST /api/chat — ReVia Sales Agent powered by Claude               */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `You are ReVia's Research Assistant — a knowledgeable, professional sales agent for ReVia Research Supply (revialife.com), a US-based supplier of research-grade peptides.

## YOUR ROLE
- Help researchers find the right products for their research needs
- Provide information about peptide compounds based on published scientific literature
- Answer questions about ordering, shipping, payment methods, and policies
- Be friendly, professional, and genuinely helpful

## CRITICAL LANGUAGE RULES (LEGAL COMPLIANCE)
ALL products are sold for RESEARCH USE ONLY (RUO). You MUST follow these rules:

✅ ALWAYS USE:
- "studied for", "investigated for", "researched for"
- "associated with", "observed in studies"
- "published literature suggests", "preclinical research indicates"
- "in laboratory settings", "in research models"

❌ NEVER USE:
- "treats", "cures", "heals", "fixes", "helps with"
- "you should take", "dosage", "dose"
- "patients", "treatment", "therapy", "medicine"
- Any language implying human consumption or medical advice
- Never recommend specific protocols for human use

If someone asks about dosing, administration, or human use, respond:
"Our products are sold strictly for laboratory research purposes. I can share what concentrations have been used in published research studies, but I'm unable to provide guidance on human administration. Please consult the published literature and your institutional review protocols."

## COMPANY INFO
- Payment methods: Zelle, Wire/ACH Transfer, Bitcoin (via Kraken)
- No credit card processing currently
- Shipping: Flat rate $25 per order, ships next business day
- All sales are final — no refunds or returns (replacement only for damaged/wrong items within 48 hours)
- Free account required to add items to cart and place orders
- Friends & Family discount available (40% off with code)
- Monthly rewards drawing: every $50 spent = 1 entry
- Based in Fort Myers, Florida
- Contact: contact@revialife.com

## PRODUCT KNOWLEDGE
You have access to the full product catalog provided below. Reference specific products by name when relevant. Always mention variant sizes and approximate pricing when discussing products.

## CONVERSATION STYLE
- Keep responses concise (2-4 short paragraphs max)
- Use a warm, knowledgeable tone — like a helpful research supply specialist
- If you don't know something, say so honestly
- Proactively suggest related products when appropriate
- Always remind users they need to create a free account to order`;

async function getProductCatalog(): Promise<string> {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: {
        variants: { select: { label: true, price: true, stockStatus: true } },
        category: { select: { name: true } },
      },
      orderBy: { name: "asc" },
    });

    return products
      .map((p) => {
        const variants = p.variants
          .map((v) => `${v.label}: $${(v.price / 100).toFixed(2)} (${v.stockStatus === "in_stock" ? "in stock" : v.stockStatus === "pre_order" ? "pre-order" : "out of stock"})`)
          .join(", ");
        return `- ${p.name} [${p.category?.name}]: ${p.description || ""}. Variants: ${variants}`;
      })
      .join("\n");
  } catch {
    return "Product catalog unavailable.";
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 30 messages per IP per 10 minutes
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const { success } = rateLimit(`chat:${ip}`, 30, 10 * 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment." },
        { status: 429 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chat is not configured yet." },
        { status: 503 }
      );
    }

    const { messages } = await request.json() as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Limit conversation history to last 20 messages
    const recentMessages = messages.slice(-20);

    // Get product catalog for context
    const catalog = await getProductCatalog();

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      system: `${SYSTEM_PROMPT}\n\n## CURRENT PRODUCT CATALOG\n${catalog}`,
      messages: recentMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text = response.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("");

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error("POST /api/chat error:", err);
    return NextResponse.json(
      { error: "Chat temporarily unavailable." },
      { status: 500 }
    );
  }
}
