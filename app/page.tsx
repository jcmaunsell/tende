import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import Ticker from "@/components/Ticker";
import { getFeaturedProducts, getSiteSettings } from "@/sanity/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [products, settings] = await Promise.all([getFeaturedProducts(), getSiteSettings()]);
  const testimonials = settings?.testimonials ?? [];
  const heroHeadline = settings?.heroHeadline ?? "Science Meets Simplicity";
  const heroSubheadline = settings?.heroSubheadline ?? "Plant-based hair + body care, handcrafted by an organic chemist.\n\nPure botanicals, zero excess.";

  return (
    <>
      {/* Hero — split: image top, sage green bottom */}
      <section className="flex flex-col">
        <div className="relative h-[55vh] flex items-center justify-center">
          <Image
            src="/images/bars-overhead.jpg"
            alt="Tende products"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-petrol/50" />
          <h1 className="relative z-10 font-display font-bold text-white text-4xl md:text-6xl lg:text-7xl text-center uppercase tracking-wider leading-none px-6">
            {heroHeadline}
          </h1>
        </div>

        <div className="bg-sage flex items-center justify-center text-center py-16 px-6">
          <div className="max-w-2xl">
            <p className="font-display font-bold text-white text-2xl md:text-3xl lg:text-4xl uppercase tracking-wide leading-snug whitespace-pre-line mb-10">
              {heroSubheadline}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/shop"
                className="text-xs uppercase tracking-widest text-white border border-white/50 px-6 py-3 hover:bg-white hover:text-sage transition-colors"
              >
                Shop the Collection
              </Link>
              <Link
                href="/about"
                className="text-xs uppercase tracking-widest text-white border border-white/50 px-6 py-3 hover:bg-white hover:text-sage transition-colors"
              >
                Our Story
              </Link>
              <Link
                href="#testimonials"
                className="text-xs uppercase tracking-widest text-white border border-white/50 px-6 py-3 hover:bg-white hover:text-sage transition-colors"
              >
                What People Are Saying
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      {/* Pure botanicals */}
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
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4 font-sans">our approach</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-6 leading-snug uppercase">
            Pure botanicals,<br />zero excess.
          </h2>
          <p className="text-base leading-relaxed text-muted mb-8 font-sans font-light">
            Each formula is made with purposeful, plant-based ingredients and exclusive essential oil blends
            to support scalp health, smooth strands, and soften skin.
          </p>
          <Link
            href="/about"
            className="text-xs uppercase tracking-widest text-foreground border-b border-foreground pb-0.5 hover:text-teal hover:border-teal transition-colors"
          >
            Our Story
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="bg-parchment py-24">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted text-center mb-3 font-sans">the collection</p>
            <h2 className="font-display font-bold text-3xl text-foreground mb-14 text-center uppercase">Shop the Collection</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            <div className="text-center mt-14">
              <Link
                href="/shop"
                className="text-xs uppercase tracking-widest text-foreground border-b border-foreground pb-0.5 hover:text-teal hover:border-teal transition-colors"
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
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4 font-sans">formulated with intention</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-6 leading-snug uppercase">
            Crafted with Chemistry.<br />Grounded in Nature.
          </h2>
          <p className="text-base leading-relaxed text-muted mb-4 font-sans font-light">
            No fillers. No preservatives. Just pure, purposeful ingredients and a slower, more intentional approach to care.
          </p>
          <p className="text-base leading-relaxed text-muted mb-8 font-sans font-light">
            Our products use either pure essential oils or ECOCERT-certified natural fragrance oils —
            and every formula is 100% vegan and cruelty-free.
          </p>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest text-foreground border-b border-foreground pb-0.5 hover:text-teal hover:border-teal transition-colors"
          >
            Shop the Collection
          </Link>
        </div>
        <div className="order-1 md:order-2 aspect-[4/5] overflow-hidden">
          <Image
            src="/images/hair-serums-garden.jpg"
            alt="Tende hair serums"
            width={800}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <Ticker />

      {/* Reviews — only shown when Sage has added real testimonials in Studio */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-3 font-sans">reviews</p>
          <h2 className="font-display font-bold text-3xl text-foreground mb-16 uppercase">What People are Saying</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map(({ quote, author }) => (
              <div key={author} className="text-left">
                <p className="font-sans text-base leading-relaxed text-muted mb-4">
                  &ldquo;{quote}&rdquo;
                </p>
                <p className="text-xs uppercase tracking-widest text-muted font-sans">— {author}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Who we are */}
      <section className="relative py-28 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bar-sky.jpg"
            alt="Tende bar held against blue sky"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-petrol/65" />
        </div>
        <div className="relative z-10 px-6 max-w-lg">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60 mb-4 font-sans">who we are</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-6 leading-snug uppercase">
            Tende was founded by an organic chemist in search of skincare that nurtures people and their planet.
          </h2>
          <Link
            href="/about"
            className="text-xs uppercase tracking-widest border-b border-white text-white pb-0.5 hover:border-white/60 hover:text-white/60 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>
    </>
  );
}
