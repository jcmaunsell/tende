import type { Metadata } from "next";
import { getSiteSettings } from "@/sanity/queries";
import GalleryGrid from "@/components/GalleryGrid";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery — Tende",
  description: "Moments from our process, products, and the spaces where they're shared.",
};

export default async function GalleryPage() {
  const settings = await getSiteSettings();
  const images = settings?.galleryImages ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-muted mb-2 font-sans">tende</p>
        <h1 className="font-display font-bold text-4xl uppercase text-foreground">Gallery</h1>
      </div>

      {images.length === 0 ? (
        <p className="text-sm font-sans text-muted">No images yet — add some in Sanity Studio under Site Settings → Gallery.</p>
      ) : (
        <GalleryGrid images={images} />
      )}
    </div>
  );
}
