import Image from "next/image";
import { getSiteSettings } from "@/sanity/queries";

const FALLBACK_IMG = "https://images.squarespace-cdn.com/content/v1/67b280d5f7c74d32903613d1/4a1fce95-19e6-4b67-87e6-bcc5d7f4fcb9/DSC_0932+2.jpg";
const FALLBACK_BIO = [
  "I'm an organic chemist and cosmetic scientist by training, but also an artist and nature enthusiast at heart.",
  "I started Tende to create products that are both effective and intentional — where every ingredient has a purpose, and nothing is added just to fill space.",
];

const TICKER_SEP = "✦";
const TICKER_ITEMS = Array(14).fill(`garden to palm ${TICKER_SEP} `);

export const revalidate = 3600;

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const photoUrl = settings?.founderPhoto ?? FALLBACK_IMG;
  const bio = settings?.founderBio?.length ? settings.founderBio : FALLBACK_BIO;

  return (
    <div className="bg-sage min-h-screen">

      <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-[2fr_3fr] gap-12 items-center">
        {/* Skewed frame matching the original Squarespace look */}
        <div className="relative" style={{ perspective: "800px" }}>
          <div
            className="aspect-[3/4] overflow-hidden"
            style={{
              transform: "rotate3d(2, -1, 0.5, 8deg)",
              boxShadow: "-12px 16px 40px rgba(0,0,0,0.35)",
            }}
          >
            <Image
              src={photoUrl}
              alt="Sage, founder of Tende"
              width={900}
              height={1200}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-8 leading-snug uppercase">
            I&apos;m Sage, the founder of Tende.
          </h2>
          <div className="space-y-5 text-base font-light leading-relaxed text-white/80 font-sans">
            {bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-white/10 py-3">
        <div className="ticker-track">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="font-sans text-xs uppercase tracking-widest text-white/50 whitespace-nowrap px-3">
              {item}
            </span>
          ))}
          {TICKER_ITEMS.map((item, i) => (
            <span key={`b${i}`} className="font-sans text-xs uppercase tracking-widest text-white/50 whitespace-nowrap px-3">
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
