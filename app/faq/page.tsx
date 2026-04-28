import Link from "next/link";
import { getFAQPage } from "@/sanity/queries";
import { da } from "@/sanity/attr";

export const revalidate = 3600;

const FALLBACK_FAQS = [
  { question: "Are Tende products truly plant-based?", answer: "All our formulas are crafted with plant-based ingredients, including solid shampoo and conditioner bars, oils, and scrubs." },
  { question: "Do your products contain essential oils or fragrance oils?", answer: "Our products use either pure essential oils or ECOCERT-certified natural fragrance oils." },
  { question: "Are your products cruelty-free and vegan?", answer: "Absolutely. Tende is 100% cruelty-free and vegan — no animal testing is involved at any stage." },
  { question: "How do I use a shampoo bar?", answer: "Wet your hair thoroughly, then either rub the bar directly on your hair focusing on your scalp, or create a lather in your hands first. With proper care, a bar can last 2–3 months." },
  { question: "Will my hair feel different switching from liquid shampoo?", answer: "Hair may feel different at first — often softer and lighter. Some people notice a short transition period as your hair adjusts to fewer synthetic surfactants." },
  { question: "Are your bars safe for colored or chemically-treated hair?", answer: "Yes. Our bars are gentle, sulfate-free, and safe for color-treated or chemically-processed hair." },
  { question: "How long does a shampoo bar last?", answer: "A standard bar lasts approximately 2–3 months depending on hair length and frequency of use." },
];

export default async function FAQPage() {
  const faqPage = await getFAQPage();
  const faqs = faqPage?.items?.length ? faqPage.items : FALLBACK_FAQS;
  const sda = faqPage?._id ? da(faqPage._id, "faq") : null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-petrol mb-3">questions</p>
      <h1 className="font-display text-5xl text-foreground mb-14">FAQ</h1>

      <div className="divide-y divide-parchment">
        {faqs.map(({ question, answer }, i) => (
          <div key={question} className="py-8">
            <h2 className="font-display text-xl text-foreground mb-3" data-sanity={sda?.(`items[${i}].question`)}>{question}</h2>
            <p className="text-sm font-light leading-relaxed text-petrol" data-sanity={sda?.(`items[${i}].answer`)}>{answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 pt-10 border-t border-parchment">
        <p className="text-sm font-light text-petrol/80">
          Still have questions?{" "}
          <Link href="/contact" className="text-teal border-b border-teal pb-0.5 hover:opacity-70 transition-opacity">
            Get in touch.
          </Link>
        </p>
      </div>
    </div>
  );
}
