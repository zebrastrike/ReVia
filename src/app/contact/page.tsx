import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the ReVia team for questions about peptides, orders, or wholesale inquiries.",
};

export default function ContactPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4 text-center">
        Contact Us
      </h1>
      <p className="text-zinc-400 text-center mb-12 max-w-xl mx-auto">
        Have a question about an order, a product, or wholesale pricing? Reach
        out and we will get back to you within 24 hours.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form
            action="#"
            method="POST"
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="order">Order Question</option>
                <option value="wholesale">Wholesale Inquiry</option>
                <option value="technical">Technical Question</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors resize-none"
                placeholder="How can we help you?"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Get in Touch
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-zinc-500 block">Email</span>
                <a
                  href="mailto:support@revia.bio"
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  support@revia.bio
                </a>
              </div>
              <div>
                <span className="text-zinc-500 block">Response Time</span>
                <span className="text-zinc-300">Within 24 hours</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Business Hours
            </h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="text-zinc-300">9 AM - 6 PM EST</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-zinc-300">10 AM - 2 PM EST</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-zinc-300">Closed</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/shipping"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Shipping Information
                </Link>
                <p className="text-zinc-500 mt-0.5">
                  Rates, delivery times, and tracking
                </p>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Return Policy
                </Link>
                <p className="text-zinc-500 mt-0.5">
                  Eligibility, process, and refunds
                </p>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  FAQ
                </Link>
                <p className="text-zinc-500 mt-0.5">
                  Common questions answered
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
