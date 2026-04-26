import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/sanity/queries";

export const revalidate = 60;

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-5xl text-[var(--foreground)] mb-4">Shop</h1>
      <p className="text-sm font-light text-[var(--foreground)]/60 mb-12 uppercase tracking-widest">
        {products.length} product{products.length !== 1 ? "s" : ""}
      </p>
      {products.length === 0 ? (
        <p className="text-center py-24 text-[var(--foreground)]/40 font-light">
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
  );
}
