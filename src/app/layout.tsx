import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Fraunces, Space_Grotesk, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import JsonLd from "@/components/JsonLd";
import LayoutShell from "@/components/LayoutShell";
import ChatWidget from "@/components/ChatWidget";

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

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ReVia | Premium Peptides, Proven Purity",
    template: "%s | ReVia",
  },
  description:
    "Your #1 trusted source for independently verified peptides with >99% purity. Same-day shipping, 85+ compounds, US-based.",
  keywords: [
    "peptides",
    "peptide supply",
    "BPC-157",
    "semaglutide",
    "tirzepatide",
    "GHK-Cu",
    "premium peptides",
    "peptide vendor",
  ],
  authors: [{ name: "ReVia" }],
  creator: "ReVia LLC",
  metadataBase: new URL("https://revialife.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ReVia",
    title: "ReVia | Premium Peptides, Proven Purity",
    description:
      "Your #1 trusted source for independently verified peptides with >99% purity.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReVia | Premium Peptides, Proven Purity",
    description:
      "Your #1 trusted source for independently verified peptides with >99% purity.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://revialife.com",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ReVia Research Supply",
  url: "https://revialife.com",
  logo: "https://revialife.com/logo.png",
  description: "Premium research-grade peptides and compounds for scientific research.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@revialife.com",
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
      className={`${jakarta.variable} ${mono.variable} ${fraunces.variable} ${spaceGrotesk.variable} ${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-[#453834]">
        <JsonLd data={organizationLd} />
        <CartDrawer />
        <Toast />
        <LayoutShell>{children}</LayoutShell>
        <ChatWidget />
      </body>
    </html>
  );
}
