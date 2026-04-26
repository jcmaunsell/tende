import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function ProductCard({ product }: { product: Product }) {
  const slug = typeof product.slug === "string" ? product.slug : product.slug.current;

  return (
    <Link href={`/shop/${slug}`} className="group block">
      <div className="aspect-square bg-[var(--cream)] overflow-hidden mb-4">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            width={600}
            height={600}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--sage)]">
            <span className="font-display text-4xl">t</span>
          </div>
        )}
      </div>
      <p className="text-xs uppercase tracking-widest text-[var(--sage)] mb-1">{product.category}</p>
      <h3 className="font-display text-xl text-[var(--foreground)] mb-1">{product.title}</h3>
      {product.tagline && <p className="text-sm font-light text-[var(--foreground)]/60 mb-2">{product.tagline}</p>}
      <p className="text-sm text-[var(--green)]">{formatPrice(product.price)}</p>
    </Link>
  );
}
