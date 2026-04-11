export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

/* ------------------------------------------------------------------ */
/*  POST /api/chat — ReVia Research Assistant (Claude Haiku)           */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `You are ReVia's Research Assistant — a knowledgeable peptide research specialist for ReVia Research Supply (revialife.com).

## IDENTITY
- You work for ReVia, a US-based supplier of research-grade peptides
- You are professional, concise, and genuinely helpful
- You speak like an informed research supply specialist, not a chatbot
- Keep answers to 2-3 short paragraphs maximum. Be direct.

## LEGAL COMPLIANCE (CRITICAL — NEVER VIOLATE)
ALL products are Research Use Only (RUO). Follow these rules strictly:

ALWAYS say: "studied for", "investigated for", "researched for", "observed in preclinical models", "published literature suggests", "in vitro/in vivo studies indicate"

NEVER say: "treats", "cures", "heals", "helps with", "you should take", "dosage", "dose", "patients", "treatment", "therapy", "medicine", "supplement"

If asked about dosing or human use, say exactly:
"Our products are for laboratory research only. I can share what concentrations have been referenced in published studies, but I cannot provide guidance on human administration. Please consult published literature and your institutional protocols."

If asked about anything illegal or clearly non-research, decline politely.

## PRODUCT KNOWLEDGE
When discussing peptides, reference:
- What the compound has been STUDIED FOR in published research
- The mechanism of action (receptor targets, pathways)
- Available sizes and approximate pricing from our catalog
- Related products they might also be interested in

Example good response about BPC-157:
"BPC-157 is a pentadecapeptide that has been extensively studied in preclinical models for its role in tissue repair signaling, particularly involving the nitric oxide and growth factor pathways. Research has investigated its effects on tendon, ligament, and gut mucosal integrity in laboratory settings. We carry it in 5mg ($49.99) and 10mg ($81.99) vials. If you're researching recovery pathways, you might also look at our BPC-157/TB-500 blend."

## COMPANY INFO
- Payment: Zelle, Wire/ACH, Bitcoin (Kraken Pay) — no credit cards
- Shipping: Flat $25/order, ships next business day, discreet packaging
- All sales final (replacement only for damaged/wrong items within 48h)
- Free account required to order
- Monthly rewards drawing: every $50 spent = 1 entry for store credit prizes
- Contact: contact@revialife.com
- Based in Florida, USA
- >99% purity, cGMP certified, LC-MS verified, COA available

## LEAD CAPTURE
If the conversation is going well, naturally ask for their email so you can "send them relevant research updates or let them know when new products arrive." Don't be pushy. Only ask once per conversation.

## WHAT NOT TO DO
- Don't make up product names or prices — only reference what's in the catalog
- Don't claim products are FDA approved
- Don't recommend stacking/combining for specific conditions
- Don't provide medical advice of any kind
- Don't be long-winded — researchers are busy, be concise`;

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
        return `- ${p.name} [${p.category?.name}]: ${p.description || "N/A"}. Variants: ${variants}`;
      })
      .join("\n");
  } catch {
    return "Product catalog temporarily unavailable.";
  }
}

// Extract product names mentioned in a message
function extractProducts(text: string, catalog: string): string[] {
  const productNames = catalog.match(/- ([^[]+) \[/g)?.map(m => m.slice(2, -2).trim()) ?? [];
  const mentioned: string[] = [];
  const lower = text.toLowerCase();
  for (const name of productNames) {
    if (lower.includes(name.toLowerCase())) {
      mentioned.push(name);
    }
  }
  // Also check common shorthand
  const shortcuts: Record<string, string> = {
    "bpc": "BPC-157", "tb500": "TB-500", "tb-500": "TB-500",
    "tirz": "Tirzepatide", "sema": "Semaglutide", "reta": "Retatrutide",
    "ipa": "Ipamorelin", "cjc": "CJC-1295", "ghk": "GHK-Cu",
    "mots": "MOTS-c", "nad": "NAD+", "pt141": "PT-141", "pt-141": "PT-141",
    "melanotan": "Melanotan", "selank": "Selank", "semax": "Semax",
  };
  for (const [short, full] of Object.entries(shortcuts)) {
    if (lower.includes(short) && !mentioned.includes(full)) {
      mentioned.push(full);
    }
  }
  return mentioned;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const { success } = rateLimit(`chat:${ip}`, 30, 10 * 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Our research assistant is being set up. Please check back soon or email contact@revialife.com." },
        { status: 503 }
      );
    }

    const { messages, sessionId } = await request.json() as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      sessionId?: string;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const recentMessages = messages.slice(-16);
    const catalog = await getProductCatalog();

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
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

    // ── Track lead data ──
    if (sessionId) {
      try {
        const lastUserMessage = recentMessages.filter(m => m.role === "user").pop()?.content ?? "";
        const allText = recentMessages.map(m => m.content).join(" ") + " " + text;
        const productsAsked = extractProducts(allText, catalog);

        // Extract email if user shared one
        const emailMatch = allText.match(/[\w.-]+@[\w.-]+\.\w{2,}/);

        const existing = await prisma.chatLead.findFirst({
          where: { sessionId },
        });

        if (existing) {
          const existingProducts: string[] = JSON.parse(existing.productsAsked || "[]");
          const mergedProducts = [...new Set([...existingProducts, ...productsAsked])];

          await prisma.chatLead.update({
            where: { id: existing.id },
            data: {
              productsAsked: JSON.stringify(mergedProducts),
              messageCount: { increment: 2 }, // user + assistant
              email: emailMatch ? emailMatch[0] : existing.email,
              messages: JSON.stringify([
                ...JSON.parse(existing.messages || "[]"),
                { role: "user", content: lastUserMessage, ts: Date.now() },
                { role: "assistant", content: text, ts: Date.now() },
              ].slice(-40)), // keep last 40 messages
            },
          });
        } else {
          await prisma.chatLead.create({
            data: {
              sessionId,
              ip,
              productsAsked: JSON.stringify(productsAsked),
              messageCount: 2,
              email: emailMatch ? emailMatch[0] : null,
              messages: JSON.stringify([
                { role: "user", content: lastUserMessage, ts: Date.now() },
                { role: "assistant", content: text, ts: Date.now() },
              ]),
            },
          });
        }
      } catch (leadErr) {
        console.error("Failed to track chat lead:", leadErr);
      }
    }

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error("POST /api/chat error:", err);
    return NextResponse.json(
      { error: "I'm having a moment. Please try again or email us at contact@revialife.com." },
      { status: 500 }
    );
  }
}
