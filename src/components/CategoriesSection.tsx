"use client";

import { motion, useReducedMotion } from "framer-motion";
import CategoryCard from "@/components/CategoryCard";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export default function CategoriesSection({ categories }: { categories: Category[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-12">
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.p
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-2"
        >
          Browse
        </motion.p>
        <motion.h2
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl font-bold text-stone-800 mb-8 sm:text-4xl"
        >
          Shop by Category
        </motion.h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
            >
              <CategoryCard
                name={cat.name}
                slug={cat.slug}
                productCount={cat.productCount}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
