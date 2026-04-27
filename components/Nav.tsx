"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/events", label: "Upcoming Events" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-petrol text-white/80 text-xs text-center py-2 px-4 tracking-wider">
        Free U.S. shipping on orders over $55 — no code needed
      </div>

      <nav className="fixed top-8 left-0 right-0 z-40 bg-petrol">
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

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-light tracking-widest uppercase text-white/80">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-white transition-colors">{label}</Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 text-white/80"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className={`block w-5 h-px bg-current transition-transform origin-center ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-px bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-current transition-transform origin-center ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
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
