import type { Metadata } from "next";
import FAQContent from "./faq-content";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about ReVia research peptides, ordering, shipping, and more.",
};

const faqData = [
  { q: "What are research peptides?", a: "Research peptides are synthetic amino acid chains used in laboratory research to study biological processes. All ReVia products are labeled 'For Research Use Only' (RUO) and are not intended for human or animal consumption." },
  { q: "Who can purchase from ReVia?", a: "ReVia sells to qualified researchers, academic institutions, and individuals aged 18 and older who agree to use products solely for legitimate research purposes." },
  { q: "How do I create an account?", a: "Click 'Register' in the top navigation, enter your name, email, and password, and you're ready to go. An account lets you track orders, save wishlists, and leave reviews." },
  { q: "How do I place my first order?", a: "Browse our shop, add products to your cart, proceed to checkout, enter your shipping details, and submit. You'll receive an order confirmation email." },
  { q: "Are your peptides third-party tested?", a: "Yes. Every batch is tested by independent laboratories for purity and identity. We maintain HPLC and mass spectrometry documentation for all products." },
  { q: "What purity level are your peptides?", a: "We maintain a 98%+ purity standard across our catalog, verified by HPLC analysis. Certificates of Analysis are available on request." },
  { q: "How should I store my peptides?", a: "Store lyophilized peptides refrigerated at 2-8°C, away from direct light and moisture. Once reconstituted, use within 30 days and keep refrigerated." },
  { q: "What is the shelf life of your peptides?", a: "Lyophilized peptides typically remain stable for 18-24 months when stored properly. Reconstituted peptides should be used within 30 days." },
  { q: "Do you offer Certificates of Analysis (COAs)?", a: "Yes. COAs are available for every batch upon request. Contact contact@revialife.com with your order number and we'll provide batch-specific documentation." },
  { q: "What is the difference between lyophilized and reconstituted peptides?", a: "Lyophilized peptides are freeze-dried powder form — stable for long-term storage. Reconstituted peptides have been dissolved in a solvent like bacteriostatic water and must be used within 30 days." },
  { q: "What are peptide stacks?", a: "Stacks are curated combinations of complementary peptides bundled together for specific research goals. Each stack is designed around published synergy data and established research protocols." },
  { q: "Can I build my own custom stack?", a: "Yes! Select 3 or more products and receive a 10% discount automatically at checkout. Mix and match any products in our catalog." },
  { q: "What's the most popular stack?", a: "Phoenix (BPC-157 + TB500 + KPV) and Metamorphosis (Retatrutide + NAD+ + GHK-Cu) are consistently our most popular research stacks." },
  { q: "Are stacks discounted compared to individual products?", a: "Yes, stacks are pre-discounted — typically 10% below the combined individual pricing, offering better value for multi-compound research." },
  { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, and Discover. Cryptocurrency payments may also be available. All transactions are PCI-DSS compliant." },
  { q: "Do you offer wholesale pricing?", a: "Yes. Contact us at contact@revialife.com for B2B and wholesale pricing inquiries. We offer tiered pricing for research institutions and distributors." },
  { q: "Is there a minimum order amount?", a: "No minimum order. You can purchase as little as a single product." },
  { q: "Can I use a discount code?", a: "Yes! Enter your discount code in the coupon field at checkout. The discount will be applied to your order total before payment." },
  { q: "How do I track my order?", a: "Once your order ships, you'll receive an email with tracking information. You can also view order status in your account dashboard." },
  { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days, Priority shipping 2-3 business days, and Overnight delivery is available. Orders are processed within 1-3 business days." },
  { q: "Do you ship internationally?", a: "Currently, we ship within the United States only. International shipping may be available in the future." },
  { q: "Do you offer cold chain shipping?", a: "Yes. Temperature-sensitive compounds are shipped with cold packs and insulated packaging to maintain product integrity during transit." },
  { q: "What if my package arrives damaged?", a: "Contact us within 48 hours of delivery with photos of the damage and your order number. We'll send a replacement at no charge." },
  { q: "Do you offer refunds?", a: "All sales are final. Exceptions are made for items damaged in transit (reported within 48 hours), wrong items shipped, or verified quality issues (reported within 7 days). Replacements only — no cash refunds." },
  { q: "Are your products FDA approved?", a: "No. Our products are research chemicals sold for laboratory research use only. They are not FDA approved and are not intended for human consumption, diagnosis, treatment, cure, or prevention of any disease." },
  { q: "Can I get research guidance?", a: "We can answer general questions about our products, storage, and handling. Contact contact@revialife.com. We cannot provide specific research protocols or dosing guidance." },
  { q: "What reconstitution supplies do you carry?", a: "We carry bacteriostatic water (3ml and 10ml), sterile water (3ml and 10ml), and acetic acid (3ml and 10ml) for peptide reconstitution." },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqData.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqLd} />
      <FAQContent />
    </>
  );
}
