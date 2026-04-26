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
  return { title: `${product.title} — tende`, description: product.tagline };
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
      <div className="mt-16 py-8 border-y border-[var(--cream)]">
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
