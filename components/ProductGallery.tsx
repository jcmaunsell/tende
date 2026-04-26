"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-[var(--cream)] flex items-center justify-center">
        <span className="font-display font-bold text-8xl text-[var(--muted)]">t</span>
      </div>
    );
  }

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <div className="flex gap-3">
      {/* Vertical thumbnail strip */}
      {images.length > 1 && (
        <div className="flex flex-col gap-2 w-[68px] shrink-0">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden transition-opacity ${
                i === active
                  ? "ring-1 ring-[var(--foreground)] opacity-100"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={src}
                alt={`${title} ${i + 1}`}
                width={68}
                height={68}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative flex-1">
        <div className="aspect-square bg-[var(--cream)] overflow-hidden">
          <Image
            src={images[active]}
            alt={title}
            width={800}
            height={800}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/70 hover:bg-white transition-colors text-[var(--foreground)]"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/70 hover:bg-white transition-colors text-[var(--foreground)]"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
