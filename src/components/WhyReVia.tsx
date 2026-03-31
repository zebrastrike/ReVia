"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FlaskConical, Shield, Truck, Award, Microscope, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: FlaskConical,
    title: "98%+ Purity Guaranteed",
    description: "Every batch is third-party tested with certificates of analysis available for full transparency.",
  },
  {
    icon: Shield,
    title: "Research-Grade Quality",
    description: "Manufactured in certified facilities with rigorous quality control at every stage of production.",
  },
  {
    icon: Truck,
    title: "Same-Day Shipping",
    description: "Orders placed before 2 PM EST ship the same day. Discreet, temperature-controlled packaging.",
  },
  {
    icon: Award,
    title: "85+ Compounds",
    description: "One of the largest research peptide catalogs available — from metabolics to nootropics and beyond.",
  },
  {
    icon: Microscope,
    title: "Built for Researchers",
    description: "Detailed compound profiles, dosing references, and dedicated support from a knowledgeable team.",
  },
  {
    icon: HeartHandshake,
    title: "Trusted by Scientists",
    description: "Serving research institutions, universities, and independent labs across the United States.",
  },
];

export default function WhyReVia() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-12">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-2"
          >
            Why Choose Us
          </motion.p>
          <motion.h2
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl font-bold text-stone-800 sm:text-4xl"
          >
            The ReVia Difference
          </motion.h2>
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 text-stone-500 max-w-2xl mx-auto"
          >
            We hold ourselves to the highest standards so you can focus on what matters — your research.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group relative rounded-2xl border border-sky-200/40 bg-white/80 p-6 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-sky-200/20 hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100/80 border border-sky-200/50 mb-4 transition-colors group-hover:bg-sky-500 group-hover:border-sky-500">
                  <Icon className="h-5 w-5 text-sky-600 transition-colors group-hover:text-white" />
                </div>
                <h3 className="text-base font-semibold text-stone-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
