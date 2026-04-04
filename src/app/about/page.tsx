import type { Metadata } from "next";
import {
  Shield,
  BadgeCheck,
  Lightbulb,
  Truck,
  Quote,
  FlaskConical,
  Microscope,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ReVia's mission to provide researchers with the highest quality peptides and research compounds.",
};

const values = [
  {
    title: "Quality Without Compromise",
    icon: Shield,
    description:
      "Every single batch goes through rigorous HPLC and mass spectrometry testing. We publish full certificates of analysis because we believe transparency builds trust.",
  },
  {
    title: "Radical Integrity",
    icon: BadgeCheck,
    description:
      "We maintain transparent sourcing and manufacturing processes. Our supply chain is fully documented and auditable, because your research deserves nothing less.",
  },
  {
    title: "Relentless Innovation",
    icon: Lightbulb,
    description:
      "Science never stands still, and neither do we. We are continually expanding our catalog with cutting-edge compounds to keep your research on the frontier.",
  },
  {
    title: "Service That Cares",
    icon: Truck,
    description:
      "Fast, discreet shipping with real-time tracking. Our team of scientists and support specialists is here to answer your questions, not just your tickets.",
  },
];

function ScrollDivider({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-4">
      {label && (
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-300 mb-3">
          {label}
        </p>
      )}
      <div className="w-px h-16 bg-gradient-to-b from-sky-300/40 to-sky-200/20" />
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/60 via-sky-50/30 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 mb-5">
            About ReVia
          </p>
          <h1 className="text-5xl font-bold text-stone-900 leading-tight sm:text-6xl">
            The People Behind ReVia
          </h1>
          <div className="mx-auto mt-8 h-px w-16 bg-sky-300/60" />
          <p className="mt-8 text-xl text-stone-500 leading-relaxed max-w-2xl mx-auto">
            We started ReVia because we believe every researcher deserves access
            to compounds they can trust completely. No shortcuts, no compromise
            — just pure science, delivered with care.
          </p>
        </div>
      </section>

      <ScrollDivider label="Scroll" />

      {/* Mission */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 mb-2">
            Our Mission
          </p>
          <div className="mx-auto h-px w-10 bg-sky-300/60 mb-8" />
        </div>
        <p className="text-stone-600 leading-relaxed text-lg text-center">
          We are here to accelerate scientific discovery by putting
          premium-grade peptides and compounds into the hands of
          researchers who are changing the world. Every product in our
          catalog is synthesized under strict quality controls and verified
          through independent testing. Because when your reagents are
          reliable, your breakthroughs become repeatable.
        </p>
      </section>

      <ScrollDivider />

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 mb-2">
            Our Values
          </p>
          <h2 className="text-3xl font-bold text-stone-900">
            What We Stand For
          </h2>
          <div className="mx-auto mt-4 h-px w-10 bg-sky-300/60" />
          <p className="mt-4 text-stone-500 max-w-xl mx-auto">
            These are not just words on a page. They are the principles we build
            every decision on.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-sky-200/40 rounded-2xl overflow-hidden border border-sky-200/40">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="bg-white/90 p-8 transition-colors hover:bg-sky-50/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100/80 border border-sky-200/50 mb-5">
                  <Icon className="h-5 w-5 text-sky-500" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <ScrollDivider />

      {/* Origin Quote */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="relative text-center">
          <Quote className="mx-auto h-8 w-8 text-sky-300/60 mb-6" strokeWidth={1.5} />
          <blockquote className="text-2xl font-medium text-stone-800 leading-relaxed italic">
            Our founding team spent years on the bench before building ReVia.
            We know what it is like to wait weeks for a shipment, only to
            find the purity is not what was promised. We built ReVia to be
            the supplier we always wished we had.
          </blockquote>
          <div className="mx-auto mt-8 h-px w-16 bg-sky-300/60" />
          <p className="mt-6 text-stone-500 leading-relaxed max-w-2xl mx-auto">
            Today, we serve hundreds of labs and independent researchers
            across the country. Whether you are running your first assay or
            your thousandth, we are here to make sure your compounds are the
            last thing you have to worry about.
          </p>
        </div>
      </section>

      <ScrollDivider label="Testing" />

      {/* Our Testing Process */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 mb-2">
            Quality Assurance
          </p>
          <h2 className="text-3xl font-bold text-stone-900">
            Our Testing Process
          </h2>
          <div className="mx-auto mt-4 h-px w-10 bg-sky-300/60" />
          <p className="mt-4 text-stone-500 max-w-2xl mx-auto">
            We don&apos;t just test the raw material — we test the finished product
            exactly as it would be used. This level of verification is unmatched
            in the industry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-sky-200/40 bg-white/90 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100/80 border border-sky-200/50 mx-auto mb-4">
              <FlaskConical className="h-6 w-6 text-sky-500" strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-semibold text-stone-900 mb-2">HPLC Purity Testing</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Every batch is tested via High-Performance Liquid Chromatography
              to confirm &gt;99% purity before release. Full COAs are published
              for every product.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-200/40 bg-white/90 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100/80 border border-sky-200/50 mx-auto mb-4">
              <Microscope className="h-6 w-6 text-sky-500" strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-semibold text-stone-900 mb-2">LC-MS After Reconstitution</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              We are adding liquid chromatography–mass spectrometry testing on
              reconstituted peptides — verifying the molecule exactly as it
              enters use. No other company currently does this.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-200/40 bg-white/90 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100/80 border border-sky-200/50 mx-auto mb-4">
              <ShieldCheck className="h-6 w-6 text-sky-500" strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-semibold text-stone-900 mb-2">Heavy Metal Screening</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              All products are screened for toxic heavy metals including lead,
              arsenic, mercury, and cadmium — plus sterility and endotoxin
              testing on every batch.
            </p>
          </div>
        </div>
      </section>

      <ScrollDivider />

      {/* Commitment to Responsible Research */}
      <section className="bg-sky-50/60 border-y border-sky-200/30 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold text-sky-500 mb-3">
            Commitment to Responsible Research
          </h3>
          <p className="text-stone-500 leading-relaxed">
            All ReVia products are sold strictly for laboratory and scientific
            research purposes. They are not intended for human or animal
            consumption, or for use in the diagnosis, treatment, cure, or
            prevention of any disease. By purchasing from ReVia, customers
            confirm they are qualified researchers operating within applicable
            regulations.
          </p>
        </div>
      </section>
    </>
  );
}
