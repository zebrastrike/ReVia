"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Facebook, Instagram, Youtube, Linkedin, Mail } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

const footerSections = [
  {
    label: "Shop",
    links: [
      { title: "All Products", href: "/shop" },
      { title: "Peptides", href: "/shop?category=peptides" },
      { title: "Stacks", href: "/shop?category=stacks" },
      { title: "Accessories", href: "/shop?category=accessories" },
    ],
  },
  {
    label: "Company",
    links: [
      { title: "About", href: "/about" },
      { title: "Articles", href: "/learn?tab=articles" },
      { title: "Research", href: "/learn?tab=research" },
      { title: "Contact", href: "/contact" },
      { title: "FAQ", href: "/faq" },
    ],
  },
  {
    label: "Legal",
    links: [
      { title: "Terms", href: "/policies/terms" },
      { title: "Privacy", href: "/policies/privacy" },
      { title: "Shipping", href: "/policies/shipping" },
      { title: "Refund Policy", href: "/policies/refunds" },
    ],
  },
  {
    label: "Connect",
    links: [
      { title: "Facebook", href: "#", icon: Facebook },
      { title: "Instagram", href: "#", icon: Instagram },
      { title: "Youtube", href: "#", icon: Youtube },
      { title: "LinkedIn", href: "#", icon: Linkedin },
    ],
  },
];

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: {
  className?: ComponentProps<typeof motion.div>["className"];
  delay?: number;
  children: ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Footer() {
  return (
    <footer className="font-legal relative w-full border-t border-sky-200/40 bg-sky-50/60">
      <div className="bg-sky-400/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="mx-auto max-w-7xl px-6 py-5 lg:py-6">
        <div className="grid w-full gap-6 xl:grid-cols-3 xl:gap-8">
          {/* Brand column */}
          <AnimatedContainer className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="ReVia logo" width={32} height={32} className="h-8 w-8" />
              <Image src="/images/revia-text.png" alt="ReVia" width={100} height={30} className="h-6 w-auto" />
            </Link>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
              Premium peptides, independently verified to &gt;99% purity.
              Your trusted source since 2024.
            </p>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <Mail className="h-4 w-4 text-sky-500" />
              <a href="mailto:contact@revialife.com" className="hover:text-sky-600 transition-colors">
                contact@revialife.com
              </a>
            </div>
          </AnimatedContainer>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2">
            {footerSections.map((section, index) => (
              <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                <div className="mb-6 md:mb-0">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {section.label}
                  </h3>
                  <ul className="mt-2.5 space-y-1.5">
                    {section.links.map((link) => (
                      <li key={link.title}>
                        <Link
                          href={link.href}
                          className="inline-flex items-center text-sm text-stone-500 transition-all duration-300 hover:text-sky-600"
                        >
                          {"icon" in link && link.icon && (
                            <link.icon className="mr-1.5 h-4 w-4" />
                          )}
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <AnimatedContainer delay={0.6} className="mt-4 border-t border-sky-200/30 pt-3 text-center space-y-1.5">
          <p className="text-[10px] text-stone-400 leading-relaxed max-w-6xl mx-auto">
            All products sold by ReVia carry a Research Use Only (RUO) designation as required by current US regulations and are intended for laboratory research use only. They are not intended for human or animal consumption, or for use in the diagnosis, treatment, cure, or prevention of any disease. This designation is standard practice for compounds awaiting formal FDA classification and does not reflect the quality, purity, or manufacturing standard. Our formulations meet pharmaceutical-grade specifications and are manufactured to physician-use (PUD) standards throughout.
          </p>
          <p className="text-[10px] text-stone-400">
            &copy; 2024&ndash;{new Date().getFullYear()} ReVia LLC. All rights reserved.
          </p>
        </AnimatedContainer>
      </div>
    </footer>
  );
}
