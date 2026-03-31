"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Truck } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export default function ShippingBanner() {
  const [threshold, setThreshold] = useState(FREE_SHIPPING_THRESHOLD);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.freeShippingThreshold) setThreshold(data.freeShippingThreshold);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="sticky top-[57px] z-40" style={{ background: isHome ? "#EFF8FE" : "transparent" }}>
      {/* Clip wrapper so the banner is hidden above when translated */}
      <div className="overflow-hidden">
        <motion.div
          initial={isHome ? { y: "-100%" } : { y: 0 }}
          animate={{ y: 0 }}
          transition={
            isHome
              ? { delay: 7, duration: 0.5, type: "spring", stiffness: 200, damping: 20 }
              : { duration: 0 }
          }
          className="relative w-full overflow-hidden bg-gradient-to-r from-sky-600 via-sky-500 to-blue-500 py-2.5"
        >
          {/* Animated shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          />

          <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-4">
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Truck className="h-4 w-4 text-white" />
            </motion.div>

            <span className={`relative text-xs font-semibold tracking-[0.25em] -mr-[0.25em] text-white sm:text-sm overflow-hidden ${isHome ? "shipping-sparkle" : ""}`}>
              Free shipping on orders over ${(threshold / 100).toFixed(0)}
            </span>

            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Truck className="h-4 w-4 text-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
