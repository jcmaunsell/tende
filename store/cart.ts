"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

function sameItem(a: CartItem, b: Omit<CartItem, "quantity">) {
  return a.productId === b.productId && (a.fragrance ?? "") === (b.fragrance ?? "");
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, fragrance?: string) => void;
  updateQuantity: (productId: string, quantity: number, fragrance?: string) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => sameItem(i, item));
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameItem(i, item) ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (productId, fragrance) =>
        set((state) => ({
          items: state.items.filter((i) => !sameItem(i, { productId, fragrance } as Omit<CartItem, "quantity">)),
        })),
      updateQuantity: (productId, quantity, fragrance) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => !sameItem(i, { productId, fragrance } as Omit<CartItem, "quantity">))
              : state.items.map((i) =>
                  sameItem(i, { productId, fragrance } as Omit<CartItem, "quantity">) ? { ...i, quantity } : i
                ),
        })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "tende-cart" }
  )
);
