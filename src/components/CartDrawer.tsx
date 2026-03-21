"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const addToast = useToastStore((s) => s.addToast);

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
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0a0a0a]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-100">
                <ShoppingBag className="h-5 w-5 text-emerald-500" />
                Cart
                {items.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">
                    ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-700" />
                  <p className="mt-4 text-sm text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.variantId}
                      className="flex gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
                    >
                      {/* Thumbnail placeholder */}
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-900/40 to-emerald-700/20">
                        <span className="text-lg font-bold text-emerald-500/60">
                          {item.productName.charAt(0)}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-200">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">{item.variantLabel}</p>
                          </div>
                          <button
                            onClick={() => {
                              removeItem(item.variantId);
                              addToast("info", "Item removed from cart");
                            }}
                            className="rounded p-1 text-gray-600 transition-colors hover:bg-white/10 hover:text-red-400"
                            aria-label={`Remove ${item.productName}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5">
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                              className="px-2 py-1 text-gray-400 transition-colors hover:text-gray-200"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-[1.5rem] text-center text-sm font-medium text-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1)
                              }
                              className="px-2 py-1 text-gray-400 transition-colors hover:text-gray-200"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-medium text-emerald-400">
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
              <div className="border-t border-white/10 px-6 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Subtotal</span>
                  <span className="text-lg font-semibold text-gray-100">
                    ${(totalPrice / 100).toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full rounded-xl bg-emerald-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
                >
                  Checkout
                </Link>

                <button
                  onClick={closeCart}
                  className="w-full rounded-xl border border-white/10 py-3 text-center text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-gray-200"
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
