import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/sanity/queries";

export const revalidate = 60;

const HERO_IMG = "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/ece15636-160b-42fd-b612-44aaea4494b5/IMG_8730.jpg";
const SECTION_IMG_1 = "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/9e578414-e43f-48da-9f5e-1661df6b8b84/IMG_8764.jpg";
const SECTION_IMG_2 = "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/d6f846c5-f39a-4c2d-90ea-73eed19b495f/A6FBB298-4172-4182-9B62-49D40F9CD352.jpg";
const SECTION_IMG_3 = "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/6ff13308-21d8-42d7-ae46-dbfaa73624b4/IMG_8782.jpg";

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMG}
            alt="tende products"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[var(--background)]/60" />
        </div>
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--green)] mb-5">garden to palm</p>
          <h1 className="font-display text-6xl md:text-8xl text-[var(--foreground)] leading-tight mb-6">
            Nurture Your Senses
          </h1>
          <p className="max-w-md text-base font-light text-[var(--foreground)]/75 mb-10 leading-relaxed">
            Plant-based hair + body care, handcrafted by an organic chemist.
          </p>
          <Link
            href="/shop"
            className="text-sm uppercase tracking-widest border-b border-[var(--green)] text-[var(--green)] pb-0.5 hover:text-[var(--clay)] hover:border-[var(--clay)] transition-colors"
          >
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* Science meets Simplicity */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="aspect-[4/5] overflow-hidden">
          <Image
            src={SECTION_IMG_1}
            alt="tende product"
            width={800}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--sage)] mb-4">our approach</p>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--foreground)] mb-6 leading-tight">
            Science meets Simplicity
          </h2>
          <p className="text-base font-light leading-relaxed text-[var(--foreground)]/70 mb-8">
            Each formula is made with purposeful, plant-based ingredients and exclusive essential oil blends
            to support scalp health, smooth strands, and soften skin.
          </p>
          <Link
            href="/about"
            className="text-sm uppercase tracking-widest text-[var(--green)] border-b border-[var(--green)] pb-0.5 hover:text-[var(--clay)] hover:border-[var(--clay)] transition-colors"
          >
            Our Story
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="bg-[var(--cream)] py-24">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--sage)] text-center mb-3">the collection</p>
            <h2 className="font-display text-4xl text-[var(--foreground)] mb-14 text-center">Pure botanicals, zero excess</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            <div className="text-center mt-14">
              <Link href="/shop" className="text-sm uppercase tracking-widest text-[var(--green)] border-b border-[var(--green)] pb-0.5 hover:text-[var(--clay)] hover:border-[var(--clay)] transition-colors">
                Shop All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Crafted with Chemistry */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--sage)] mb-4">formulated with intention</p>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--foreground)] mb-6 leading-tight">
            Crafted with Chemistry
          </h2>
          <p className="text-base font-light leading-relaxed text-[var(--foreground)]/70 mb-4">
            No fillers. No preservatives. Just pure, purposeful ingredients and a slower, more intentional approach to care.
          </p>
          <p className="text-base font-light leading-relaxed text-[var(--foreground)]/70 mb-8">
            Our products use either pure essential oils or ECOCERT-certified natural fragrance oils — and every formula is 100% vegan and cruelty-free.
          </p>
          <Link
            href="/shop"
            className="text-sm uppercase tracking-widest text-[var(--green)] border-b border-[var(--green)] pb-0.5 hover:text-[var(--clay)] hover:border-[var(--clay)] transition-colors"
          >
            Shop the Collection
          </Link>
        </div>
        <div className="order-1 md:order-2 aspect-[4/5] overflow-hidden">
          <Image
            src={SECTION_IMG_2}
            alt="tende ingredients"
            width={800}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Grounded in Nature */}
      <section className="relative py-32 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={SECTION_IMG_3}
            alt="tende care"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[var(--green)]/70" />
        </div>
        <div className="relative z-10 px-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--sage)] mb-4">Hudson Valley, NY</p>
          <h2 className="font-display text-4xl md:text-6xl text-white mb-6 leading-tight">Grounded in Nature</h2>
          <p className="max-w-sm mx-auto text-base font-light text-white/80 mb-10 leading-relaxed">
            Formulated in the Hudson Valley, inspired by the natural landscape and community here.
          </p>
          <Link
            href="/shop"
            className="text-sm uppercase tracking-widest border-b border-white text-white pb-0.5 hover:border-[var(--sage)] hover:text-[var(--sage)] transition-colors"
          >
            Shop the Collection
          </Link>
        </div>
      </section>
    </>
  );
}
