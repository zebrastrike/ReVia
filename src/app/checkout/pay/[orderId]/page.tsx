"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import CryptoPayment from "@/components/CryptoPayment";
import FloatingOrbs from "@/components/FloatingOrbs";

export default function CryptoPaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);

  return (
    <section className="relative mx-auto max-w-xl px-4 py-16">
      <FloatingOrbs />

      <div className="relative z-10">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-sky-500 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="rounded-2xl border border-sky-200/40 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sky-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7931A]/10">
              <ShoppingBag className="h-5 w-5 text-[#F7931A]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900">Bitcoin Payment</h1>
              <p className="text-xs text-stone-500">Powered by Kraken</p>
            </div>
          </div>

          <CryptoPayment orderId={orderId} />
        </div>
      </div>
    </section>
  );
}
