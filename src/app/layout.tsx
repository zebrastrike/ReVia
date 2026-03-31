import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import JsonLd from "@/components/JsonLd";
import LayoutShell from "@/components/LayoutShell";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ReVia | Research-Grade Peptides",
    template: "%s | ReVia",
  },
  description:
    "Premium research-grade peptides and compounds for scientific research. Rigorous testing, fast shipping, extensive catalog.",
  keywords: [
    "research peptides",
    "peptide supply",
    "BPC-157",
    "semaglutide",
    "tirzepatide",
    "GHK-Cu",
    "research compounds",
    "peptide vendor",
  ],
  authors: [{ name: "ReVia Research Supply" }],
  creator: "ReVia Research Supply LLC",
  metadataBase: new URL("https://revia.bio"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ReVia",
    title: "ReVia | Research-Grade Peptides",
    description:
      "Premium research-grade peptides and compounds for scientific research.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReVia | Research-Grade Peptides",
    description:
      "Premium research-grade peptides and compounds for scientific research.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://revia.bio",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ReVia Research Supply",
  url: "https://revia.bio",
  logo: "https://revia.bio/logo.png",
  description: "Premium research-grade peptides and compounds for scientific research.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@revia.bio",
    contactType: "customer service",
  },
  address: {
    "@type": "PostalAddress",
    addressRegion: "FL",
    addressCountry: "US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${mono.variable} ${fraunces.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-[#453834]">
        <JsonLd data={organizationLd} />
        <CartDrawer />
        <Toast />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
