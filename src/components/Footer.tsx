import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

const shopLinks = [
  { href: "/shop", label: "All Products" },
  { href: "/shop?category=peptides", label: "Peptides" },
  { href: "/shop?category=stacks", label: "Stacks" },
  { href: "/shop?category=accessories", label: "Accessories" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

const legalLinks = [
  { href: "/policies/terms", label: "Terms" },
  { href: "/policies/privacy", label: "Privacy" },
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/refunds", label: "Refund Policy" },
  { href: "/policies/aup", label: "AUP" },
  { href: "/policies/ccpa", label: "CCPA" },
  { href: "/policies/cookies", label: "Cookies" },
  { href: "/policies/payments", label: "Payments" },
  { href: "/policies/disclaimer", label: "Disclaimer" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#111]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-emerald-500 tracking-tight">
              ReVia
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Premium research-grade peptides and compounds for scientific research.
              Rigorous quality testing on every batch.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Get the latest research peptide news and exclusive offers.
            </p>
            <NewsletterSignup />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-gray-600">
            &copy; 2024&ndash;2026 ReVia. All rights reserved. For research use only.
          </p>
        </div>
      </div>
    </footer>
  );
}
