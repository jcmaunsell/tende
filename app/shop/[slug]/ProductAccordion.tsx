"use client";

import { useState } from "react";
import type { Product } from "@/types";

export default function ProductAccordion({ product }: { product: Product }) {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (key: string) => setOpen(open === key ? null : key);

  const sections = [
    product.ingredients?.length && {
      key: "featured",
      title: "Featured Ingredients",
      body: (
        <ul className="space-y-4">
          {product.ingredients.map((ing, i) => {
            const sep = ing.indexOf(" — ");
            const name = sep !== -1 ? ing.slice(0, sep) : ing;
            const detail = sep !== -1 ? ing.slice(sep + 3) : null;
            return (
              <li key={i}>
                <span className="font-display font-bold text-xs uppercase tracking-wide">{name}</span>
                {detail && (
                  <span className="block text-sm font-sans font-light text-[var(--foreground)]/70 mt-0.5 leading-relaxed">
                    {detail}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ),
    },
    product.howToUse && {
      key: "howToUse",
      title: "How to Use + Care",
      body: (
        <p className="text-sm font-sans font-light leading-relaxed text-[var(--foreground)]/80 whitespace-pre-line">
          {product.howToUse}
        </p>
      ),
    },
    product.ingredients?.length && {
      key: "fullList",
      title: "Full Ingredient List",
      body: (
        <p className="text-sm font-sans font-light leading-relaxed text-[var(--foreground)]/70">
          {product.ingredients.map((ing) => ing.split(" — ")[0]).join(", ")}
        </p>
      ),
    },
  ].filter(Boolean) as { key: string; title: string; body: React.ReactNode }[];

  if (!sections.length) return null;

  return (
    <div className="mt-12">
      {sections.map(({ key, title, body }) => (
        <div key={key} className="border-t border-[var(--cream)]">
          <button
            onClick={() => toggle(key)}
            className="w-full flex items-center justify-between py-5 text-left group"
          >
            <span className="font-display font-bold text-xs uppercase tracking-wider group-hover:text-[var(--teal)] transition-colors">
              {title}
            </span>
            <span className="text-xl text-[var(--muted)] leading-none">
              {open === key ? "−" : "+"}
            </span>
          </button>
          {open === key && <div className="pb-8">{body}</div>}
        </div>
      ))}
      <div className="border-t border-[var(--cream)]" />
    </div>
  );
}
