"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Trash2, Loader2, Tag, Truck } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/constants";

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

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const subtotal = totalPrice();
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const finalTotal = Math.max(0, subtotal - couponDiscount) + shippingCost;

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
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50">
          <ShoppingBag className="h-8 w-8 text-sky-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-neutral-900">
          Thank you for your order!
        </h1>
        <p className="mt-2 text-neutral-500">
          Your order{" "}
          <span className="font-semibold text-sky-600">
            #{orderId.slice(-8).toUpperCase()}
          </span>{" "}
          has been received. We will send a confirmation to your email.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <ShoppingBag className="h-12 w-12 text-neutral-300" />
        <h1 className="mt-4 text-xl font-bold text-neutral-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Browse our catalog and add products to get started.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </section>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30";

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Checkout</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-5">
        {/* -- Form -- */}
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-3">
          <h2 className="text-lg font-semibold text-neutral-900">Shipping Information</h2>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
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
              <label className="mb-1 block text-xs font-medium text-neutral-500">
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
            <label className="mb-1 block text-xs font-medium text-neutral-500">
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
              <label className="mb-1 block text-xs font-medium text-neutral-500">
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
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                State
              </label>
              <input
                required
                type="text"
                placeholder="CA"
                value={form.state}
                onChange={update("state")}
                className={inputClass}
                disabled={submitting}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
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

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Place Order &mdash; ${(finalTotal / 100).toFixed(2)}</>
            )}
          </button>
        </form>

        {/* -- Cart Summary -- */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Order Summary</h2>

            <ul className="mt-4 divide-y divide-neutral-100">
              {items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {item.variantLabel} &times; {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-neutral-700">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-neutral-400 transition hover:text-red-500"
                      disabled={submitting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Coupon Code Section */}
            <div className="mt-4 border-t border-neutral-200 pt-4">
              <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                <Tag size={12} />
                Coupon Code
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-lg border border-sky-200 bg-sky-50 px-3 py-2">
                  <span className="text-sm font-mono text-stone-600">
                    {appliedCoupon}
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-neutral-400 hover:text-red-500 transition"
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
                    disabled={submitting || couponApplying || !couponCode.trim()}
                    className="shrink-0 rounded-lg bg-neutral-100 px-4 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-200 disabled:opacity-40"
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

            <div className="mt-4 border-t border-neutral-200 pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Subtotal</span>
                <span className="text-sm text-neutral-700">
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
                <span className="text-sm text-neutral-500">Shipping</span>
                <span className="text-sm text-neutral-700">
                  {shippingCost === 0 ? (
                    <span className="text-sky-600 font-medium">FREE</span>
                  ) : (
                    "$25.00"
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-xs text-stone-600">
                  <Truck className="h-3.5 w-3.5 shrink-0" />
                  Add ${((FREE_SHIPPING_THRESHOLD - subtotal) / 100).toFixed(2)} more for free shipping
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <span className="text-sm font-medium text-neutral-700">Total</span>
                <span className="text-lg font-bold text-neutral-900">
                  ${(finalTotal / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
