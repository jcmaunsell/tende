import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { priceRange } from "@/lib/utils";
import { da } from "@/sanity/attr";

export default function ProductCard({ product }: { product: Product }) {
  const slug = product.slug.current;
  const pda = da(product._id, "product");
  const onSale =
    !!product.compareAtPrice ||
    (product.variants?.some((v) => v.compareAtPrice) ?? false);

  return (
    <Link href={`/shop/${slug}`} className="group block">
      <div className="relative aspect-square bg-parchment overflow-hidden mb-4">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            width={600}
            height={600}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-petrol">
            <span className="font-display font-bold text-4xl">t</span>
          </div>
        )}
        {onSale && (
          <span className="absolute top-2 right-2 bg-teal text-white text-[9px] uppercase tracking-widest font-sans px-2 py-1 rounded-sm">
            Sale
          </span>
        )}
      </div>
      <p className="text-xs uppercase tracking-widest text-petrol mb-1 font-sans">{product.category}</p>
      <h3 className="font-display font-bold text-base text-foreground uppercase leading-tight" data-sanity={pda("title")}>
        {product.title}
        {product.subtitle && (
          <span className="block font-light text-sm normal-case tracking-normal text-foreground/60" data-sanity={pda("subtitle")}>{product.subtitle}</span>
        )}
      </h3>
      {product.tagline && <p className="text-sm font-light text-petrol/80 mb-2 font-sans" data-sanity={pda("tagline")}>{product.tagline}</p>}
      <p className="text-sm text-teal font-sans">{priceRange(product)}</p>
    </Link>
  );
}
