"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AgeGate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem("revia-age-verified");
    if (!verified) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const confirm = () => {
    localStorage.setItem("revia-age-verified", "true");
    setVisible(false);
    document.body.style.overflow = "";
  };

  const deny = () => {
    window.location.href = "https://www.google.com";
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-stone-800 to-stone-900 px-8 pt-8 pb-6 text-center">
          <Image
            src="/images/logo.png"
            alt="ReVia"
            width={56}
            height={56}
            className="mx-auto mb-3 h-14 w-14"
          />
          <Image
            src="/images/revia-text.png"
            alt="ReVia Research Supply"
            width={120}
            height={36}
            className="mx-auto h-8 w-auto mb-4"
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5">
            <span className="text-xs font-semibold text-sky-400 tracking-wide">RESEARCH USE ONLY</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 text-center">
          <h2 className="text-xl font-bold text-stone-800 mb-2">
            Age Verification Required
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed mb-6">
            You must be <strong className="text-stone-700">21 years of age or older</strong> to access this website.
            All products are intended for qualified researchers and laboratory use only.
          </p>

          <div className="flex gap-3">
            <button
              onClick={confirm}
              className="flex-1 rounded-xl bg-stone-800 py-3 text-sm font-semibold text-white hover:bg-stone-700 transition"
            >
              I am 21 or older
            </button>
            <button
              onClick={deny}
              className="flex-1 rounded-xl border-2 border-stone-200 py-3 text-sm font-medium text-stone-500 hover:bg-stone-50 transition"
            >
              I am under 21
            </button>
          </div>

          <p className="text-[9px] text-stone-400 mt-4 leading-relaxed">
            By entering this site, you confirm that you are at least 21 years of age and agree to our
            Terms of Service and Research Use Only policy. Products are not intended for human or animal consumption.
          </p>
        </div>
      </div>
    </div>
  );
}
