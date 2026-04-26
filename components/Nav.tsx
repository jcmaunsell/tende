"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";

export default function Nav() {
  const count = useCart((s) => s.count());

  return (
    <>
      {/* Announcement bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--green)] text-white text-xs text-center py-2 px-4 tracking-wider">
        Free U.S. shipping on orders over $55 — no code needed
      </div>

      {/* Main nav */}
      <nav className="fixed top-8 left-0 right-0 z-40 bg-[var(--background)]/90 backdrop-blur-sm border-b border-[var(--cream)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl tracking-wide text-[var(--green)]">
            tende
          </Link>
          <div className="flex items-center gap-6 text-xs font-light tracking-widest uppercase">
            <Link href="/shop" className="hover:text-[var(--clay)] transition-colors">Shop</Link>
            <Link href="/about" className="hover:text-[var(--clay)] transition-colors">About</Link>
            <Link href="/faq" className="hover:text-[var(--clay)] transition-colors">FAQ</Link>
            <Link href="/events" className="hover:text-[var(--clay)] transition-colors">Upcoming Events</Link>
            <Link href="/cart" className="relative hover:text-[var(--clay)] transition-colors">
              Cart
              {count > 0 && (
                <span className="absolute -top-2 -right-4 bg-[var(--clay)] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
