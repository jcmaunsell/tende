"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);

  if (!product.inStock) {
    return (
      <button
        disabled
        className="w-full h-12 border border-[var(--foreground)]/20 text-[var(--foreground)]/40 text-xs uppercase tracking-widest font-sans cursor-not-allowed rounded-full"
      >
        Out of Stock
      </button>
    );
  }

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
        stripePriceId: product.stripePriceId ?? "",
      });
    }
  }

  return (
    <div className="flex gap-2">
      {/* Quantity stepper */}
      <div className="flex items-center border border-[var(--foreground)]/20">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-10 h-12 text-lg font-sans hover:bg-[var(--cream)] transition-colors"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-sans select-none">{qty}</span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="w-10 h-12 text-lg font-sans hover:bg-[var(--cream)] transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        className="flex-1 h-12 bg-[var(--foreground)] text-[var(--background)] text-xs uppercase tracking-widest font-sans rounded-full hover:bg-[var(--sage-dark)] transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}
