"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import type { Product } from "@/types";
import { parseFragrance } from "@/lib/utils";

interface Props {
  product: Product;
  onFragranceChange?: (fragrance: string | null) => void;
}

export default function AddToCartButton({ product, onFragranceChange }: Props) {
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const [qty, setQty] = useState(1);
  const [selectedFragrance, setSelectedFragrance] = useState<string | null>(null);
  const addItem = useCart((s) => s.addItem);

  function selectFragrance(fragrance: string) {
    setSelectedFragrance(fragrance);
    onFragranceChange?.(fragrance);
  }

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
        className="w-full h-12 border border-foreground/20 text-foreground/40 text-xs uppercase tracking-widest font-sans cursor-not-allowed rounded-full"
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

    const price = activeVariant?.price ?? product.price;
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product._id,
        title: product.title,
        price,
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
          <p className="text-xs font-sans uppercase tracking-widest text-muted mb-2">
            Fragrance
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants!.map((v) => {
              const selected = selectedFragrance === v.fragrance;
              const { scentName, notes } = parseFragrance(v.fragrance);
              return (
                <button
                  key={v.fragrance}
                  onClick={() => selectFragrance(v.fragrance)}
                  disabled={!v.inStock}
                  className={[
                    "px-4 py-2 text-xs font-sans uppercase tracking-widest border transition-colors text-left",
                    selected
                      ? "bg-foreground text-background border-foreground"
                      : "border-foreground/30 text-foreground hover:border-foreground",
                    !v.inStock ? "opacity-40 cursor-not-allowed line-through" : "cursor-pointer",
                  ].join(" ")}
                >
                  {scentName}
                  {notes && (
                    <span className={[
                      "block text-[10px] normal-case tracking-normal font-light mt-0.5",
                      selected ? "text-background/70" : "text-muted",
                    ].join(" ")}>
                      {notes}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stepper + Add to Cart */}
      <div className="flex gap-2">
        <div className="flex items-center border border-foreground/20">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-12 text-lg font-sans hover:bg-cream transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-sans select-none">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-12 text-lg font-sans hover:bg-cream transition-colors"
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
              ? "border border-foreground/20 text-foreground/40 cursor-not-allowed"
              : hasVariants && selectedFragrance === null
              ? "bg-foreground/40 text-background cursor-not-allowed"
              : "bg-foreground text-background hover:bg-sage-dark",
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
