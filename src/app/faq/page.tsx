import type { Metadata } from "next";
import FAQContent from "./faq-content";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FAQPage() {
  return <FAQContent />;
}
