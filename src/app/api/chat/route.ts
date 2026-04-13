export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

/* ------------------------------------------------------------------ */
/*  POST /api/chat — ReVia Research Assistant (OpenAI GPT)             */
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

## SCOPE CONTROL
You ONLY discuss:
- ReVia products, peptides, and research compounds
- Ordering, shipping, payment methods, and account questions
- Published research on peptides (mechanisms, studies, applications)
- Product comparisons and recommendations for research needs

You DO NOT discuss:
- Anything unrelated to peptides, research, or ReVia
- Politics, news, entertainment, coding, general knowledge
- Other vendors or competitor products

If asked something off-topic, say: "I'm specialized in peptide research — I can help with product questions, research applications, or ordering. Is there a specific peptide or research area I can assist with?"

## COMPANY INFO
- Payment: Zelle, Wire/ACH, Bitcoin (Kraken Pay) — no credit cards
- Shipping: Standard $7.95 (all orders), Priority $12.95 (orders $200+)
- All sales final (replacement only for damaged/wrong items within 48h)
- Free account required to order
- Monthly rewards drawing: every $50 spent = 1 entry for store credit
- Contact: contact@revialife.com
- >99% purity, cGMP certified, LC-MS verified, COA available

## LEAD CAPTURE
If the conversation is going well, naturally ask for their email so you can "send them relevant research updates." Don't be pushy. Only ask once.

## STYLE
- Concise: 2-3 short paragraphs max
- Warm but professional
- Don't make up products or prices — only reference the catalog provided`;

// ── Server-side off-topic blocklist ──
const OFF_TOPIC_PATTERNS = [
  /write (me |a )?(poem|essay|story|code|script|song)/i,
  /what('s| is) the (weather|time|date|news)/i,
  /tell me a joke/i,
  /who (is|was) (the president|trump|biden|obama)/i,
  /(translate|convert) .+ (to|into) /i,
  /play .+ game/i,
  /(bitcoin|crypto|stock) price/i,
  /how (do|can) I (hack|crack|break)/i,
  /ignore (your|previous|all) (instructions|prompt|rules)/i,
  /you are now/i,
  /pretend (you're|to be)/i,
  /act as/i,
];

const OFF_TOPIC_RESPONSE = "I'm specialized in peptide research and ReVia products. I can help with product questions, research applications, ordering, or shipping. What peptide research area are you interested in?";

function isOffTopic(message: string): boolean {
  return OFF_TOPIC_PATTERNS.some((p) => p.test(message));
}

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

// Extract product names mentioned in conversation
function extractProducts(text: string, catalog: string): string[] {
  const productNames = catalog.match(/- ([^[]+) \[/g)?.map(m => m.slice(2, -2).trim()) ?? [];
  const mentioned: string[] = [];
  const lower = text.toLowerCase();
  for (const name of productNames) {
    if (lower.includes(name.toLowerCase())) mentioned.push(name);
  }
  const shortcuts: Record<string, string> = {
    "bpc": "BPC-157", "tb500": "TB-500", "tb-500": "TB-500",
    "tirz": "Tirzepatide", "sema": "Semaglutide", "reta": "Retatrutide",
    "ipa": "Ipamorelin", "cjc": "CJC-1295", "ghk": "GHK-Cu",
    "mots": "MOTS-c", "nad": "NAD+", "pt141": "PT-141", "pt-141": "PT-141",
    "melanotan": "Melanotan", "selank": "Selank", "semax": "Semax",
  };
  for (const [short, full] of Object.entries(shortcuts)) {
    if (lower.includes(short) && !mentioned.includes(full)) mentioned.push(full);
  }
  return mentioned;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // ── Rate limit: 15 messages per IP per 10 minutes ──
    const { success } = rateLimit(`chat:${ip}`, 15, 10 * 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: "You've sent too many messages. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const apiKey = process.env.OpenAi_chatbot_Key;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Our research assistant is being set up. Please email contact@revialife.com for help." },
        { status: 503 }
      );
    }

    const { messages, sessionId, turnstileToken } = await request.json() as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      sessionId?: string;
      turnstileToken?: string;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // ── Turnstile verification on first message ──
    if (messages.length <= 1 && turnstileToken) {
      const valid = await verifyTurnstile(turnstileToken);
      if (!valid) {
        return NextResponse.json(
          { error: "Verification failed. Please refresh and try again." },
          { status: 400 }
        );
      }
    }

    const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content ?? "";

    // ── Server-side off-topic check (no API call) ──
    if (isOffTopic(lastUserMessage)) {
      // Still track the lead, just don't call the API
      if (sessionId) {
        try {
          const existing = await prisma.chatLead.findFirst({ where: { sessionId } });
          if (existing) {
            await prisma.chatLead.update({
              where: { id: existing.id },
              data: { messageCount: { increment: 2 } },
            });
          }
        } catch { /* ignore */ }
      }

      return NextResponse.json({ message: OFF_TOPIC_RESPONSE });
    }

    const recentMessages = messages.slice(-12);
    const catalog = await getProductCatalog();

    const client = new OpenAI({ apiKey });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 400,
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT}\n\n## CURRENT PRODUCT CATALOG\n${catalog}` },
        ...recentMessages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const text = response.choices[0]?.message?.content ?? "I'm sorry, I couldn't process that. Please try again.";

    // ── Track lead data ──
    if (sessionId) {
      try {
        const allText = recentMessages.map(m => m.content).join(" ") + " " + text;
        const productsAsked = extractProducts(allText, catalog);
        const emailMatch = allText.match(/[\w.-]+@[\w.-]+\.\w{2,}/);

        const existing = await prisma.chatLead.findFirst({ where: { sessionId } });

        if (existing) {
          const existingProducts: string[] = JSON.parse(existing.productsAsked || "[]");
          const mergedProducts = [...new Set([...existingProducts, ...productsAsked])];

          await prisma.chatLead.update({
            where: { id: existing.id },
            data: {
              productsAsked: JSON.stringify(mergedProducts),
              messageCount: { increment: 2 },
              email: emailMatch ? emailMatch[0] : existing.email,
              messages: JSON.stringify([
                ...JSON.parse(existing.messages || "[]"),
                { role: "user", content: lastUserMessage, ts: Date.now() },
                { role: "assistant", content: text, ts: Date.now() },
              ].slice(-40)),
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
