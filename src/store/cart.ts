"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  variantId: string;
  productName: string;
  variantLabel: string;
  price: number;
  quantity: number;
  image?: string;
  slug: string;
  isPreOrder?: boolean;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item, quantity = 1) => {
        const qty = Math.max(1, Math.floor(quantity));
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...items, { ...item, quantity: qty }], isOpen: true });
        }
      },
      removeItem: (variantId) =>
        set({ items: get().items.filter((i) => i.variantId !== variantId) }),
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.variantId !== variantId) });
        } else {
          set({
            items: get().items.map((i) =>
              i.variantId === variantId ? { ...i, quantity } : i
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "revia-cart" }
  )
);
