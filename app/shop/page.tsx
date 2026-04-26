import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/sanity/queries";

export const revalidate = 60;

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <>
      {/* Header image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src="/images/bars-overhead.jpg"
          alt="tende products"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[var(--sage-dark)]/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-2 font-sans">plant-based care</p>
          <h1 className="font-display font-bold text-4xl text-white uppercase">Shop</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-xs font-sans text-[var(--foreground)]/50 mb-12 uppercase tracking-widest">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
        {products.length === 0 ? (
          <p className="text-center py-24 text-[var(--foreground)]/40 font-sans font-light">
            Products coming soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
