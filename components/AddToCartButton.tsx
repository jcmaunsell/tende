"use client";

import { useCart } from "@/store/cart";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);

  if (!product.inStock) {
    return (
      <button disabled className="w-full py-4 border border-[var(--foreground)]/20 text-[var(--foreground)]/40 text-sm uppercase tracking-widest cursor-not-allowed">
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={() =>
        addItem({
          productId: product._id,
          title: product.title,
          price: product.price,
          image: product.images?.[0],
          stripePriceId: product.stripePriceId ?? "",
        })
      }
      className="w-full py-4 bg-[var(--wine)] text-white text-sm uppercase tracking-widest hover:bg-[var(--wine)]/90 transition-colors"
    >
      Add to Cart
    </button>
  );
}
