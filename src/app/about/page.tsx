import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ReVia's mission to provide researchers with the highest quality peptides and research compounds.",
};

const values = [
  {
    title: "Quality Without Compromise",
    icon: "shield",
    description:
      "Every single batch goes through rigorous HPLC and mass spectrometry testing. We publish full certificates of analysis because we believe transparency builds trust.",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16f461?w=400&h=250&fit=crop",
  },
  {
    title: "Radical Integrity",
    icon: "check-circle",
    description:
      "We maintain transparent sourcing and manufacturing processes. Our supply chain is fully documented and auditable, because your research deserves nothing less.",
    image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400&h=250&fit=crop",
  },
  {
    title: "Relentless Innovation",
    icon: "lightbulb",
    description:
      "Science never stands still, and neither do we. We are continually expanding our catalog with cutting-edge compounds to keep your research on the frontier.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop",
  },
  {
    title: "Service That Cares",
    icon: "truck",
    description:
      "Fast, discreet shipping with real-time tracking. Our team of scientists and support specialists is here to answer your questions, not just your tickets.",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=250&fit=crop",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  shield: (
    <svg
      className="w-8 h-8 text-sky-600"
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
      className="w-8 h-8 text-sky-600"
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
      className="w-8 h-8 text-sky-600"
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
      className="w-8 h-8 text-sky-600"
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
      {/* Hero with background image */}
      <section className="relative py-24 overflow-hidden bg-[#fafafa]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1600&h=600&fit=crop"
            alt="Laboratory environment"
            className="h-full w-full object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-neutral-900 mb-6">
            The People Behind{" "}
            <span className="bg-linear-to-r from-sky-600 via-blue-500 to-sky-600 bg-clip-text text-transparent">
              ReVia
            </span>
          </h1>
          <p className="text-xl text-neutral-500 leading-relaxed max-w-2xl mx-auto">
            We started ReVia because we believe every researcher deserves access
            to compounds they can trust completely. No shortcuts, no compromise
            -- just pure science, delivered with care.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 relative">
              <img
                src="https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&h=400&fit=crop"
                alt="Microscope research"
                className="h-full w-full object-cover min-h-[250px]"
              />
            </div>
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Our Mission</h2>
              <p className="text-neutral-600 leading-relaxed text-lg">
                We are here to accelerate scientific discovery by putting
                premium-grade peptides and compounds into the hands of
                researchers who are changing the world. Every product in our
                catalog is synthesized under strict quality controls and verified
                through independent testing. Because when your reagents are
                reliable, your breakthroughs become repeatable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4 text-center">
          What We Stand For
        </h2>
        <p className="text-neutral-500 text-center mb-10 max-w-xl mx-auto">
          These are not just words on a page. They are the principles we build
          every decision on.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="h-32 overflow-hidden">
                <img
                  src={value.image}
                  alt={value.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="relative p-6 pt-4">
                <div className="mb-4">{iconMap[value.icon]}</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team / Community feel section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 flex-shrink-0">
              <div className="overflow-hidden rounded-2xl border border-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1582719471384-894fbb16f461?w=400&h=400&fit=crop"
                  alt="Lab team at work"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Built by Scientists, for Scientists
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Our founding team spent years on the bench before building ReVia.
                We know what it is like to wait weeks for a shipment, only to
                find the purity is not what was promised. We built ReVia to be
                the supplier we always wished we had.
              </p>
              <p className="text-neutral-500 leading-relaxed">
                Today, we serve hundreds of labs and independent researchers
                across the country. Whether you are running your first assay or
                your thousandth, we are here to make sure your compounds are the
                last thing you have to worry about.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Use Only */}
      <section className="bg-neutral-100 border-y border-neutral-200 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold text-sky-600 mb-3">
            Commitment to Responsible Research
          </h3>
          <p className="text-neutral-500 leading-relaxed">
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
