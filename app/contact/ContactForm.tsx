"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-10 text-center">
        <p className="font-display font-bold text-2xl text-[var(--foreground)] mb-2 uppercase">Thank you!</p>
        <p className="text-sm font-light text-[var(--foreground)]/60 font-sans">We&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2 font-sans">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full border-b border-[var(--foreground)]/20 bg-transparent py-2 text-sm font-light font-sans focus:outline-none focus:border-[var(--foreground)] transition-colors placeholder:text-[var(--foreground)]/30"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2 font-sans">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border-b border-[var(--foreground)]/20 bg-transparent py-2 text-sm font-light font-sans focus:outline-none focus:border-[var(--foreground)] transition-colors placeholder:text-[var(--foreground)]/30"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs uppercase tracking-widest text-[var(--muted)] mb-2 font-sans">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full border-b border-[var(--foreground)]/20 bg-transparent py-2 text-sm font-light font-sans focus:outline-none focus:border-[var(--foreground)] transition-colors placeholder:text-[var(--foreground)]/30 resize-none"
          placeholder="What's on your mind?"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-[var(--teal)] font-sans">Something went wrong — please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-4 bg-[var(--petrol)] text-white text-xs uppercase tracking-widest font-sans hover:bg-[var(--teal)] transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
