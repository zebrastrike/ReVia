"use client";

import { motion } from "framer-motion";
import {
  FlaskConical,
  ShieldCheck,
  Microscope,
  Atom,
  Beaker,
  Fingerprint,
  Dna,
  ScanLine,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

const trustItems = [
  { icon: FlaskConical, text: ">99% Purity Verified", detail: "Every batch" },
  { icon: Microscope, text: "HPLC Analysis", detail: "High-performance liquid chromatography" },
  { icon: Atom, text: "LC-MS Confirmed", detail: "Mass spectrometry verification" },
  { icon: ShieldCheck, text: "Endotoxin Tested", detail: "LAL testing per batch" },
  { icon: Beaker, text: "Sterility Screened", detail: "USP <71> compliant" },
  { icon: Fingerprint, text: "Heavy Metals Panel", detail: "ICP-MS screening" },
  { icon: Dna, text: "Amino Acid Sequencing", detail: "Identity confirmation" },
  { icon: ScanLine, text: "Residual Solvent Testing", detail: "USP <467> methods" },
  { icon: BadgeCheck, text: "cGMP Manufactured", detail: "FDA-registered facilities" },
  { icon: Sparkles, text: "Certificate of Analysis", detail: "Independent lab verified" },
  { icon: ShieldCheck, text: "Bioburden Testing", detail: "Microbial limits verified" },
  { icon: Microscope, text: "Peptide Content Assay", detail: "Net peptide quantification" },
];

// Double the items for seamless loop
const items = [...trustItems, ...trustItems];

export default function TrustTicker() {
  return (
    <section className="relative overflow-hidden bg-stone-900 py-5">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-stone-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-stone-900 to-transparent z-10" />

      <div className="mb-3 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">
          Quality Assurance Protocol
        </p>
      </div>

      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["-50%", "0%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 35,
            ease: "linear",
          },
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 shrink-0 px-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-800 border border-stone-700">
              <item.icon className="h-4 w-4 text-sky-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-200">{item.text}</p>
              <p className="text-[10px] text-stone-500">{item.detail}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Stats row */}
      <div className="mt-4 flex items-center justify-center gap-8 sm:gap-16">
        {[
          { value: "99.4%", label: "Avg Purity" },
          { value: "12", label: "QC Tests Per Batch" },
          { value: "42", label: "COAs Published" },
          { value: "0", label: "Failed Batches" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-lg sm:text-xl font-bold text-sky-400">{stat.value}</p>
            <p className="text-[9px] sm:text-[10px] text-stone-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
