"use client";

import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export default function NewsletterSignup({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isDark = variant === "dark";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={`flex items-center gap-2 ${isDark ? "text-white" : "text-sky-600"}`}>
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Thank you for subscribing!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 z-10 ${isDark ? "text-white/70" : "text-neutral-400"}`} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className={`w-full rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${
              isDark
                ? "border border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-white/40 focus:ring-1 focus:ring-white/20 backdrop-blur-sm"
                : "border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isDark
              ? "bg-white text-sky-600 hover:bg-sky-50"
              : "bg-sky-600 text-white hover:bg-sky-500"
          }`}
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
    </form>
  );
}
