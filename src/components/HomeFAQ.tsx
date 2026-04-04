"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, HelpCircle } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const faqs = [
  {
    q: "What does Research Use Only (RUO) mean?",
    a: "All products sold by ReVia carry a Research Use Only designation as required by current US regulations. This means they are intended for laboratory and scientific research purposes only — not for human or animal consumption.",
  },
  {
    q: "How do I know your products are legitimate?",
    a: "Every batch is independently tested by a third-party US lab and comes with a Certificate of Analysis (COA). Our facilities are cGMP certified, ISO certified, and FDA-registered. We publish this documentation because transparency builds trust.",
  },
  {
    q: "What purity level are your peptides?",
    a: "All products meet a >99% purity standard (pharmaceutical grade, USP/NF/BP). Each batch is screened for sterility, endotoxins, heavy metals, and synthesis byproducts.",
  },
  {
    q: "How fast do you ship?",
    a: "Orders placed before 2 PM EST on business days ship the same day. We offer Standard (5–7 days), Priority (2–3 days), and Overnight shipping. Temperature-sensitive products ship with insulated packaging and cold packs.",
  },
  {
    q: "Do you ship internationally?",
    a: "At this time, we ship only within the United States, including all 50 states and the District of Columbia. We may expand shipping capabilities in the future.",
  },
  {
    q: "Where are your products manufactured?",
    a: "All products are processed and tested in the United States. Active ingredients are sourced from Germany and Ukraine. Our facilities are cGMP certified, ISO certified, and FDA-registered.",
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-50/50 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-start">
          {/* Left — heading */}
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 mb-3">
                Common Questions
              </p>
              <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl leading-tight">
                Everything You Need to Know
              </h2>
              <p className="mt-4 text-stone-500 leading-relaxed">
                Can&apos;t find what you&apos;re looking for? Our full FAQ page covers
                everything from ordering to compound storage.
              </p>
              <Link
                href="/faq"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500"
              >
                View All FAQ
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right — accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={i}
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: "easeOut" }}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "border-sky-300/70 bg-white shadow-md shadow-sky-200/20"
                      : "border-sky-200/40 bg-white/60 hover:bg-white/80 hover:border-sky-200/60"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center gap-4 px-6 py-5 text-left"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors duration-200 ${
                        isOpen
                          ? "bg-sky-400 text-white"
                          : "bg-sky-100/80 text-sky-500"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-stone-800">
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-colors duration-200 ${
                          isOpen ? "text-sky-500" : "text-stone-300"
                        }`}
                      />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.25,
                          ease: "easeOut",
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pl-[4.5rem]">
                          <p className="text-sm text-stone-500 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
