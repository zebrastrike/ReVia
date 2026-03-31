"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
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
    <section className="relative min-h-[60vh] flex items-center">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
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
                Independently Verified &bull; &gt;99% Purity
              </span>
            </motion.div>

            <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-stone-800 sm:text-6xl lg:text-7xl leading-[1.1]">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Premium Peptides.
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Proven Purity.
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Real <span className="hero-shimmer">Results.</span>
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.9 }}
              className="mt-6 text-lg text-stone-600 leading-relaxed sm:text-xl max-w-lg"
            >
              Your trusted source for independently tested, pharmaceutical-grade peptides. Every batch verified to &gt;99% purity with same-day shipping nationwide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.2 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              {/* Explore — blue flow button */}
              <Link
                href="/shop"
                className="group relative flex items-center gap-1 overflow-hidden border-[1.5px] border-sky-500/50 bg-sky-500 rounded-full px-8 py-4 text-base font-bold text-white cursor-pointer hover:text-stone-800 hover:border-stone-300/60 active:scale-[0.95]"
              >
                <ArrowRight className="absolute w-4 h-4 left-[-25%] stroke-white fill-none z-[9] group-hover:left-4 group-hover:stroke-stone-800 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
                  Explore the Catalog
                </span>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:w-[300px] group-hover:h-[300px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]" />
                <ArrowRight className="absolute w-4 h-4 right-4 stroke-white fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-stone-800 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
              </Link>

              {/* View Stacks — transparent button with blue rotating border */}
              <Link
                href="/shop?category=stacks"
                className="group relative flex items-center gap-1 overflow-hidden rounded-full px-8 py-4 text-base font-bold text-stone-600 cursor-pointer hover:text-white active:scale-[0.95] glow-border-blue"
                style={{ transition: "color 600ms cubic-bezier(0.23,1,0.32,1)" }}
              >
                {/* Inner fill */}
                <span className="absolute inset-[2px] rounded-full bg-[#F0EDE5] z-[0]" />
                <ArrowRight className="absolute w-4 h-4 left-[-25%] stroke-stone-600 fill-none z-[9] group-hover:left-4 group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
                  View Stacks
                </span>
                <span className="absolute inset-[2px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-sky-500 opacity-0 group-hover:w-[300px] group-hover:h-[300px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] z-[0]" />
                <ArrowRight className="absolute w-4 h-4 right-4 stroke-stone-600 fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 3.5 }}
              className="mt-14 flex flex-wrap gap-x-8 gap-y-3"
            >
              {[
                { icon: FlaskConical, text: ">99% Purity" },
                { icon: Truck, text: "Same-Day Shipping" },
                { icon: Package, text: "85+ Peptides" },
                { icon: MapPin, text: "US-Based" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2.5 text-sm text-stone-500">
                  <b.icon className="h-4 w-4 text-sky-600/70" />
                  {b.text}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-sky-900/10 border border-sky-200/40 bg-white/30 backdrop-blur-sm p-2">
              <img
                src="/images/hero-landing.png"
                alt="ReVia research peptides"
                className="w-full rounded-2xl object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
