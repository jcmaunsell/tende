import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/sanity/queries";

export const revalidate = 60;

const TICKER_TEXT = "garden to palm";
const TICKER_SEP = "〰️";
const TICKER_ITEMS = Array(12).fill(`${TICKER_TEXT} ${TICKER_SEP} `);

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bars-overhead.jpg"
            alt="tende products"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[var(--background)]/55" />
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-5xl md:text-7xl text-[var(--foreground)] leading-tight mb-5">
            Science meets Simplicity
          </h1>
          <p className="max-w-md text-base font-light text-[var(--foreground)]/75 mb-10 leading-relaxed">
            Plant-based hair + body care, handcrafted by an organic chemist.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link
              href="/shop"
              className="text-sm uppercase tracking-widest border-b border-[var(--foreground)] text-[var(--foreground)] pb-0.5 hover:text-[var(--wine)] hover:border-[var(--wine)] transition-colors"
            >
              Shop the Collection
            </Link>
            <Link
              href="/about"
              className="text-sm uppercase tracking-widest border-b border-[var(--foreground)]/40 text-[var(--foreground)]/60 pb-0.5 hover:text-[var(--wine)] hover:border-[var(--wine)] transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="overflow-hidden border-y border-[var(--cream)] py-3 bg-[var(--background)]">
        <div className="ticker-track">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="font-display text-sm italic text-[var(--muted)] whitespace-nowrap px-2">
              {item}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {TICKER_ITEMS.map((item, i) => (
            <span key={`b${i}`} className="font-display text-sm italic text-[var(--muted)] whitespace-nowrap px-2">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Pure botanicals — product intro */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="aspect-square overflow-hidden">
          <Image
            src="/images/atlas-rose-products.jpg"
            alt="Atlas Rose body oil and scrub"
            width={800}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] mb-4">our approach</p>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--foreground)] mb-6 leading-tight">
            Pure botanicals,<br />zero excess.
          </h2>
          <p className="text-base font-light leading-relaxed text-[var(--foreground)]/70 mb-8">
            Each formula is made with purposeful, plant-based ingredients and exclusive essential oil blends
            to support scalp health, smooth strands, and soften skin.
          </p>
          <Link
            href="/about"
            className="text-sm uppercase tracking-widest text-[var(--foreground)] border-b border-[var(--foreground)] pb-0.5 hover:text-[var(--wine)] hover:border-[var(--wine)] transition-colors"
          >
            Our Story
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="bg-[var(--cream)] py-24">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] text-center mb-3">the collection</p>
            <h2 className="font-display text-4xl text-[var(--foreground)] mb-14 text-center">Shop the Collection</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            <div className="text-center mt-14">
              <Link
                href="/shop"
                className="text-sm uppercase tracking-widest text-[var(--foreground)] border-b border-[var(--foreground)] pb-0.5 hover:text-[var(--wine)] hover:border-[var(--wine)] transition-colors"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Crafted with Chemistry */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] mb-4">formulated with intention</p>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--foreground)] mb-6 leading-tight">
            Crafted with Chemistry.<br />Grounded in Nature.
          </h2>
          <p className="text-base font-light leading-relaxed text-[var(--foreground)]/70 mb-4">
            No fillers. No preservatives. Just pure, purposeful ingredients and a slower, more intentional approach to care.
          </p>
          <p className="text-base font-light leading-relaxed text-[var(--foreground)]/70 mb-8">
            Our products use either pure essential oils or ECOCERT-certified natural fragrance oils —
            and every formula is 100% vegan and cruelty-free.
          </p>
          <Link
            href="/shop"
            className="text-sm uppercase tracking-widest text-[var(--foreground)] border-b border-[var(--foreground)] pb-0.5 hover:text-[var(--wine)] hover:border-[var(--wine)] transition-colors"
          >
            Shop the Collection
          </Link>
        </div>
        <div className="order-1 md:order-2 aspect-[4/5] overflow-hidden">
          <Image
            src="/images/hair-serums-garden.jpg"
            alt="tende hair serums"
            width={800}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Second ticker */}
      <div className="overflow-hidden border-y border-[var(--cream)] py-3 bg-[var(--background)]">
        <div className="ticker-track">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="font-display text-sm italic text-[var(--muted)] whitespace-nowrap px-2">
              {item}
            </span>
          ))}
          {TICKER_ITEMS.map((item, i) => (
            <span key={`b${i}`} className="font-display text-sm italic text-[var(--muted)] whitespace-nowrap px-2">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* What People Are Saying */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] mb-3">reviews</p>
        <h2 className="font-display text-4xl text-[var(--foreground)] mb-16">What People are Saying</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              quote: "My hair has never felt so clean and light. I'll never go back to liquid shampoo.",
              author: "Maya R.",
            },
            {
              quote: "The Atlas Rose scrub is everything. My skin is so soft and the scent is incredible.",
              author: "Jordan T.",
            },
            {
              quote: "Love knowing exactly what's in every product. No mystery ingredients, just results.",
              author: "Sam L.",
            },
          ].map(({ quote, author }) => (
            <div key={author} className="text-left">
              <p className="font-display text-xl italic leading-relaxed text-[var(--foreground)]/80 mb-4">
                &ldquo;{quote}&rdquo;
              </p>
              <p className="text-xs uppercase tracking-widest text-[var(--muted)]">— {author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who we are */}
      <section className="relative py-28 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bar-sky.jpg"
            alt="tende bar held against blue sky"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[var(--foreground)]/60" />
        </div>
        <div className="relative z-10 px-6 max-w-lg">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60 mb-4">who we are</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6 leading-tight">
            tende was founded by an organic chemist in search of skincare that nurtures people and their planet.
          </h2>
          <Link
            href="/about"
            className="text-sm uppercase tracking-widest border-b border-white text-white pb-0.5 hover:border-white/60 hover:text-white/60 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>
    </>
  );
}
