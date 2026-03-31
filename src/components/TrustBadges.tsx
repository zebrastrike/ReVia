"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FlaskConical, Truck, HeadphonesIcon, Atom } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

const badges = [
  { icon: FlaskConical, label: "Lab-Verified", sub: "98%+ Purity" },
  { icon: Truck, label: "Fast Shipping", sub: "Same-Day Processing" },
  { icon: HeadphonesIcon, label: "Expert Support", sub: "24hr Response" },
  { icon: Atom, label: "85+ Compounds", sub: "Growing Catalog" },
];

function AnimatedBadge({
  icon: Icon,
  label,
  sub,
  index,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  sub: string;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <div className="flex items-center gap-4 px-6 py-6 sm:py-8">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50/80 border border-sky-200/60">
        <Icon className="h-5 w-5 text-sky-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-stone-800">{label}</p>
        <p className="text-xs text-stone-500">{sub}</p>
      </div>
    </div>
  );

  if (shouldReduceMotion) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: "easeOut",
      }}
    >
      {content}
    </motion.div>
  );
}

export default function TrustBadges() {
  return (
    <section className="relative border-y border-sky-200/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
        {badges.map((b, i) => (
          <AnimatedBadge key={b.label} icon={b.icon} label={b.label} sub={b.sub} index={i} />
        ))}
      </div>
    </section>
  );
}
