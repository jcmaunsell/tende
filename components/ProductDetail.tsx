"use client";

import { useState } from "react";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/types";

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function ProductDetail({ product }: { product: Product }) {
  const images = product.images ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  function handleFragranceChange(fragrance: string | null) {
    if (!fragrance) { setActiveIndex(0); return; }
    const variant = product.variants?.find((v) => v.fragrance === fragrance);
    if (variant?.image) {
      const idx = images.indexOf(variant.image);
      if (idx >= 0) setActiveIndex(idx);
    }
  }

  const shortDesc = product.description?.split("\n")[0] ?? null;

  return (
    <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
      {/* Left: image carousel */}
      <ProductGallery
        images={images}
        title={product.title}
        activeIndex={activeIndex}
        onActiveChange={setActiveIndex}
      />

      {/* Right: product info */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-[var(--foreground)] uppercase leading-none mb-3">
            {product.title}
          </h1>
          <p className="font-display font-bold text-xl text-[var(--teal)]">
            {product.compareAtPrice ? "From " : ""}{formatPrice(product.price)}
          </p>
          {product.compareAtPrice && (
            <p className="text-sm font-sans text-[var(--foreground)]/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </p>
          )}
        </div>

        {shortDesc && (
          <p className="text-sm font-sans font-light leading-relaxed text-[var(--foreground)]/70">
            {shortDesc}
          </p>
        )}

        <AddToCartButton product={product} onFragranceChange={handleFragranceChange} />

        {product.tagline && (
          <p className="text-xs font-sans uppercase tracking-widest text-[var(--muted)]">
            {product.tagline}
          </p>
        )}
      </div>
    </div>
  );
}
