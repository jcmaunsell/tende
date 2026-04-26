"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";
import { parseFragrance } from "@/lib/utils";

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Skincare", value: "skincare" },
  { label: "Hair Care", value: "hair" },
  { label: "Body Care", value: "body" },
  { label: "Scalp Care", value: "scalp" },
  { label: "Accessories", value: "accessories" },
  { label: "Merch", value: "merch" },
];

interface FragranceOption {
  raw: string;
  scentName: string;
  notes: string | null;
}

export default function ShopProductList({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFragrance, setActiveFragrance] = useState<string | null>(null);

  // Category-filtered products (before fragrance filter)
  const categoryFiltered = useMemo(
    () =>
      activeCategory === "all"
        ? products
        : products.filter((p) => p.category === activeCategory),
    [products, activeCategory]
  );

  // Fragrance options derived from category-filtered products so chips never dead-end
  const fragrances = useMemo<FragranceOption[]>(() => {
    const seen = new Map<string, FragranceOption>();
    categoryFiltered.forEach((p) =>
      p.variants?.forEach((v) => {
        if (!v.fragrance || seen.has(v.fragrance)) return;
        seen.set(v.fragrance, { raw: v.fragrance, ...parseFragrance(v.fragrance) });
      })
    );
    return Array.from(seen.values()).sort((a, b) => a.scentName.localeCompare(b.scentName));
  }, [categoryFiltered]);

  // Clear stale fragrance selection when switching categories
  useEffect(() => {
    if (activeFragrance && !fragrances.some((f) => f.raw === activeFragrance)) {
      setActiveFragrance(null);
    }
  }, [fragrances, activeFragrance]);

  const filtered = useMemo(
    () =>
      categoryFiltered.filter((p) => {
        if (!activeFragrance) return true;
        return p.variants?.some((v) => v.fragrance === activeFragrance) ?? false;
      }),
    [categoryFiltered, activeFragrance]
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

      {/* Fragrance filters — only fragrances available in the active category */}
      {fragrances.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <FilterBtn active={activeFragrance === null} onClick={() => setActiveFragrance(null)}>
            Any Fragrance
          </FilterBtn>
          {fragrances.map((f) => (
            <FilterBtn
              key={f.raw}
              active={activeFragrance === f.raw}
              onClick={() => setActiveFragrance(activeFragrance === f.raw ? null : f.raw)}
            >
              {f.scentName}
              {f.notes && (
                <span className="block normal-case tracking-normal font-light mt-0.5 opacity-70">
                  {f.notes}
                </span>
              )}
            </FilterBtn>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center py-24 text-foreground/40 font-sans font-light">
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
