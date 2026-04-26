import Image from "next/image";

const SAGE_IMG = "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/4a1fce95-19e6-4b67-87e6-bcc5d7f4fcb9/DSC_0932+2.jpg";

const TICKER_SEP = "→";
const TICKER_ITEMS = Array(14).fill(`GARDEN TO PALM ${TICKER_SEP} `);

export default function AboutPage() {
  return (
    <div className="bg-sage min-h-screen">

      <div className="overflow-hidden bg-foreground py-4 border-b border-white/10">
        <div className="ticker-track">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="font-display font-bold text-xs text-white uppercase tracking-widest whitespace-nowrap px-4">
              {item}
            </span>
          ))}
          {TICKER_ITEMS.map((item, i) => (
            <span key={`b${i}`} className="font-display font-bold text-xs text-white uppercase tracking-widest whitespace-nowrap px-4">
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-[2fr_3fr] gap-12 items-center">
        <div className="aspect-[3/4] overflow-hidden">
          <Image
            src={SAGE_IMG}
            alt="Sage, founder of Tende"
            width={900}
            height={1200}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-8 leading-snug uppercase">
            I&apos;m Sage, the founder of Tende.
          </h2>
          <div className="space-y-5 text-base font-light leading-relaxed text-white/80 font-sans">
            <p>
              I&apos;m an organic chemist and cosmetic scientist by training, but also an artist and nature
              enthusiast at heart.
            </p>
            <p>
              I started Tende to create products that are both effective and intentional — where every
              ingredient has a purpose, and nothing is added just to fill space.
            </p>
          </div>
        </div>
      </section>

      <div className="overflow-hidden bg-foreground py-4 border-y border-white/10">
        <div className="ticker-track" style={{ animationDirection: "reverse" }}>
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="font-display font-bold text-xs text-white uppercase tracking-widest whitespace-nowrap px-4">
              {item}
            </span>
          ))}
          {TICKER_ITEMS.map((item, i) => (
            <span key={`b${i}`} className="font-display font-bold text-xs text-white uppercase tracking-widest whitespace-nowrap px-4">
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-6 text-base font-light leading-relaxed text-white/75 font-sans">
          <p>
            Tende is rooted in the belief that skincare and haircare can be minimal, powerful, and beautiful.
            Everything is grounded in science and made with plant-based ingredients that care for your body
            without compromising your health or the planet.
          </p>
          <p>
            I live and formulate in the Hudson Valley, and Tende is deeply inspired by the natural landscape
            and community here. Supporting small-batch production and local business isn&apos;t just a value —
            it&apos;s a responsibility.
          </p>
        </div>
      </section>

    </div>
  );
}
