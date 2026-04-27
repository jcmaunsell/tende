"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  image: string;
  alt?: string;
}

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-3">
        {images.map((item, i) => (
          <button
            key={i}
            onClick={() => setLightbox(item)}
            className="block w-full mb-2 md:mb-3 break-inside-avoid overflow-hidden group focus:outline-none"
          >
            <Image
              src={item.image}
              alt={item.alt ?? ""}
              width={600}
              height={900}
              className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-90"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4 md:p-10"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-5 text-white/70 hover:text-white text-2xl leading-none focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>
          <div
            className="relative max-w-4xl max-h-full w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.image}
              alt={lightbox.alt ?? ""}
              width={1200}
              height={1600}
              className="w-full h-auto max-h-[90vh] object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
