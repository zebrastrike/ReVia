import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Policies | ReVia Research Supply",
  description:
    "Legal policies, terms, and notices for ReVia Research Supply — terms of service, privacy, shipping, refunds, and more.",
  alternates: { canonical: "https://revialife.com/policies" },
};

const policies = [
  { href: "/policies/terms", label: "Terms of Service", desc: "Conditions of use for revialife.com and ReVia services." },
  { href: "/policies/privacy", label: "Privacy Policy", desc: "How we collect, use, and protect your personal information." },
  { href: "/policies/shipping", label: "Shipping Policy", desc: "Order processing, carriers, transit times, and tracking." },
  { href: "/policies/refunds", label: "Refund & Return Policy", desc: "When and how returns and refunds are issued." },
  { href: "/policies/payments", label: "Payment Policy", desc: "Accepted payment methods and processing details." },
  { href: "/policies/aup", label: "Acceptable Use Policy", desc: "Rules governing use of the ReVia platform." },
  { href: "/policies/disclaimer", label: "Research-Use-Only Disclaimer", desc: "Required disclosure on the intended use of our products." },
  { href: "/policies/cookies", label: "Cookie Policy", desc: "Cookies and similar tracking technologies we use." },
  { href: "/policies/ccpa", label: "CCPA Notice", desc: "California Consumer Privacy Act notice and rights." },
];

export default function PoliciesIndexPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-stone-900">Policies</h1>
      <p className="mt-2 text-stone-600">
        Choose a policy below to view its full text.
      </p>
      <ul className="mt-8 space-y-3">
        {policies.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="group flex items-start justify-between gap-4 rounded-xl border border-sky-200/40 bg-white/70 px-5 py-4 transition hover:bg-white hover:shadow-sm"
            >
              <div>
                <h2 className="text-base font-semibold text-stone-800">{p.label}</h2>
                <p className="text-sm text-stone-500 mt-0.5">{p.desc}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-stone-400 group-hover:text-stone-700 mt-1 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
