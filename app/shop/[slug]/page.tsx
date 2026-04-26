import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-16">
        {/* Images */}
        <div className="space-y-4">
          {product.images && product.images.length > 0 ? (
            product.images.map((src, i) => (
              <div key={i} className="aspect-square bg-[var(--cream)] overflow-hidden">
                <Image src={src} alt={product.title} width={800} height={800} className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            <div className="aspect-square bg-[var(--cream)] flex items-center justify-center">
              <span className="font-display text-8xl text-[var(--muted)]">t</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="py-4">
          <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">{product.category}</p>
          <h1 className="font-display text-4xl md:text-5xl text-[var(--foreground)] mb-3">{product.title}</h1>
          {product.tagline && <p className="text-base font-light text-[var(--foreground)]/60 mb-6">{product.tagline}</p>}

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-xl text-[var(--wine)]">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm line-through text-[var(--foreground)]/40">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          <AddToCartButton product={product} />

          {product.description && (
            <div className="mt-10">
              <h2 className="font-display text-xl mb-3">Description</h2>
              <p className="text-sm font-light leading-relaxed text-[var(--foreground)]/80">{product.description}</p>
            </div>
          )}

          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-xl mb-3">Ingredients</h2>
              <p className="text-sm font-light leading-relaxed text-[var(--foreground)]/70">
                {product.ingredients.join(", ")}
              </p>
            </div>
          )}

          {product.howToUse && (
            <div className="mt-8">
              <h2 className="font-display text-xl mb-3">How to Use</h2>
              <p className="text-sm font-light leading-relaxed text-[var(--foreground)]/80">{product.howToUse}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
