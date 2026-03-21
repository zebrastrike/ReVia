import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <Navbar />
        <CartDrawer />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
