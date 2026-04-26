"use client";

import { useState, useMemo } from "react";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/types";
import { formatPrice, priceRange } from "@/lib/utils";

export default function ProductDetail({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Merge product images + variant-specific images not already present
  const allImages = useMemo(() => {
    const base = product.images ?? [];
    const extras = (product.variants ?? [])
      .map((v) => v.image)
      .filter((img): img is string => !!img && !base.includes(img));
    return [...base, ...extras];
  }, [product]);

  function handleFragranceChange(fragranceId: string | null) {
    setSelectedId(fragranceId);
    if (!fragranceId) { setActiveIndex(0); return; }
    const variant = product.variants?.find((v) => v.fragrance._id === fragranceId);
    if (variant?.image) {
      const idx = allImages.indexOf(variant.image);
      if (idx >= 0) setActiveIndex(idx);
    }
  }

  const activeVariant = product.variants?.find((v) => v.fragrance._id === selectedId) ?? null;
  const displayPrice = activeVariant?.price ?? product.price;
  const displayCompareAt = activeVariant?.compareAtPrice ?? product.compareAtPrice;
  const hasVariants = (product.variants?.length ?? 0) > 0;

  const shortDesc = product.description?.split("\n")[0] ?? null;

  return (
    <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
      <ProductGallery
        images={allImages}
        title={product.title}
        activeIndex={activeIndex}
        onActiveChange={setActiveIndex}
      />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground uppercase leading-none mb-3">
            {product.title}
          </h1>
          <div className="flex items-baseline gap-3">
            <p className="font-display font-bold text-xl text-teal">
              {selectedId || !hasVariants ? formatPrice(displayPrice) : priceRange(product)}
            </p>
            {displayCompareAt && selectedId && (
              <p className="text-sm font-sans text-muted/50 line-through">
                {formatPrice(displayCompareAt)}
              </p>
            )}
          </div>
        </div>

        {shortDesc && (
          <p className="text-sm font-sans font-light leading-relaxed text-muted">
            {shortDesc}
          </p>
        )}

        <AddToCartButton product={product} onFragranceChange={handleFragranceChange} />

        {product.tagline && (
          <p className="text-xs font-sans uppercase tracking-widest text-muted">
            {product.tagline}
          </p>
        )}
      </div>
    </div>
  );
}
