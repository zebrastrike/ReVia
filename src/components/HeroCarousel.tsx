"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/images/carousel-wellness.webp",
    title: "Science-Driven",
    subtitle: "Research",
    description: "Research-grade peptides for laboratory and institutional use.",
    link: "/shop",
    linkText: "Shop Now",
  },
  {
    image: "/images/carousel-performance.webp",
    title: "Longevity.",
    subtitle: "Performance.",
    description: "Trusted compounds for recovery, endurance, and body composition research.",
    link: "/shop?category=growth-hormone",
    linkText: "Explore",
  },
  {
    image: "/images/carousel-lifestyle.webp",
    title: "Trusted Science.",
    subtitle: "Real Results.",
    description: "99%+ purity. Third-party tested. USA manufactured.",
    link: "/why-us",
    linkText: "Learn More",
  },
];

export default function HeroCarousel() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-2 pb-8 sm:pt-0 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
        {slides.map((slide, i) => (
          <Link
            key={i}
            href={slide.link}
            className="group relative overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[16/9]">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-5">
                <h3 className="text-xl font-bold text-white leading-tight sm:text-lg lg:text-xl">
                  {slide.title}
                  <br />
                  <span className="text-sky-300">{slide.subtitle}</span>
                </h3>
                <p className="mt-1.5 text-xs text-white/60 line-clamp-2 max-w-[90%]">
                  {slide.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-300 group-hover:text-sky-200 transition-colors">
                  {slide.linkText}
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
