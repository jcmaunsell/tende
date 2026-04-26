import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-cream mt-24 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 text-sm font-light text-muted">
        <div>
          <Image
            src="/images/logo-black.png"
            alt="tende"
            width={72}
            height={25}
            className="h-6 w-auto mb-2 opacity-70"
            style={{ width: "auto" }}
          />
          <p className="text-xs tracking-wider font-sans">garden to palm</p>
        </div>

        <div className="flex gap-10 uppercase tracking-widest text-xs font-sans">
          <div className="flex flex-col gap-3">
            <Link href="/shop" className="hover:text-teal transition-colors">Shop</Link>
            <Link href="/about" className="hover:text-teal transition-colors">About</Link>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/faq" className="hover:text-teal transition-colors">FAQ</Link>
            <Link href="/events" className="hover:text-teal transition-colors">Upcoming Events</Link>
            <Link href="/contact" className="hover:text-teal transition-colors">Contact</Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-xs font-sans">
          <a
            href="https://www.instagram.com/tende.beauty"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal transition-colors uppercase tracking-widest"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@tende.care"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal transition-colors uppercase tracking-widest"
          >
            TikTok
          </a>
        </div>

        <p className="text-xs self-end font-sans">© {new Date().getFullYear()} tende care. All rights reserved.</p>
      </div>
    </footer>
  );
}
