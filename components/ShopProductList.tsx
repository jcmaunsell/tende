"use client";

import { useState, useMemo } from "react";
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

export default function ShopProductList({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFragrance, setActiveFragrance] = useState<string | null>(null);

  const fragrances = useMemo(() => {
    const names = new Set<string>();
    products.forEach((p) =>
      p.variants?.forEach((v) => names.add(parseFragrance(v.fragrance).scentName))
    );
    return Array.from(names).sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (activeFragrance) {
        if (!p.variants?.some((v) => parseFragrance(v.fragrance).scentName === activeFragrance))
          return false;
      }
      return true;
    });
  }, [products, activeCategory, activeFragrance]);

  const activeCats = CATEGORIES.filter(
    (c) => c.value === "all" || products.some((p) => p.category === c.value)
  );

  function FilterBtn({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        className={[
          "text-xs font-sans uppercase tracking-widest px-3 py-1.5 border transition-colors",
          active
            ? "bg-foreground text-background border-foreground"
            : "border-foreground/30 text-foreground hover:border-foreground",
        ].join(" ")}
      >
        {label}
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
            label={c.label}
            active={activeCategory === c.value}
            onClick={() => setActiveCategory(c.value)}
          />
        ))}
      </div>

      {/* Fragrance filters */}
      {fragrances.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <FilterBtn
            label="Any Fragrance"
            active={activeFragrance === null}
            onClick={() => setActiveFragrance(null)}
          />
          {fragrances.map((f) => (
            <FilterBtn
              key={f}
              label={f}
              active={activeFragrance === f}
              onClick={() => setActiveFragrance(activeFragrance === f ? null : f)}
            />
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
