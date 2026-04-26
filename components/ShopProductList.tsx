"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product, Fragrance } from "@/types";

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Skincare", value: "skincare" },
  { label: "Hair Care", value: "hair" },
  { label: "Body Care", value: "body" },
  { label: "Scalp Care", value: "scalp" },
  { label: "Accessories", value: "accessories" },
  { label: "Merch", value: "merch" },
];

export default function ShopProductList({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFragranceId, setActiveFragranceId] = useState<string | null>(null);

  // Category-filtered products (before fragrance filter)
  const categoryFiltered = useMemo(
    () =>
      activeCategory === "all"
        ? products
        : products.filter((p) => p.category === activeCategory),
    [products, activeCategory]
  );

  // Unique fragrances in the active category, ordered by name
  const fragrances = useMemo<Fragrance[]>(() => {
    const seen = new Map<string, Fragrance>();
    categoryFiltered.forEach((p) =>
      p.variants?.forEach((v) => {
        if (!v.fragrance?._id || seen.has(v.fragrance._id)) return;
        seen.set(v.fragrance._id, v.fragrance);
      })
    );
    return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [categoryFiltered]);

  // Clear stale fragrance selection when category changes
  useEffect(() => {
    if (activeFragranceId && !fragrances.some((f) => f._id === activeFragranceId)) {
      setActiveFragranceId(null);
    }
  }, [fragrances, activeFragranceId]);

  const filtered = useMemo(
    () =>
      categoryFiltered.filter((p) => {
        if (!activeFragranceId) return true;
        return p.variants?.some((v) => v.fragrance?._id === activeFragranceId) ?? false;
      }),
    [categoryFiltered, activeFragranceId]
  );

  const activeCats = CATEGORIES.filter(
    (c) => c.value === "all" || products.some((p) => p.category === c.value)
  );

  function FilterBtn({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) {
    return (
      <button
        onClick={onClick}
        className={[
          "text-xs font-sans uppercase tracking-widest px-3 py-1.5 border transition-colors text-left",
          active
            ? "bg-foreground text-background border-foreground"
            : "border-foreground/30 text-foreground hover:border-foreground",
        ].join(" ")}
      >
        {children}
      </button>
    );
  }

  return (
    <>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {activeCats.map((c) => (
          <FilterBtn
            key={c.value}
            active={activeCategory === c.value}
            onClick={() => setActiveCategory(c.value)}
          >
            {c.label}
          </FilterBtn>
        ))}
      </div>

      {/* Fragrance filters */}
      {fragrances.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <FilterBtn active={activeFragranceId === null} onClick={() => setActiveFragranceId(null)}>
            Any Fragrance
          </FilterBtn>
          {fragrances.map((f) => (
            <FilterBtn
              key={f._id}
              active={activeFragranceId === f._id}
              onClick={() => setActiveFragranceId(activeFragranceId === f._id ? null : f._id)}
            >
              {f.name}
              {f.notes && (
                <span className="block normal-case tracking-normal font-light mt-0.5 text-white/80">
                  {f.notes}
                </span>
              )}
            </FilterBtn>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center py-24 text-muted/50 font-sans font-light">
          No products match those filters.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
