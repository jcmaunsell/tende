import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] mb-3">get in touch</p>
      <h1 className="font-display text-5xl text-[var(--foreground)] mb-4">Contact Us</h1>
      <p className="text-base font-light text-[var(--foreground)]/60 mb-12 leading-relaxed">
        Questions? Ideas? Declarations of love? You&apos;re in the right place.
      </p>
      <ContactForm />
    </div>
  );
}
