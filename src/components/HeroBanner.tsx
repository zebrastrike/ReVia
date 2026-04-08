"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FlaskConical, Truck, Package, MapPin, ArrowRight, Atom } from "lucide-react";

function CompoundCounter({ delay }: { delay: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const target = 85;
    const totalDuration = 1800;
    let startTime: number;

    function tick(now: number) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      // Cubic easing — starts slow, accelerates exponentially
      const progress = Math.min((elapsed / totalDuration) ** 3, 1);
      setCount(Math.round(progress * target));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(tick);
  }, [started]);

  return <>{count === 85 ? "85+" : count}</>;
}

export default function HeroBanner() {
  return (
    <section className="relative min-h-[40vh] sm:min-h-[60vh] flex items-center">
      {/* Background hero image */}
      <div className="absolute inset-x-4 inset-y-0 z-0 overflow-hidden rounded-2xl sm:inset-x-8 sm:rounded-3xl lg:inset-x-12">
        <img
          src="/images/hero-vials.png"
          alt=""
          className="h-full w-full object-cover object-right"
        />
        {/* Solid left fade — more opaque on mobile so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F0EDE5] from-45% via-[#F0EDE5]/85 via-60% to-transparent to-80% sm:from-35% sm:via-50% sm:to-75%" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 py-8 sm:px-8 sm:py-16 lg:px-12">
        <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.8, type: "spring", stiffness: 200, damping: 15 }}
              className="relative inline-block"
            >
              <span className="pill-shimmer relative inline-flex items-center gap-2 rounded-full border border-sky-400/60 bg-white/60 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold tracking-widest text-stone-600 uppercase overflow-hidden">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Atom className="h-3.5 w-3.5 text-sky-500" />
                </motion.span>
                US-Manufactured &bull; cGMP Certified
              </span>
            </motion.div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-800 sm:mt-8 sm:text-6xl lg:text-7xl leading-[1.1]">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              >
                Premium Peptides.
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
              >
                Proven Purity.
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.2, ease: "easeOut" }}
              >
                Real <span className="hero-shimmer">Results.</span>
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.9 }}
              className="mt-3 text-sm text-stone-600 leading-relaxed sm:mt-6 sm:text-lg lg:text-xl max-w-lg"
            >
              <span className="hidden sm:inline">Your trusted source for independently tested, pharmaceutical-grade peptides. Every batch verified to &gt;99% purity with same-day shipping nationwide.</span>
              <span className="sm:hidden">Independently tested, pharmaceutical-grade peptides. &gt;99% purity verified.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.2 }}
              className="mt-5 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4"
            >
              {/* Explore — blue flow button */}
              <Link
                href="/shop"
                className="group relative flex items-center gap-1 overflow-hidden border-[1.5px] border-sky-400/50 bg-sky-400 rounded-full px-6 py-3 text-sm font-bold text-white sm:px-8 sm:py-4 sm:text-base cursor-pointer hover:text-stone-800 hover:border-stone-300/60 active:scale-[0.95]"
              >
                <ArrowRight className="absolute w-4 h-4 left-[-25%] stroke-white fill-none z-[9] group-hover:left-4 group-hover:stroke-stone-800 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
                  Explore the Catalog
                </span>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:w-[300px] group-hover:h-[300px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]" />
                <ArrowRight className="absolute w-4 h-4 right-4 stroke-white fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-stone-800 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
              </Link>

              {/* View Stacks — clean border button */}
              <Link
                href="/shop?category=stacks"
                className="group relative flex items-center gap-1 overflow-hidden rounded-full border-2 border-sky-300/60 bg-[#F0EDE5] px-6 py-3 text-sm font-bold text-stone-600 sm:px-8 sm:py-4 sm:text-base cursor-pointer hover:text-white active:scale-[0.95] transition-colors duration-500"
              >
                <ArrowRight className="absolute w-4 h-4 left-[-25%] stroke-stone-600 fill-none z-[9] group-hover:left-4 group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
                  View Stacks
                </span>
                <span className="absolute inset-0 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-sky-400 opacity-0 group-hover:w-[300px] group-hover:h-[300px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] z-[0]" />
                <ArrowRight className="absolute w-4 h-4 right-4 stroke-stone-600 fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 3.5 }}
              className="mt-6 flex flex-wrap gap-x-4 gap-y-2 sm:mt-14 sm:gap-x-8 sm:gap-y-3"
            >
              {[
                { icon: FlaskConical, text: ">99% Purity" },
                { icon: Atom, text: "LC-MS Verified" },
                { icon: Truck, text: "Same-Day Shipping" },
                { icon: Package, text: "85+ Peptides" },
                { icon: MapPin, text: "US-Based" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5 text-xs text-stone-500 sm:gap-2.5 sm:text-sm">
                  <b.icon className="h-4 w-4 text-sky-600/70" />
                  {b.text}
                </div>
              ))}
            </motion.div>
        </div>
      </div>
    </section>
  );
}
