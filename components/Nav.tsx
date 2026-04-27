"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/store/cart";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/events", label: "Upcoming Events" },
  { href: "/contact", label: "Contact" },
];

function CartIcon({ count }: { count: number }) {
  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Cart — ${count} item${count === 1 ? "" : "s"}` : "Cart"}
      className="relative flex items-center text-white/80 hover:text-white transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 6h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-sage text-white text-[9px] font-sans rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}

const DEFAULT_BANNER = "Free U.S. shipping on orders over $55 — no code needed";

export default function Nav({ bannerEnabled = true, bannerText = DEFAULT_BANNER }: { bannerEnabled?: boolean; bannerText?: string }) {
  const [open, setOpen] = useState(false);
  const count = useCart((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <>
      {bannerEnabled && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background text-foreground text-xs text-center py-2 px-4 tracking-wider">
          {bannerText}
        </div>
      )}

      <nav className={`fixed ${bannerEnabled ? "top-8" : "top-0"} left-0 right-0 z-40 bg-petrol`}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center flex-shrink-0" onClick={() => setOpen(false)}>
            <Image
              src="/images/logo-white.png"
              alt="tende"
              width={80}
              height={28}
              className="h-7 w-auto"
              style={{ width: "auto" }}
            />
          </Link>

          {/* Desktop links + cart */}
          <div className="hidden md:flex items-center gap-6 text-xs font-light tracking-widest uppercase text-white/80">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-white transition-colors">{label}</Link>
            ))}
            <CartIcon count={count} />
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="md:hidden flex items-center gap-4">
            <CartIcon count={count} />
            <button
              className="flex flex-col gap-1.5 p-2 text-white/80"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className={`block w-5 h-px bg-current transition-transform origin-center ${open ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-px bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-px bg-current transition-transform origin-center ${open ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden bg-petrol border-t border-white/10 px-6 py-4 flex flex-col gap-4 text-xs font-light tracking-widest uppercase text-white/80">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-white transition-colors" onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
