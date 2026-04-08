import type { Metadata } from "next";
import WhyReVia from "@/components/WhyReVia";

export const metadata: Metadata = {
  title: "Why ReVia | ReVia Research Supply",
  description:
    "Learn what sets ReVia apart — US-manufactured, cGMP & ISO certified, >99% purity, per-batch COAs, and the most rigorous testing in the industry.",
};

export default function WhyUsPage() {
  return (
    <div className="bg-sky-50/30">
      <WhyReVia />
    </div>
  );
}
