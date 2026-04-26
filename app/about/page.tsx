import Image from "next/image";

const SAGE_IMG = "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/4a1fce95-19e6-4b67-87e6-bcc5d7f4fcb9/DSC_0932+2.jpg";
const LANDSCAPE_IMG = "https://images.squarespace-cdn.com/content/v1/5ec321c2af33de48734cc929/26bd8da7-ac38-496e-83f6-211228f17663/20140301_Trade-151_0124-copy.jpg";

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--sage)] mb-3">our story</p>
        <h1 className="font-display text-6xl md:text-7xl text-[var(--foreground)]">garden to palm</h1>
      </section>

      {/* Sage intro — image + copy side by side */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16 items-start">
        <div className="aspect-[3/4] overflow-hidden">
          <Image
            src={SAGE_IMG}
            alt="Sage, founder of tende"
            width={900}
            height={1200}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="py-4">
          <h2 className="font-display text-3xl text-[var(--foreground)] mb-6">
            I&apos;m Sage, the founder of tende.
          </h2>
          <div className="space-y-5 text-base font-light leading-relaxed text-[var(--foreground)]/80">
            <p>
              I&apos;m an organic chemist and cosmetic scientist by training, but also an artist and nature
              enthusiast at heart. I started tende to create products that are both effective and intentional —
              where every ingredient has a purpose, and nothing is added just to fill space.
            </p>
            <p>
              No fillers. No preservatives. Just pure, purposeful ingredients and a slower, more intentional
              approach to care.
            </p>
            <p>
              Tende is rooted in the belief that skincare and haircare can be minimal, powerful, and beautiful.
              Everything is grounded in science and made with plant-based ingredients that care for your body
              without compromising your health or the planet.
            </p>
            <p>
              I live and formulate in the Hudson Valley, and tende is deeply inspired by the natural landscape
              and community here. Supporting small-batch production and local business isn&apos;t just a value —
              it&apos;s a responsibility.
            </p>
          </div>
        </div>
      </section>

      {/* Landscape / values section */}
      <section className="relative py-28 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={LANDSCAPE_IMG}
            alt="Hudson Valley landscape"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[var(--green)]/65" />
        </div>
        <div className="relative z-10 px-6 max-w-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--sage)] mb-4">what we believe</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6 leading-tight">
            Nurturing people and their planet
          </h2>
          <p className="text-base font-light text-white/80 leading-relaxed">
            Every formula is made with purposeful, plant-based ingredients. 100% vegan and cruelty-free,
            using only pure essential oils or ECOCERT-certified natural fragrance oils.
          </p>
        </div>
      </section>
    </>
  );
}
