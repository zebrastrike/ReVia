"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Loader2,
  Tag,
  Truck,
  PartyPopper,
  ShieldCheck,
  Lock,
  BadgeCheck,
  FlaskConical,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/constants";
import { calculateTax, getTaxRate } from "@/lib/tax";
import FloatingOrbs from "@/components/FloatingOrbs";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);
  const removeItem = useCartStore((s) => s.removeItem);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Dynamic free shipping threshold
  const [threshold, setThreshold] = useState(FREE_SHIPPING_THRESHOLD);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.freeShippingThreshold)
          setThreshold(data.freeShippingThreshold);
      })
      .catch(() => {});
  }, []);

  const update =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const subtotal = totalPrice();
  const shippingCost = subtotal >= threshold ? 0 : SHIPPING_COST;
  const afterDiscount = Math.max(0, subtotal - couponDiscount);
  const taxAmount = calculateTax(form.state, afterDiscount);
  const taxRate = getTaxRate(form.state);
  const finalTotal = afterDiscount + shippingCost + taxAmount;
  const progress = Math.min((subtotal / threshold) * 100, 100);
  const remaining = threshold - subtotal;
  const qualifies = subtotal >= threshold;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponApplying(true);
    setCouponMessage(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });

      const data = await res.json();

      if (data.valid) {
        setCouponDiscount(data.discount);
        setAppliedCoupon(couponCode.trim().toUpperCase());
        setCouponMessage({ type: "success", text: data.message });
      } else {
        setCouponDiscount(0);
        setAppliedCoupon(null);
        setCouponMessage({ type: "error", text: data.message });
      }
    } catch {
      setCouponMessage({ type: "error", text: "Failed to validate coupon" });
    } finally {
      setCouponApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setAppliedCoupon(null);
    setCouponMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            variantId: i.variantId,
            productName: i.productName,
            variantLabel: i.variantLabel,
            price: i.price,
            quantity: i.quantity,
          })),
          shipping: {
            name: form.name,
            email: form.email,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
          },
          couponCode: appliedCoupon || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      setOrderId(data.order.id);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <section className="relative mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <FloatingOrbs />
        <div className="relative z-10">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-sky-100">
            <ShoppingBag className="h-8 w-8 text-sky-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-stone-900">
            Thank you for your order!
          </h1>
          <p className="mt-2 text-stone-500">
            Your order{" "}
            <span className="font-semibold text-sky-600">
              #{orderId.slice(-8).toUpperCase()}
            </span>{" "}
            has been received. We will send a confirmation to your email.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-xl bg-sky-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="relative mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <FloatingOrbs />
        <div className="relative z-10">
          <ShoppingBag className="mx-auto h-12 w-12 text-stone-300" />
          <h1 className="mt-4 text-xl font-bold text-stone-900">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Browse our catalog and add products to get started.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
        </div>
      </section>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-sky-200/60 bg-sky-50/30 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 focus:bg-white";

  return (
    <section className="relative mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:px-16">
      <FloatingOrbs />

      <div className="relative z-10">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Checkout
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-5">
          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 lg:col-span-3"
          >
            <div className="rounded-2xl border border-sky-200/40 bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-semibold text-stone-900">
                Shipping Information
              </h2>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={update("name")}
                    className={inputClass}
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={update("email")}
                    className={inputClass}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-500">
                  Address
                </label>
                <input
                  required
                  type="text"
                  placeholder="123 Research Blvd"
                  value={form.address}
                  onChange={update("address")}
                  className={inputClass}
                  disabled={submitting}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">
                    City
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="San Diego"
                    value={form.city}
                    onChange={update("city")}
                    className={inputClass}
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">
                    State
                  </label>
                  <select
                    required
                    value={form.state}
                    onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
                    className={inputClass}
                    disabled={submitting}
                  >
                    <option value="">Select</option>
                    {["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">
                    ZIP Code
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="92101"
                    value={form.zip}
                    onChange={update("zip")}
                    className={inputClass}
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>

            {/* RUO Agreement Checkbox */}
            <div className="rounded-2xl border border-sky-200/40 bg-sky-50/40 p-5 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  disabled={submitting}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-sky-300 text-sky-500 accent-sky-500 cursor-pointer"
                />
                <span className="text-xs leading-relaxed text-stone-600">
                  I confirm that I am a qualified researcher and that all products
                  purchased are for <strong className="text-stone-700">laboratory research use only</strong>.
                  I understand that these products are not intended for human or
                  animal consumption, or for use in the diagnosis, treatment, cure,
                  or prevention of any disease. I agree to the{" "}
                  <a href="/policies/terms" target="_blank" className="text-sky-600 hover:text-sky-500 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/policies/aup" target="_blank" className="text-sky-600 hover:text-sky-500 underline">
                    Acceptable Use Policy
                  </a>.
                </span>
              </label>
            </div>

            {/* Place Order button */}
            <button
              type="submit"
              disabled={submitting || !agreedToTerms}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 px-6 py-4 text-base font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60 shadow-md shadow-sky-400/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Place Order &mdash; ${(finalTotal / 100).toFixed(2)}
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
              {[
                { icon: Lock, label: "Secure Checkout" },
                { icon: BadgeCheck, label: "cGMP Certified" },
                { icon: FlaskConical, label: ">99% Purity" },
                { icon: ShieldCheck, label: "Quality Guaranteed" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 text-xs text-stone-400"
                >
                  <badge.icon className="h-3.5 w-3.5 text-sky-500/70" />
                  {badge.label}
                </div>
              ))}
            </div>
          </form>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="rounded-2xl border border-sky-200/40 bg-white/90 backdrop-blur-sm p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-stone-900">
                  Order Summary
                </h2>

                <ul className="mt-4 divide-y divide-sky-100">
                  {items.map((item) => (
                    <li
                      key={item.variantId}
                      className="flex items-start justify-between gap-3 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-stone-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-stone-500">
                          {item.variantLabel} &times; {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-stone-700">
                          ${((item.price * item.quantity) / 100).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-stone-400 transition hover:text-red-500"
                          disabled={submitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Coupon Code Section */}
                <div className="mt-4 border-t border-sky-100 pt-4">
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-stone-500">
                    <Tag size={12} />
                    Coupon Code
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-xl border border-sky-200 bg-sky-50 px-3 py-2">
                      <span className="text-sm font-mono text-stone-600">
                        {appliedCoupon}
                      </span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-stone-400 hover:text-red-500 transition"
                        disabled={submitting}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        className={`${inputClass} flex-1`}
                        disabled={submitting || couponApplying}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={
                          submitting || couponApplying || !couponCode.trim()
                        }
                        className="shrink-0 rounded-xl bg-sky-50 border border-sky-200/50 px-4 py-2 text-xs font-medium text-stone-700 transition hover:bg-sky-100 disabled:opacity-40"
                      >
                        {couponApplying ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>
                  )}
                  {couponMessage && (
                    <p
                      className={`mt-2 text-xs ${
                        couponMessage.type === "success"
                          ? "text-sky-600"
                          : "text-red-500"
                      }`}
                    >
                      {couponMessage.text}
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="mt-4 border-t border-sky-100 pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-500">Subtotal</span>
                    <span className="text-sm text-stone-700">
                      ${(subtotal / 100).toFixed(2)}
                    </span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-sky-600">Discount</span>
                      <span className="text-sm text-sky-600">
                        -${(couponDiscount / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-500">Shipping</span>
                    <span className="text-sm text-stone-700">
                      {shippingCost === 0 ? (
                        <span className="text-sky-600 font-medium">FREE</span>
                      ) : (
                        `$${(SHIPPING_COST / 100).toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-500">
                      Tax{form.state ? ` (${form.state.toUpperCase()} ${taxRate > 0 ? taxRate.toFixed(2) + "%" : ""})` : ""}
                    </span>
                    <span className="text-sm text-stone-700">
                      {!form.state ? (
                        <span className="text-stone-400 text-xs">Enter state</span>
                      ) : taxAmount === 0 ? (
                        <span className="text-sky-600 font-medium">$0.00</span>
                      ) : (
                        `$${(taxAmount / 100).toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-sky-100">
                    <span className="text-sm font-semibold text-stone-700">
                      Total
                    </span>
                    <span className="text-xl font-bold text-stone-900">
                      ${(finalTotal / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Free shipping progress bar */}
              <div className="rounded-2xl border border-sky-200/40 bg-white/90 backdrop-blur-sm p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {qualifies ? (
                      <PartyPopper className="h-3.5 w-3.5 text-sky-600" />
                    ) : (
                      <Truck className="h-3.5 w-3.5 text-sky-500" />
                    )}
                    <span className="text-xs font-medium text-stone-700">
                      {qualifies
                        ? "You've unlocked free shipping!"
                        : `$${(remaining / 100).toFixed(2)} away from free shipping`}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-stone-400">
                    ${(threshold / 100).toFixed(0)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-sky-200/50 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
