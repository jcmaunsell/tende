"use client";

import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-petrol text-white/80 text-xs text-center py-2 px-4 tracking-wider">
        Free U.S. shipping on orders over $55 — no code needed
      </div>

      <nav className="fixed top-8 left-0 right-0 z-40 bg-petrol">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-white.png"
              alt="tende"
              width={80}
              height={28}
              className="h-7 w-auto"
              style={{ width: "auto" }}
            />
          </Link>
          <div className="flex items-center gap-6 text-xs font-light tracking-widest uppercase text-white/80">
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/events" className="hover:text-white transition-colors">Upcoming Events</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
