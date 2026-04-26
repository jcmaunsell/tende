import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
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

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Show only the first paragraph of description as the lede
  const shortDesc = product.description?.split("\n")[0] ?? null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Breadcrumb */}
      <nav className="text-xs font-sans text-[var(--muted)] mb-8 uppercase tracking-widest">
        <Link href="/shop" className="hover:text-[var(--teal)] transition-colors">Shop</Link>
        <span className="mx-2">›</span>
        <span>{product.title}</span>
      </nav>

      {/* Main grid */}
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

        {/* Left: image carousel */}
        <ProductGallery images={product.images ?? []} title={product.title} />

        {/* Right: product info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-[var(--foreground)] uppercase leading-none mb-3">
              {product.title}
            </h1>
            <p className="font-display font-bold text-xl text-[var(--teal)]">
              {product.compareAtPrice ? "From " : ""}{formatPrice(product.price)}
            </p>
            {product.compareAtPrice && (
              <p className="text-sm font-sans text-[var(--foreground)]/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            )}
          </div>

          {shortDesc && (
            <p className="text-sm font-sans font-light leading-relaxed text-[var(--foreground)]/70">
              {shortDesc}
            </p>
          )}

          <AddToCartButton product={product} />

          {product.tagline && (
            <p className="text-xs font-sans uppercase tracking-widest text-[var(--muted)]">
              {product.tagline}
            </p>
          )}
        </div>
      </div>

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
