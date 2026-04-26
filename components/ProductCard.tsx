import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { priceRange } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const slug = product.slug.current;

  return (
    <Link href={`/shop/${slug}`} className="group block">
      <div className="aspect-square bg-cream overflow-hidden mb-4">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            width={600}
            height={600}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <span className="font-display font-bold text-4xl">t</span>
          </div>
        )}
      </div>
      <p className="text-xs uppercase tracking-widest text-muted mb-1 font-sans">{product.category}</p>
      <h3 className="font-display font-bold text-base text-foreground mb-1 uppercase">{product.title}</h3>
      {product.tagline && <p className="text-sm font-light text-foreground/60 mb-2 font-sans">{product.tagline}</p>}
      <p className="text-sm text-teal font-sans">{priceRange(product)}</p>
    </Link>
  );
}
