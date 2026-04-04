"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Clock, ArrowRight, Check } from "lucide-react";

const subjectLabels: Record<string, string> = {
  order: "Order Question",
  product: "Product Question",
  shipping: "Shipping & Delivery",
  return: "Returns & Refunds",
  account: "Account Help",
  feedback: "Feedback",
  other: "Other",
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          subject: subjectLabels[form.subject] ?? form.subject,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to send message");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 mb-3">
          Get in Touch
        </p>
        <h1 className="text-4xl font-bold text-stone-900 sm:text-5xl">Contact Us</h1>
        <p className="mt-4 text-stone-500 max-w-xl mx-auto">
          Have a question about an order, a product, or need help with something?
          Reach out and we&apos;ll get back to you within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="rounded-2xl border border-sky-200/40 bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm text-center py-16">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 mx-auto mb-4">
                <Check className="h-7 w-7 text-sky-500" />
              </div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">Message Sent!</h2>
              <p className="text-stone-500 text-sm max-w-md mx-auto">
                Thank you for reaching out. We&apos;ll get back to you within 24 hours during business days.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-sky-200/40 bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm space-y-5"
            >
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-stone-500 mb-1.5">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    className="w-full rounded-xl border border-sky-200/50 bg-white/80 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-stone-500 mb-1.5">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    className="w-full rounded-xl border border-sky-200/50 bg-white/80 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-medium text-stone-500 mb-1.5">Reason for Contact</label>
                <select
                  id="subject"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-sky-200/50 bg-white/80 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 appearance-none"
                >
                  <option value="" disabled>Select a reason</option>
                  <option value="order">Order Question</option>
                  <option value="product">Product Question</option>
                  <option value="shipping">Shipping &amp; Delivery</option>
                  <option value="return">Returns &amp; Refunds</option>
                  <option value="account">Account Help</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-stone-500 mb-1.5">Message</label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  rows={5}
                  required
                  className="w-full rounded-xl border border-sky-200/50 bg-white/80 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto rounded-xl bg-sky-400 px-8 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-sky-200/40 bg-white/80 backdrop-blur-sm p-6 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-4 w-4 text-sky-500" />
                <h3 className="text-sm font-semibold text-stone-800">Email</h3>
              </div>
              <a href="mailto:contact@revialife.com" className="text-sm text-sky-600 hover:text-sky-500 transition-colors">
                contact@revialife.com
              </a>
            </div>
            <div className="h-px bg-sky-200/30" />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-sky-500" />
                <h3 className="text-sm font-semibold text-stone-800">Business Hours</h3>
              </div>
              <ul className="space-y-1.5 text-sm">
                <li className="flex justify-between text-stone-500">
                  <span>Monday – Friday</span>
                  <span className="text-stone-700">9 AM – 6 PM EST</span>
                </li>
                <li className="flex justify-between text-stone-500">
                  <span>Saturday</span>
                  <span className="text-stone-700">10 AM – 2 PM EST</span>
                </li>
                <li className="flex justify-between text-stone-500">
                  <span>Sunday</span>
                  <span className="text-stone-700">Closed</span>
                </li>
              </ul>
            </div>
            <div className="h-px bg-sky-200/30" />
            <p className="text-xs text-stone-400 leading-relaxed">
              We typically respond within 24 hours during business days. For urgent order issues, include your order number in the message.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-200/40 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-stone-800 mb-4">Before You Reach Out</h3>
            <ul className="space-y-3">
              {[
                { href: "/faq", label: "FAQ", desc: "Common questions answered" },
                { href: "/policies/shipping", label: "Shipping Info", desc: "Rates, times, and tracking" },
                { href: "/policies/refunds", label: "Return Policy", desc: "Eligibility and refunds" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-sky-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-stone-700 group-hover:text-sky-600 transition-colors">{link.label}</p>
                      <p className="text-xs text-stone-400">{link.desc}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-sky-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
