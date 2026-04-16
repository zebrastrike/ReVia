"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2, Minimize2, FlaskConical, User } from "lucide-react";
import Turnstile from "@/components/Turnstile";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Client-side topic keywords — if message contains NONE of these, deflect without API call
const TOPIC_KEYWORDS = [
  "peptide", "bpc", "tb-500", "tb500", "ghk", "tirz", "sema", "reta", "mots",
  "ipamor", "cjc", "sermor", "tesam", "ghrp", "igf", "foxo", "fox-04", "epitalon",
  "humanin", "nad", "ss-31", "slu", "selank", "semax", "dihexa", "pinealon",
  "cerebrolysin", "kisspeptin", "pt-141", "pt141", "dsip", "melanotan", "oxytocin",
  "thymalin", "thymosin", "kpv", "ll-37", "vip", "ara-290", "follistatin",
  "hexarellin", "aicar", "aod", "adipotide", "mazdutide", "survodutide",
  "cagrilintide", "retatrutide", "tirzepatide", "semaglutide",
  "capsule", "rebalance", "recover", "revive", "glow", "klow", "lean", "renew", "sculpt",
  "stack", "blend", "oral", "liquid", "serum", "snap-8", "privive", "glutathione",
  "l-carnitine", "bac water", "syringe", "supply",
  "order", "ship", "shipping", "price", "cost", "buy", "purchase", "cart", "checkout",
  "pay", "zelle", "wire", "bitcoin", "btc", "crypto", "account", "login", "sign",
  "reward", "drawing", "coupon", "discount", "code",
  "revia", "research", "purity", "coa", "certificate", "cgmp", "lab", "quality",
  "weight", "fat", "metabol", "growth", "hormone", "recovery", "heal", "repair",
  "immune", "neuro", "brain", "cognit", "longev", "anti-aging", "aging",
  "skin", "cosmetic", "tanning", "sleep", "sexual", "reproduct",
  "what do you", "what peptide", "tell me about", "do you carry", "do you have",
  "how do i", "how much", "recommend", "suggest", "compare", "difference",
  "hello", "hi", "hey", "help", "thanks", "thank you",
];

function isOnTopic(message: string): boolean {
  const lower = message.toLowerCase();
  // Short messages (greetings) are always on-topic
  if (lower.length < 20) return true;
  return TOPIC_KEYWORDS.some((kw) => lower.includes(kw));
}

const CLIENT_DEFLECT = "I'm ReVia's peptide research assistant — I can help with product questions, research applications, pricing, or ordering. What research area are you interested in?";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("revia-chat-session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("revia-chat-session", id);
  }
  return id;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const handleTurnstile = useCallback((token: string) => setTurnstileToken(token), []);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && !minimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, minimized]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMessage: Message = { role: "user", content: msg };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");

    // Client-side topic filter — no API call for off-topic
    if (!isOnTopic(msg)) {
      setMessages((prev) => [...prev, { role: "assistant", content: CLIENT_DEFLECT }]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated,
          sessionId: getSessionId(),
          turnstileToken: updated.length <= 1 ? turnstileToken : undefined,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message || data.error || "Sorry, please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, turnstileToken]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickAsk = (q: string) => {
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, { role: "user", content: q }],
        sessionId: getSessionId(),
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message || data.error || "Please try again." },
        ]);
      })
      .catch(() => {
        setMessages((prev) => [...prev, { role: "assistant", content: "Connection error." }]);
      })
      .finally(() => setLoading(false));
  };

  // Not open — show floating bubble
  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setMinimized(false); }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-stone-800 pl-4 pr-5 py-3 text-white shadow-lg shadow-stone-900/20 transition hover:bg-stone-700 hover:shadow-xl active:scale-95 group"
        aria-label="Open chat"
      >
        <FlaskConical className="h-5 w-5 text-sky-400 group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-medium">Ask a Researcher</span>
      </button>
    );
  }

  // Minimized — show small bar
  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-stone-800 px-4 py-2.5 text-white shadow-lg transition hover:bg-stone-700 active:scale-95"
      >
        <MessageCircle className="h-4 w-4 text-sky-400" />
        <span className="text-xs font-medium">Resume Chat</span>
        {messages.length > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold">
            {messages.filter((m) => m.role === "assistant").length}
          </span>
        )}
      </button>
    );
  }

  // Full chat panel
  return (
    <div className="fixed bottom-5 right-5 z-50 flex w-[370px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#FAF9F7] shadow-2xl shadow-stone-900/15">
      {/* Header */}
      <div className="flex items-center justify-between bg-stone-800 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20">
            <FlaskConical className="h-4 w-4 text-sky-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Research Assistant</p>
            <p className="text-[10px] text-stone-400">ReVia Research Supply</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(true)}
            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-700 hover:text-white"
            title="Minimize"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-700 hover:text-white"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: "380px", minHeight: "280px" }}>
        {messages.length === 0 && (
          <div className="text-center py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 border border-sky-200/50 mx-auto mb-3">
              <FlaskConical className="h-6 w-6 text-sky-500" />
            </div>
            <p className="text-sm font-semibold text-stone-700">How can I help with your research?</p>
            <p className="text-xs text-stone-400 mt-1 max-w-[260px] mx-auto leading-relaxed">
              Ask about peptides, mechanisms of action, available products, or how to order.
            </p>
            <div className="mt-4 flex flex-col gap-1.5">
              {[
                "What metabolic research peptides do you carry?",
                "Tell me about BPC-157 research",
                "What recovery peptides are available?",
                "How do I place an order?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => quickAsk(q)}
                  disabled={loading}
                  className="rounded-xl bg-white border border-stone-200/80 px-3 py-2 text-xs text-stone-600 text-left transition hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-800 mt-1">
                <FlaskConical className="h-3 w-3 text-sky-400" />
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-stone-800 text-white rounded-br-sm"
                  : "bg-white border border-stone-200/80 text-stone-700 rounded-bl-sm"
              }`}
            >
              {msg.content.split("\n").map((line, j) => (
                <p key={j} className={j > 0 ? "mt-1.5" : ""}>
                  {line}
                </p>
              ))}
            </div>
            {msg.role === "user" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 mt-1">
                <User className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-800">
              <FlaskConical className="h-3 w-3 text-sky-400" />
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-white border border-stone-200/80 px-4 py-3">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-stone-200/80 bg-white px-3 py-2.5">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about our peptides..."
            disabled={loading}
            className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-sky-400 focus:bg-white disabled:opacity-60"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-800 text-white transition hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <Turnstile onVerify={handleTurnstile} />
        <p className="mt-1.5 text-center text-[8px] text-stone-300 tracking-wide">
          FOR RESEARCH USE ONLY — NOT INTENDED FOR HUMAN CONSUMPTION
        </p>
      </div>
    </div>
  );
}
