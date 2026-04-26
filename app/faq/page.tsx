import Link from "next/link";

const faqs = [
  {
    q: "Are Tende products truly plant-based?",
    a: "All our formulas are crafted with plant-based ingredients, including solid shampoo and conditioner bars, oils, and scrubs.",
  },
  {
    q: "Do your products contain essential oils or fragrance oils?",
    a: "Our products use either pure essential oils or ECOCERT-certified natural fragrance oils.",
  },
  {
    q: "Are your products cruelty-free and vegan?",
    a: "Absolutely. Tende is 100% cruelty-free and vegan — no animal testing is involved at any stage.",
  },
  {
    q: "How do I use a shampoo bar?",
    a: "Wet your hair thoroughly, then either rub the bar directly on your hair focusing on your scalp, or create a lather in your hands first. With proper care, a bar can last 2–3 months.",
  },
  {
    q: "Will my hair feel different switching from liquid shampoo?",
    a: "Hair may feel different at first — often softer and lighter. Some people notice a short transition period as your hair adjusts to fewer synthetic surfactants.",
  },
  {
    q: "Are your bars safe for colored or chemically-treated hair?",
    a: "Yes. Our bars are gentle, sulfate-free, and safe for color-treated or chemically-processed hair.",
  },
  {
    q: "How long does a shampoo bar last?",
    a: "A standard bar lasts approximately 2–3 months depending on hair length and frequency of use.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-muted mb-3">questions</p>
      <h1 className="font-display text-5xl text-foreground mb-14">FAQ</h1>

      <div className="divide-y divide-cream">
        {faqs.map(({ q, a }) => (
          <div key={q} className="py-8">
            <h2 className="font-display text-xl text-foreground mb-3">{q}</h2>
            <p className="text-sm font-light leading-relaxed text-foreground/70">{a}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 pt-10 border-t border-cream">
        <p className="text-sm font-light text-foreground/60">
          Still have questions?{" "}
          <Link href="/contact" className="text-teal border-b border-teal pb-0.5 hover:opacity-70 transition-opacity">
            Get in touch.
          </Link>
        </p>
      </div>
    </div>
  );
}
