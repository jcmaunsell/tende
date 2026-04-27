"use client";

import { useState } from "react";

type Testimonial = { quote: string; author: string };

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const { quote, author } = testimonials[index];

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-2xl text-center px-12 relative">
        <button
          onClick={prev}
          aria-label="Previous review"
          className="absolute left-0 top-1/2 -translate-y-1/2 text-petrol/40 hover:text-petrol transition-colors text-2xl"
        >
          ‹
        </button>
        <p className="font-sans text-lg leading-relaxed text-petrol mb-6">
          &ldquo;{quote}&rdquo;
        </p>
        <p className="text-xs uppercase tracking-widest text-petrol font-sans">— {author}</p>
        <button
          onClick={next}
          aria-label="Next review"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-petrol/40 hover:text-petrol transition-colors text-2xl"
        >
          ›
        </button>
      </div>

      <div className="flex gap-2 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to review ${i + 1}`}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? "bg-petrol" : "bg-petrol/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
