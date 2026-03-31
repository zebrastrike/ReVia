"use client";

import { motion, useReducedMotion } from "framer-motion";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function NewsletterBanner() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-10">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-600" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 text-center sm:text-left"
          >
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Stay in the Loop
            </h2>
            <p className="mt-1 text-sm text-sky-100">
              New compounds, research news, and exclusive offers.
            </p>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full sm:w-auto sm:min-w-[320px]"
          >
            <NewsletterSignup variant="dark" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
