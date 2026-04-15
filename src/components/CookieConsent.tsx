"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("revia-cookie-consent");
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("revia-cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("revia-cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white/95 backdrop-blur-xl shadow-xl shadow-stone-900/10 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-stone-800">We use cookies</p>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              We use essential cookies for site functionality and optional cookies to improve your experience.
              See our{" "}
              <Link href="/policies/cookies" className="text-sky-600 hover:underline">
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link href="/policies/privacy" className="text-sky-600 hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={decline}
              className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 transition"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="rounded-xl bg-stone-800 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-700 transition"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
