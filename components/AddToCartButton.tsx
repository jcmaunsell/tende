"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const [qty, setQty] = useState(1);
  const [selectedFragrance, setSelectedFragrance] = useState<string | null>(
    hasVariants ? null : null
  );
  const addItem = useCart((s) => s.addItem);

  const activeVariant = hasVariants
    ? product.variants!.find((v) => v.fragrance === selectedFragrance)
    : null;

  const canAdd = !hasVariants || (activeVariant?.inStock ?? false);
  const isOutOfStock = hasVariants
    ? selectedFragrance !== null && !activeVariant?.inStock
    : !product.inStock;

  if (!hasVariants && !product.inStock) {
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
    if (!canAdd) return;
    const stripePriceId = hasVariants
      ? (activeVariant?.stripePriceId ?? "")
      : (product.stripePriceId ?? "");

    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
        stripePriceId,
        fragrance: selectedFragrance ?? undefined,
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Fragrance picker */}
      {hasVariants && (
        <div>
          <p className="text-xs font-sans uppercase tracking-widest text-[var(--muted)] mb-2">
            Fragrance
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants!.map((v) => {
              const selected = selectedFragrance === v.fragrance;
              return (
                <button
                  key={v.fragrance}
                  onClick={() => setSelectedFragrance(v.fragrance)}
                  disabled={!v.inStock}
                  className={[
                    "px-4 h-9 text-xs font-sans uppercase tracking-widest border transition-colors",
                    selected
                      ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                      : "border-[var(--foreground)]/30 text-[var(--foreground)] hover:border-[var(--foreground)]",
                    !v.inStock
                      ? "opacity-40 cursor-not-allowed line-through"
                      : "cursor-pointer",
                  ].join(" ")}
                >
                  {v.fragrance}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stepper + Add to Cart */}
      <div className="flex gap-2">
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

        <button
          onClick={handleAdd}
          disabled={isOutOfStock || (hasVariants && selectedFragrance === null)}
          className={[
            "flex-1 h-12 text-xs uppercase tracking-widest font-sans rounded-full transition-colors",
            isOutOfStock
              ? "border border-[var(--foreground)]/20 text-[var(--foreground)]/40 cursor-not-allowed"
              : hasVariants && selectedFragrance === null
              ? "bg-[var(--foreground)]/40 text-[var(--background)] cursor-not-allowed"
              : "bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--sage-dark)]",
          ].join(" ")}
        >
          {isOutOfStock
            ? "Out of Stock"
            : hasVariants && selectedFragrance === null
            ? "Select a Fragrance"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
