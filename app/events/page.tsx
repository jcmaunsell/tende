import { getAllEvents } from "@/sanity/queries";
import Image from "next/image";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const revalidate = 3600;

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <>
      {/* Header image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src="/images/bars-lineup.jpg"
          alt="tende products"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[var(--foreground)]/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-2">markets + pop-ups</p>
          <h1 className="font-display text-5xl text-white">Upcoming Events</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {events.length === 0 ? (
          <p className="text-[var(--foreground)]/40 font-light">
            No upcoming events. Follow{" "}
            <a
              href="https://www.instagram.com/tende.beauty"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--wine)] hover:underline transition-colors"
            >
              @tende.beauty
            </a>{" "}
            on Instagram to stay in the loop.
          </p>
        ) : (
          <div className="space-y-10">
            {events.map((event) => (
              <div key={event._id} className="border-b border-[var(--cream)] pb-10">
                <p className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">{formatDate(event.date)}</p>
                <h2 className="font-display text-2xl text-[var(--foreground)] mb-1">{event.title}</h2>
                {event.location && (
                  <p className="text-sm font-light text-[var(--foreground)]/60 mb-3">{event.location}</p>
                )}
                {event.description && (
                  <p className="text-sm font-light leading-relaxed text-[var(--foreground)]/70">{event.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
