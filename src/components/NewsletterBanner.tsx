"use client";

import { motion, useReducedMotion } from "framer-motion";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function NewsletterBanner() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-4">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-600" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 text-center sm:text-left"
          >
            <h2 className="text-base font-semibold text-white sm:text-lg">
              Stay in the Loop
            </h2>
            <p className="mt-0.5 text-xs text-sky-100">
              New compounds, research news, and exclusive offers.
            </p>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full sm:w-auto sm:min-w-[320px]"
          >
            <NewsletterSignup variant="dark" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
