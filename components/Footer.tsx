export default function Footer() {
  return (
    <footer className="border-t border-[var(--cream)] mt-24 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 text-sm font-light text-[var(--foreground)]/60">
        <div>
          <p className="font-display text-xl text-[var(--green)] mb-1">tende</p>
          <p className="text-xs tracking-wider">garden to palm</p>
        </div>

        <div className="flex gap-10 uppercase tracking-widest text-xs">
          <div className="flex flex-col gap-3">
            <a href="/shop" className="hover:text-[var(--clay)] transition-colors">Shop</a>
            <a href="/about" className="hover:text-[var(--clay)] transition-colors">About</a>
          </div>
          <div className="flex flex-col gap-3">
            <a href="/faq" className="hover:text-[var(--clay)] transition-colors">FAQ</a>
            <a href="/events" className="hover:text-[var(--clay)] transition-colors">Upcoming Events</a>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-xs">
          <a
            href="https://www.instagram.com/tende.beauty"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--clay)] transition-colors uppercase tracking-widest"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@tende.care"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--clay)] transition-colors uppercase tracking-widest"
          >
            TikTok
          </a>
        </div>

        <p className="text-xs self-end">© {new Date().getFullYear()} tende care. All rights reserved.</p>
      </div>
    </footer>
  );
}
