import Image from "next/image";
import ShopProductList from "@/components/ShopProductList";
import { getAllProducts } from "@/sanity/queries";

export const revalidate = 60;

export default async function ShopPage() {
  const products = await getAllProducts();

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

      <div className="max-w-6xl mx-auto px-6 py-16">
        <ShopProductList products={products} />
      </div>
    </>
  );
}
