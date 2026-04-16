"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, HelpCircle, Package, CreditCard, Truck, RotateCcw, FlaskConical, Layers } from "lucide-react";

interface FAQ { q: string; a: string }
interface Section { title: string; icon: React.ReactNode; items: FAQ[] }

const sections: Section[] = [
  {
    title: "Getting Started",
    icon: <HelpCircle className="h-5 w-5" />,
    items: [
      { q: "What are research peptides?", a: "Research peptides are synthetic amino acid chains used in laboratory research to study biological processes. All ReVia products are labeled 'For Research Use Only' (RUO) and are not intended for human or animal consumption, diagnosis, treatment, or prevention of any disease." },
      { q: "Who can purchase from ReVia?", a: "ReVia sells to qualified researchers, academic institutions, independent labs, and individuals aged 18+ who agree to use products solely for legitimate research purposes." },
      { q: "How do I create an account?", a: "Click 'Register' in the top navigation, enter your name, email, and a secure password (8+ characters). Your account gives you access to order tracking, reviews, and faster checkout." },
      { q: "How do I place my first order?", a: "Browse our shop by category or search for specific peptides. Add items to your cart, proceed to checkout, enter shipping info, apply any discount codes, and submit. You'll receive an email confirmation." },
    ],
  },
  {
    title: "Products & Quality",
    icon: <FlaskConical className="h-5 w-5" />,
    items: [
      { q: "Are your peptides third-party tested?", a: "Yes. Every batch undergoes independent HPLC purity analysis and mass spectrometry identity confirmation. This dual-testing ensures both purity and correct composition." },
      { q: "What purity level are your peptides?", a: "All products meet a >99% purity standard (research-grade, USP/NF/BP), verified by HPLC. This quality level is essential for reproducible research." },
      { q: "How should I store my peptides?", a: "Store lyophilized peptides at 2-8°C, protected from light and moisture. Once reconstituted, use within 30 days and keep refrigerated. For long-term storage, -20°C is recommended." },
      { q: "What is the shelf life?", a: "Lyophilized peptides remain stable 18-24 months when stored properly. Reconstituted peptides should be used within 30 days." },
      { q: "Do you offer Certificates of Analysis?", a: "Yes. Batch-specific COAs are available for every product. When available, COA links are displayed directly on the product page. You can also email orders@revialife.com with your order number and we'll provide documentation within 24 hours." },
      { q: "What's the difference between lyophilized and reconstituted?", a: "Lyophilized = freeze-dried powder (stable, ship and store this way). Reconstituted = dissolved in solvent like BAC water (use within 30 days). Reconstitute only when ready to begin research." },
    ],
  },
  {
    title: "Stacks & Bundles",
    icon: <Layers className="h-5 w-5" />,
    items: [
      { q: "What are peptide stacks?", a: "Stacks are curated multi-peptide blends in a single vial, designed for specific research goals. Our blends include LEAN (metabolic optimization), LEAN PRO+ (advanced metabolic optimization), RENEW (recovery), SCULPT & GLOW (body composition + aesthetics), GLOW (skin health), and KLOW (aesthetics + hormonal support)." },
      { q: "What's the most popular stack?", a: "ReVia LEAN (Tirzepatide + Cagrilintide) and ReVia RENEW (BPC-157 + TB-500 + GHK-Cu) are our top sellers. SCULPT & GLOW is popular for researchers studying multiple pathways simultaneously." },
      { q: "Are stacks discounted?", a: "Yes — our blended vials are priced below what the individual components would cost separately." },
    ],
  },
  {
    title: "Orders & Payment",
    icon: <CreditCard className="h-5 w-5" />,
    items: [
      { q: "Do you offer wholesale pricing?", a: "Yes. Contact info@revialife.com for B2B and wholesale inquiries with your organization details and anticipated volume." },
      { q: "Is there a minimum order?", a: "No minimum — purchase as little as a single product." },
      { q: "Can I use a discount code?", a: "Yes! Enter your code in the coupon field at checkout. The discount will appear in your order summary before payment." },
      { q: "How do I track my order?", a: "You'll receive a tracking email when your order ships. You can also check status in your account dashboard." },
    ],
  },
  {
    title: "Shipping",
    icon: <Truck className="h-5 w-5" />,
    items: [
      { q: "How long does shipping take?", a: "All orders ship next business day. Standard delivers in 5-7 business days. Expedited delivers in 2-3 business days. Overnight delivers next business day. All orders include tracking, insurance, and discreet packaging." },
      { q: "Do you ship internationally?", a: "US domestic only currently. Subscribe to our newsletter for updates on international shipping availability." },
      { q: "Is shipping discreet?", a: "Yes. All orders ship in plain, unmarked packaging with no product names or branding visible on the outside." },
      { q: "What if my package arrives damaged?", a: "Contact us within 48 hours at orders@revialife.com with photos and your order number. We'll ship a replacement." },
    ],
  },
  {
    title: "Returns & Policies",
    icon: <RotateCcw className="h-5 w-5" />,
    items: [
      { q: "Do you offer refunds?", a: "All sales are final. Exceptions only for: shipping damage (48hr window), wrong items shipped, or quality issues (7-day window). Replacements only, no cash refunds." },
      { q: "Where can I read your full policies?", a: "Visit our policy pages: Terms of Service, Privacy Policy, Shipping Policy, Refund Policy, Acceptable Use Policy, CCPA Notice, Cookie Policy, and Payment Policy — all linked in the footer." },
    ],
  },
  {
    title: "Research & Safety",
    icon: <Package className="h-5 w-5" />,
    items: [
      { q: "Are your products FDA approved?", a: "No. Our products are research chemicals for laboratory use only. Not FDA approved, not for human/animal consumption, not for diagnosis or treatment of any disease." },
      { q: "Can I get research guidance?", a: "We can answer questions about product composition, storage, and handling. Contact info@revialife.com. We cannot provide research protocols or dosing guidance." },
      { q: "What reconstitution supplies do you carry?", a: "BAC water (10ml) and acetic acid (10ml) — the most common solvents for peptide reconstitution. We also carry syringes." },
    ],
  },
];

