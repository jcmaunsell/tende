"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import type { Product } from "@/types";

interface Props {
  product: Product;
  onFragranceChange?: (fragranceId: string | null) => void;
}

export default function AddToCartButton({ product, onFragranceChange }: Props) {
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const [qty, setQty] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fragranceOpen, setFragranceOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);

  function selectFragrance(id: string) {
    setSelectedId(id);
    setFragranceOpen(false);
    onFragranceChange?.(id);
  }

  const activeVariant = hasVariants
    ? product.variants!.find((v) => v.fragrance._id === selectedId)
    : null;

  const canAdd = !hasVariants || (activeVariant?.inStock ?? false);
  const isOutOfStock = hasVariants
    ? selectedId !== null && !activeVariant?.inStock
    : !product.inStock;

  if (!hasVariants && !product.inStock) {
    return (
      <button
        disabled
        className="w-full h-12 border border-foreground/20 text-muted/50 text-xs uppercase tracking-widest font-sans cursor-not-allowed rounded-full"
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
    const fragranceName = activeVariant
      ? activeVariant.fragrance.name + (activeVariant.fragrance.notes ? ` | ${activeVariant.fragrance.notes}` : "")
      : undefined;

    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product._id,
        title: product.title,
        price,
        image: product.images?.[0],
        stripePriceId,
        fragrance: fragranceName,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Fragrance picker */}
      {hasVariants && (
        <div>
          {/* Mobile toggle — hidden on md+ */}
          <button
            type="button"
            onClick={() => setFragranceOpen((o) => !o)}
            className="md:hidden w-full flex items-center justify-between border border-foreground/30 px-4 py-3 text-xs font-sans uppercase tracking-widest text-foreground"
          >
            <span>
              {activeVariant ? (
                <>
                  <span className="normal-case font-normal">{activeVariant.fragrance.name}</span>
                  {activeVariant.fragrance.notes && (
                    <span className="ml-1 text-muted font-light normal-case tracking-normal">
                      — {activeVariant.fragrance.notes}
                    </span>
                  )}
                </>
              ) : (
                "Select fragrance"
              )}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
              className={`flex-shrink-0 transition-transform ${fragranceOpen ? "rotate-180" : ""}`}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Desktop label — hidden on mobile */}
          <p className="hidden md:block text-xs font-sans uppercase tracking-widest text-muted mb-2">
            Fragrance
          </p>

          {/* Variant buttons — collapsible on mobile, always visible on md+ */}
          <div className={[
            "flex-wrap gap-2 mt-1 md:mt-0",
            fragranceOpen ? "flex" : "hidden",
            "md:flex",
          ].join(" ")}>
            {product.variants!.map((v) => {
              const selected = selectedId === v.fragrance._id;
              return (
                <button
                  key={v.fragrance._id}
                  onClick={() => selectFragrance(v.fragrance._id)}
                  disabled={!v.inStock}
                  className={[
                    "px-4 py-2 text-xs font-sans uppercase tracking-widest border transition-colors text-left",
                    selected
                      ? "bg-foreground text-background border-foreground"
                      : "border-foreground/30 text-foreground hover:border-foreground",
                    !v.inStock ? "opacity-40 cursor-not-allowed line-through" : "cursor-pointer",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    {v.fragrance.name}
                    {v.compareAtPrice && (
                      <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-teal text-white rounded-sm font-sans normal-case">
                        Sale
                      </span>
                    )}
                  </span>
                  {v.fragrance.notes && (
                    <span className="block text-[10px] normal-case tracking-normal font-light mt-0.5 text-muted">
                      {v.fragrance.notes}
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
            className="w-10 h-12 text-lg font-sans hover:bg-parchment transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-sans select-none">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-12 text-lg font-sans hover:bg-parchment transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={isOutOfStock || (hasVariants && selectedId === null)}
          className={[
            "flex-1 h-12 text-xs uppercase tracking-widest font-sans rounded-full transition-colors",
            isOutOfStock
              ? "border border-foreground/20 text-muted/50 cursor-not-allowed"
              : hasVariants && selectedId === null
              ? "bg-foreground/40 text-background cursor-not-allowed"
              : added
              ? "bg-teal text-white"
              : "bg-foreground text-background hover:bg-petrol",
          ].join(" ")}
        >
          {isOutOfStock
            ? "Out of Stock"
            : hasVariants && selectedId === null
            ? "Select a Fragrance"
            : added
            ? "Added to Cart"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
