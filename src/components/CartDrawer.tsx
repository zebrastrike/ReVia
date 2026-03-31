"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/constants";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const addToast = useToastStore((s) => s.addToast);

  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-neutral-200 bg-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
                <ShoppingBag className="h-5 w-5 text-sky-600" />
                Cart
                {items.length > 0 && (
                  <span className="text-sm font-normal text-neutral-500">
                    ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShoppingBag className="h-12 w-12 text-neutral-300" />
                  <p className="mt-4 text-sm text-neutral-500">Your cart is empty</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.variantId}
                      className="flex gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4"
                    >
                      {/* Thumbnail placeholder */}
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-sky-50 to-sky-100">
                        <span className="text-lg font-bold text-sky-600/60">
                          {item.productName.charAt(0)}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-neutral-900">
                              {item.productName}
                            </p>
                            <p className="text-xs text-neutral-500">{item.variantLabel}</p>
                          </div>
                          <button
                            onClick={() => {
                              removeItem(item.variantId);
                              addToast("info", "Item removed from cart");
                            }}
                            className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-red-500"
                            aria-label={`Remove ${item.productName}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white">
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                              className="px-2 py-1 text-neutral-400 transition-colors hover:text-neutral-700"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-[1.5rem] text-center text-sm font-medium text-neutral-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1)
                              }
                              className="px-2 py-1 text-neutral-400 transition-colors hover:text-neutral-700"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-medium text-neutral-900">
                            ${((item.price * item.quantity) / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 px-6 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Subtotal</span>
                  <span className="text-sm text-neutral-700">
                    ${(totalPrice / 100).toFixed(2)}
                  </span>
                </div>

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
                    Add ${((FREE_SHIPPING_THRESHOLD - totalPrice) / 100).toFixed(2)} more for free shipping
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <span className="text-sm font-medium text-neutral-700">Total</span>
                  <span className="text-lg font-semibold text-neutral-900">
                    ${((totalPrice + shippingCost) / 100).toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full rounded-xl bg-sky-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-sky-500"
                >
                  Checkout
                </Link>

                <button
                  onClick={closeCart}
                  className="w-full rounded-xl border border-neutral-200 py-3 text-center text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-700"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