export default function FAQContent() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = sections
    .map((s) => ({ ...s, items: s.items.filter((i) => !search || i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase())) }))
    .filter((s) => s.items.length > 0);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Frequently Asked{" "}
          <span className="bg-linear-to-r from-sky-600 to-blue-500 bg-clip-text text-transparent">Questions</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-500">Everything you need to know about ReVia, our products, and how we support your research.</p>
      </div>

      <div className="relative mx-auto mt-10 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
        <input type="text" placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-12 pr-4 text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30" />
      </div>

      <div className="mt-12 space-y-10">
        {filtered.map((section) => (
          <div key={section.title}>
            <div className="mb-4 flex items-center gap-3 text-sky-600">
              {section.icon}
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
            <div className="space-y-2">
              {section.items.map((item) => {
                const key = `${section.title}-${item.q}`;
                const isOpen = openIndex === key;
                return (
                  <div key={key} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                    <button onClick={() => setOpenIndex(isOpen ? null : key)} className="flex w-full items-center justify-between px-5 py-4 text-left text-neutral-900 transition hover:bg-neutral-50">
                      <span className="pr-4 font-medium">{item.q}</span>
                      <ChevronDown className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                          <p className="border-t border-neutral-100 px-5 py-4 text-neutral-500 leading-relaxed">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <p className="mt-12 text-center text-neutral-500">No questions match your search.</p>}

      <div className="mt-16 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <h3 className="text-xl font-semibold text-neutral-900">Still have questions?</h3>
        <p className="mt-2 text-neutral-500">Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.</p>
        <Link href="/contact" className="mt-6 inline-flex items-center justify-center rounded-xl bg-sky-400 px-8 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">Contact Support</Link>
      </div>
    </section>
  );
}
