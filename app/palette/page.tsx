"use client";

import { useState } from "react";

const SWATCHES = [
  { label: "background", var: "--background", cls: "bg-background" },
  { label: "foreground", var: "--foreground", cls: "bg-foreground" },
  { label: "sage", var: "--sage", cls: "bg-sage" },
  { label: "petrol", var: "--petrol", cls: "bg-petrol" },
  { label: "teal", var: "--teal", cls: "bg-teal" },
  { label: "parchment", var: "--parchment", cls: "bg-parchment" },
  { label: "muted", var: "--muted", cls: "bg-muted" },
];

const CSS_VARS = [
  { label: "background", key: "--background" },
  { label: "foreground", key: "--foreground" },
  { label: "sage", key: "--sage" },
  { label: "petrol", key: "--petrol" },
  { label: "teal", key: "--teal" },
  { label: "parchment", key: "--parchment" },
  { label: "muted", key: "--muted" },
];

export default function PalettePage() {
  const [values, setValues] = useState<Record<string, string>>({});

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    document.documentElement.style.setProperty(key, value);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 font-sans">
      <p className="text-xs uppercase tracking-[0.3em] text-muted mb-2">internal tool</p>
      <h1 className="font-display font-bold text-4xl uppercase text-foreground mb-2">Color Palette</h1>
      <p className="text-sm text-muted mb-12">
        Adjust colors live on this page. When you find something you like, share the hex values with James to lock them in.
      </p>

      {/* Color editors */}
      <section className="mb-16">
        <h2 className="font-display font-bold text-sm uppercase tracking-widest text-foreground mb-6">Edit Colors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CSS_VARS.map(({ label, key }) => (
            <label key={key} className="flex items-center gap-3">
              <input
                type="color"
                defaultValue={(() => {
                  if (typeof window !== "undefined") {
                    return getComputedStyle(document.documentElement).getPropertyValue(key).trim() || "#000000";
                  }
                  return "#000000";
                })()}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-foreground/20 bg-transparent p-0.5"
              />
              <div>
                <p className="text-xs uppercase tracking-widest text-foreground">{label}</p>
                <p className="text-xs text-muted font-mono">{key}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Swatches */}
      <section className="mb-16">
        <h2 className="font-display font-bold text-sm uppercase tracking-widest text-foreground mb-6">Swatches</h2>
        <div className="flex flex-wrap gap-4">
          {SWATCHES.map(({ label, cls }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className={`w-16 h-16 border border-foreground/20 ${cls}`} />
              <p className="text-xs text-muted font-mono">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="mb-16">
        <h2 className="font-display font-bold text-sm uppercase tracking-widest text-foreground mb-6">Typography</h2>
        <div className="space-y-4 border-t border-foreground/10 pt-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">eyebrow label</p>
          <h3 className="font-display font-bold text-3xl uppercase text-foreground">Display heading</h3>
          <p className="text-base font-light leading-relaxed text-foreground">
            Primary body text — plant-based hair and body care made with intention.
          </p>
          <p className="text-sm font-light leading-relaxed text-muted">
            Muted / secondary text — scent notes, taglines, descriptions.
          </p>
          <p className="text-sm text-teal font-sans">$22 · teal price color</p>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-16">
        <h2 className="font-display font-bold text-sm uppercase tracking-widest text-foreground mb-6">Buttons & Chips</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <button className="px-6 h-12 bg-foreground text-background text-xs uppercase tracking-widest font-sans hover:bg-petrol transition-colors rounded-full">
            Add to Cart
          </button>
          <button className="px-6 h-12 border border-foreground/20 text-muted text-xs uppercase tracking-widest font-sans cursor-not-allowed rounded-full">
            Out of Stock
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Hair Care", "Body Care", "Scalp Care"].map((label) => (
            <button key={label} className="text-xs font-sans uppercase tracking-widest px-3 py-1.5 border border-foreground/30 text-foreground hover:border-foreground transition-colors">
              {label}
            </button>
          ))}
          <button className="text-xs font-sans uppercase tracking-widest px-3 py-1.5 border bg-foreground text-background border-foreground">
            Active
          </button>
        </div>
      </section>

      {/* Product card sample */}
      <section className="mb-16">
        <h2 className="font-display font-bold text-sm uppercase tracking-widest text-foreground mb-6">Product Card</h2>
        <div className="w-48">
          <div className="relative aspect-square bg-parchment mb-4 flex items-center justify-center">
            <span className="font-display font-bold text-6xl text-muted">t</span>
            <span className="absolute top-2 right-2 bg-teal text-white text-[10px] uppercase tracking-widest font-sans px-2 py-1">
              Sale
            </span>
          </div>
          <p className="text-xs uppercase tracking-widest text-muted mb-1">hair care</p>
          <p className="font-display font-bold text-base text-foreground uppercase mb-1">Shampoo Bar</p>
          <p className="text-sm font-light text-muted mb-2">A rich, nourishing lather.</p>
          <p className="text-sm text-teal">$18–$22</p>
        </div>
      </section>

      {/* Fragrance chip sample */}
      <section className="mb-16">
        <h2 className="font-display font-bold text-sm uppercase tracking-widest text-foreground mb-6">Fragrance Chips</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { name: "Mountain Resin", notes: "Amyris & Cedarwood" },
            { name: "Simplicity", notes: "Unscented" },
          ].map((f) => (
            <button key={f.name} className="text-xs font-sans uppercase tracking-widest px-3 py-1.5 border border-foreground/30 text-foreground hover:border-foreground transition-colors text-left">
              {f.name}
              <span className="block normal-case tracking-normal font-light mt-0.5 text-muted">
                {f.notes}
              </span>
            </button>
          ))}
          <button className="text-xs font-sans uppercase tracking-widest px-3 py-1.5 border bg-foreground text-background border-foreground text-left">
            Frosted Bloom
            <span className="block normal-case tracking-normal font-light mt-0.5 text-muted">
              Jasmine & Winter Citrus
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
