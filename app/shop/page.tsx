import Image from "next/image";
import ShopProductList from "@/components/ShopProductList";
import { getShopPage, getAllProducts } from "@/sanity/queries";
import { da } from "@/sanity/attr";

export const revalidate = 60;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; fragrance?: string }>;
}) {
  const [shopPage, allProducts, params] = await Promise.all([
    getShopPage(),
    getAllProducts(),
    searchParams,
  ]);

  // Use shopPage order; append any products not yet added to the list.
  // Deduplicate by _id in case a reference was added twice in Studio.
  const seen = new Set<string>();
  const deduped = (shopPage?.products ?? []).filter((p) => {
    if (seen.has(p._id)) return false;
    seen.add(p._id);
    return true;
  });
  const products = deduped.length > 0
    ? [...deduped, ...allProducts.filter((p) => !seen.has(p._id))]
    : allProducts;

  const initialCategory = params.category ?? "all";
  const initialFragrance = params.fragrance ?? null;
  const sda = shopPage?._id ? da(shopPage._id, "shopPage") : null;

  return (
    <>
      <div className="relative h-56 overflow-hidden">
        <Image
          src="/images/bars-overhead.jpg"
          alt="Tende products"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-petrol/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-2 font-sans">plant-based care</p>
          <h1 className="font-display font-bold text-4xl text-white uppercase">Shop</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16" data-sanity={sda?.("products")}>
        <ShopProductList products={products} initialCategory={initialCategory} initialFragrance={initialFragrance} />
      </div>
    </>
  );
}
