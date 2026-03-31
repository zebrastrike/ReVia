"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Pill,
  Flame,
  TrendingUp,
  ShieldPlus,
  Brain,
  Moon,
  Droplets,
  Layers,
  Beaker,
  Package,
  Syringe,
  Shield,
  Sparkles,
  Dna,
  Heart,
  Zap,
  Eye,
  Sun,
  Atom,
  Activity,
  Microscope,
  Baby,
  BedDouble,
  FlaskConical,
} from "lucide-react";
import type { ComponentType } from "react";

const categoryIcons: Record<string, ComponentType<{ className?: string }>> = {
  // Original 10 planned categories
  "oral-capsules-supplements": Pill,
  "metabolic-weight-management": Flame,
  "growth-hormone-performance": TrendingUp,
  "health-recovery-immune": ShieldPlus,
  "cognitive-longevity": Brain,
  "sexual-health-sleep": Moon,
  "topicals-serums": Droplets,
  "stacks-blends-liquids": Layers,
  "water-supplies": Beaker,
  miscellaneous: Package,
  // Granular subcategories
  "anti-inflammatory": Shield,
  "antimicrobial": Syringe,
  "antioxidant": Sparkles,
  "capsules": Pill,
  "copper-peptide": Atom,
  "copper-peptide-cosmetic": Atom,
  "cosmetic": Eye,
  "growth-hormone": TrendingUp,
  "hormone": Dna,
  "immune": ShieldPlus,
  "longevity": Activity,
  "metabolic": Flame,
  "mitochondrial": Zap,
  "neuropeptide": Brain,
  "neuroprotective": Microscope,
  "nootropic": FlaskConical,
  "recovery": Heart,
  "reproductive": Baby,
  "sexual-health": Moon,
  "sleep": BedDouble,
  "stacks": Layers,
  "supplies": Beaker,
  "tanning": Sun,
};

interface CategoryCardProps {
  name: string;
  slug: string;
  productCount: number;
}

export default function CategoryCard({ name, slug, productCount }: CategoryCardProps) {
  const Icon = categoryIcons[slug] ?? Package;
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/shop?category=${slug}`}>
      <motion.div
        className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-sky-200/50 bg-white p-4 cursor-pointer"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{
          y: -4,
          boxShadow: "0 8px 24px rgba(114, 197, 234, 0.15)",
          borderColor: "rgba(114, 197, 234, 0.4)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Accent bar */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 rounded-full bg-sky-400"
          animate={{ width: hovered ? 5 : 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />

        {/* Icon badge */}
        <motion.div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          animate={{
            backgroundColor: hovered ? "rgb(74, 175, 224)" : "rgb(240, 249, 254)",
            borderColor: hovered ? "rgb(74, 175, 224)" : "rgb(190, 229, 249)",
          }}
          style={{ border: "1px solid" }}
          transition={{ duration: 0.2 }}
        >
          <Icon className={`h-5 w-5 transition-colors duration-200 ${hovered ? "text-white" : "text-sky-600"}`} />
        </motion.div>

        {/* Text */}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-stone-800 leading-tight truncate">{name}</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            {productCount} {productCount === 1 ? "product" : "products"}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
