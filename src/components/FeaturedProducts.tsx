"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  variants: { id: string; label: string; price: number; [key: string]: unknown }[];
  category: { name: string };
  [key: string]: unknown;
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);
  const [, setHoverTrigger] = useState(false);
  const initRef = useRef(false);
  const [inView, setInView] = useState(false);
  const speed = 0.5;

  // Triplicate for seamless looping
  const loopProducts = [...products, ...products, ...products];

  // Detect when carousel enters viewport
  useEffect(() => {
    const wrapper = carouselWrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll — runs once, reads hover from ref so no re-init
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || shouldReduceMotion) return;

    if (!initRef.current) {
      const oneSetWidth = el.scrollWidth / 3;
      el.scrollLeft = oneSetWidth;
      initRef.current = true;
    }

    let frame: number;
    const tick = () => {
      if (!hoveringRef.current) {
        el.scrollLeft += speed;
        const oneSetWidth = el.scrollWidth / 3;
        if (el.scrollLeft >= oneSetWidth * 2) {
          el.scrollLeft -= oneSetWidth;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shouldReduceMotion]);

  // Manual wheel scroll (needs non-passive listener)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY + e.deltaX;

      // Wrap around
      const oneSetWidth = el.scrollWidth / 3;
      if (el.scrollLeft >= oneSetWidth * 2) {
        el.scrollLeft -= oneSetWidth;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += oneSetWidth;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section className="relative py-12">
      <div className="flex items-end justify-between mb-8 mx-auto max-w-7xl px-6">
        <div>
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-2"
          >
            Curated Selection
          </motion.p>
          <motion.h2
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold text-stone-800 sm:text-4xl"
          >
            Featured Products
          </motion.h2>
        </div>
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-sky-200/40 bg-white/50 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-white hover:shadow-md hover:text-stone-800"
          >
            View All →
          </Link>
        </motion.div>
      </div>

      {/* Carousel with edge masks */}
      <div
        ref={carouselWrapperRef}
        className="relative mx-auto max-w-[90rem] px-4"
      >
        {/* Curtain overlay — splits from center, opens left and right */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 left-0 w-1/2 z-20 bg-gradient-to-l from-[#F0EDE5] to-[#F0EDE5] transition-transform duration-[2.2s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          style={{ transform: inView ? "translateX(-105%)" : "translateX(0%)" }}
        />
        <div
          className="pointer-events-none absolute top-0 bottom-0 right-0 w-1/2 z-20 bg-gradient-to-r from-[#F0EDE5] to-[#F0EDE5] transition-transform duration-[2.2s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          style={{ transform: inView ? "translateX(105%)" : "translateX(0%)" }}
        />

        {/* Left fade */}
        <div className="pointer-events-none absolute left-4 top-0 bottom-0 z-10 w-20 bg-gradient-to-r from-[#F0EDE5] to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-4 top-0 bottom-0 z-10 w-20 bg-gradient-to-l from-[#F0EDE5] to-transparent" />

        <div
          ref={scrollRef}
          onMouseEnter={() => { hoveringRef.current = true; }}
          onMouseLeave={() => { hoveringRef.current = false; }}
          className="flex gap-5 overflow-x-hidden"
        >
          {loopProducts.map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              className="w-[280px] flex-shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center sm:hidden px-6">
        <Link href="/shop" className="text-sky-600 font-medium text-sm">
          View All Products →
        </Link>
      </div>
    </section>
  );
}
