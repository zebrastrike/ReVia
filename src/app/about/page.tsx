import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ReVia's mission to provide researchers with the highest quality peptides and research compounds.",
};

const values = [
  {
    title: "Quality",
    icon: "shield",
    description:
      "Every batch undergoes rigorous HPLC and mass spectrometry testing. We publish certificates of analysis for full transparency on purity and identity.",
  },
  {
    title: "Integrity",
    icon: "check-circle",
    description:
      "We maintain transparent sourcing and manufacturing processes. Our supply chain is fully documented and auditable from synthesis to shipment.",
  },
  {
    title: "Innovation",
    icon: "lightbulb",
    description:
      "We continually expand our catalog with cutting-edge compounds, staying at the forefront of peptide science to support your research.",
  },
  {
    title: "Service",
    icon: "truck",
    description:
      "Fast, discreet shipping with real-time tracking. Our expert support team is available to answer technical and order-related questions.",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  shield: (
    <svg
      className="w-8 h-8 text-emerald-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  "check-circle": (
    <svg
      className="w-8 h-8 text-emerald-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  lightbulb: (
    <svg
      className="w-8 h-8 text-emerald-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  truck: (
    <svg
      className="w-8 h-8 text-emerald-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
      />
    </svg>
  ),
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-b from-emerald-900/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">About ReVia</h1>
          <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            We are dedicated to providing researchers with the highest quality
            peptides and research compounds, backed by rigorous analytical
            testing and exceptional service.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-zinc-400 leading-relaxed text-lg">
            At ReVia, our mission is to accelerate scientific discovery by
            supplying researchers with premium-grade peptides and compounds.
            Every product in our catalog is synthesized under strict quality
            controls and verified through independent analytical testing. We
            believe that reliable reagents are the foundation of reproducible
            research, and we are committed to being the supplier scientists
            trust.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-emerald-900/50 transition-colors"
            >
              <div className="mb-4">{iconMap[value.icon]}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {value.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Research Use Only */}
      <section className="bg-emerald-900/20 border-y border-emerald-900/30 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold text-emerald-400 mb-3">
            Commitment to Responsible Research
          </h3>
          <p className="text-zinc-400 leading-relaxed">
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
