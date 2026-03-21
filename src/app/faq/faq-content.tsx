"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    question: "What are research peptides?",
    answer:
      "Research peptides are short chains of amino acids synthesized for laboratory and scientific research purposes. All of our products are designated as Research Use Only (RUO) compounds and are not intended for human or animal consumption.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Simply browse our catalog, select the products and variants you need, add them to your cart, and proceed to checkout. You can review your order before submitting payment.",
  },
  {
    question: "What payment methods do you accept?",
    answer: (
      <>
        We accept several payment methods. For full details, please see our{" "}
        <Link href="/policies/payments" className="text-emerald-400 hover:underline">
          payment policy
        </Link>
        .
      </>
    ),
  },
  {
    question: "What is your shipping policy?",
    answer: (
      <>
        We offer fast domestic shipping on all orders. For complete shipping information
        including timelines and handling, please visit our{" "}
        <Link href="/policies/shipping" className="text-emerald-400 hover:underline">
          shipping policy
        </Link>
        .
      </>
    ),
  },
  {
    question: "Do you offer refunds?",
    answer: (
      <>
        All sales are final. Due to the nature of our products, we cannot accept returns or
        issue refunds. For more details, please review our{" "}
        <Link href="/policies/refunds" className="text-emerald-400 hover:underline">
          refund policy
        </Link>
        .
      </>
    ),
  },
  {
    question: "Are your products FDA approved?",
    answer:
      "No. Our products are not FDA approved and are sold exclusively for research use only (RUO). They are not intended for human or animal consumption, diagnosis, treatment, cure, or prevention of any disease.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "We currently only ship within the United States. We do not offer international shipping at this time.",
  },
  {
    question: "How should peptides be stored?",
    answer:
      "Peptides should be stored refrigerated (2\u20138\u00b0C) and away from direct light. Once reconstituted, peptides should be used within 30 days for optimal stability. Lyophilized (powder) peptides can be stored for longer periods when kept sealed and refrigerated.",
  },
  {
    question: "What is a peptide stack?",
    answer:
      "A peptide stack is a curated bundle of complementary peptides that are commonly used together in research protocols. Stacks offer convenience and often come at a better value than purchasing each peptide individually.",
  },
  {
    question: "How do I contact support?",
    answer: (
      <>
        You can reach our support team at{" "}
        <a href="mailto:support@revia.bio" className="text-emerald-400 hover:underline">
          support@revia.bio
        </a>{" "}
        or visit our{" "}
        <Link href="/contact" className="text-emerald-400 hover:underline">
          contact page
        </Link>
        .
      </>
    ),
  },
  {
    question: "Do you offer wholesale pricing?",
    answer: (
      <>
        Yes, we offer wholesale pricing for qualifying orders. Please{" "}
        <Link href="/contact" className="text-emerald-400 hover:underline">
          contact us
        </Link>{" "}
        for wholesale inquiries and volume discounts.
      </>
    ),
  },
  {
    question: "Can I use a discount code?",
    answer:
      "Yes! If you have a discount code, you can enter it at checkout to apply the discount to your order.",
  },
];

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-white/5"
      >
        <span className="text-sm font-medium text-gray-200 pr-4">{item.question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-400">
          Find answers to common questions about our products, ordering, and policies.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <FAQAccordionItem
            key={i}
            item={faq}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
          Still have questions?{" "}
          <Link href="/contact" className="text-emerald-400 hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </section>
  );
}
