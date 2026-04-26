"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";

export default function FloatingCart() {
  const count = useCart((s) => s.count());

  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Cart — ${count} item${count === 1 ? "" : "s"}` : "Cart"}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-petrol text-white rounded-full shadow-lg flex items-center justify-center hover:bg-foreground transition-colors"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 6h18"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M16 10a4 4 0 01-8 0"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-sage text-white text-[10px] font-sans rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
