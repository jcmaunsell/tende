"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  title: string;
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
}

export default function ProductGallery({ images, title, activeIndex, onActiveChange }: Props) {
  const [internal, setInternal] = useState(0);
  const active = activeIndex ?? internal;
  const setActive = (i: number) => {
    setInternal(i);
    onActiveChange?.(i);
  };

  const mainRef = useRef<HTMLDivElement>(null);
  const [thumbMaxH, setThumbMaxH] = useState<number | undefined>();

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setThumbMaxH(el.offsetHeight));
    ro.observe(el);
    setThumbMaxH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-cream flex items-center justify-center">
        <span className="font-display font-bold text-8xl text-muted">t</span>
      </div>
    );
  }

  const prev = () => setActive((active - 1 + images.length) % images.length);
  const next = () => setActive((active + 1) % images.length);

  return (
    <div className="flex gap-3">
      {images.length > 1 && (
        <div
          className="flex flex-col gap-2 w-[68px] shrink-0 overflow-y-auto"
          style={thumbMaxH ? { maxHeight: thumbMaxH } : undefined}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden transition-opacity shrink-0 ${
                i === active
                  ? "ring-1 ring-foreground opacity-100"
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

      <div ref={mainRef} className="relative flex-1">
        <div className="aspect-square bg-cream overflow-hidden">
          <Image
            src={images[active]}
            alt={title}
            width={800}
            height={800}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/70 hover:bg-white transition-colors text-foreground"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/70 hover:bg-white transition-colors text-foreground"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
