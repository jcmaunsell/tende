import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-muted mb-3 font-sans">get in touch</p>
      <h1 className="font-display font-bold text-4xl text-foreground mb-4 uppercase">Contact Us</h1>
      <p className="text-base font-light text-foreground/60 mb-12 leading-relaxed font-sans">
        Questions? Ideas? Declarations of love? You&apos;re in the right place.
      </p>
      <ContactForm />
    </div>
  );
}
