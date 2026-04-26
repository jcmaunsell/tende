import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import ProductAccordion from "./ProductAccordion";
import { getAllProducts, getProductBySlug } from "@/sanity/queries";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const description = product.tagline ?? product.description?.split("\n")[0];
  const image = product.images?.[0];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tende.care";

  return {
    title: `${product.title} — Tende`,
    description,
    openGraph: {
      title: product.title,
      description: description ?? undefined,
      url: `${siteUrl}/shop/${slug}`,
      siteName: "Tende",
      type: "website",
      ...(image ? { images: [{ url: image, alt: product.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: description ?? undefined,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Breadcrumb */}
      <nav className="text-xs font-sans text-[var(--muted)] mb-8 uppercase tracking-widest">
        <Link href="/shop" className="hover:text-[var(--teal)] transition-colors">Shop</Link>
        <span className="mx-2">›</span>
        <span>{product.title}</span>
      </nav>

      <ProductDetail product={product} />

      {/* Tagline banner */}
      <div className="mt-16 py-8 border-y border-[var(--parchment)]">
        <p className="font-display font-bold text-sm uppercase tracking-wide text-[var(--foreground)] leading-relaxed">
          Thoughtfully formulated without sulfates, parabens or artificial fragrances —{" "}
          from <em className="not-italic font-bold">garden to palm</em>.
        </p>
      </div>

      {/* Accordion: ingredients, how-to-use, full list */}
      <ProductAccordion product={product} />

    </div>
  );
}
