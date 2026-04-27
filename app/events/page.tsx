import { getAllEvents } from "@/sanity/queries";
import Image from "next/image";
import Link from "next/link";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export const revalidate = 3600;

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <>
      <div className="relative h-56 overflow-hidden">
        <Image
          src="/images/bars-lineup.jpg"
          alt="Tende products"
          fill
          className="object-cover object-center blur-sm scale-105"
          priority
        />
        <div className="absolute inset-0 bg-petrol/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-2 font-sans">markets + pop-ups</p>
          <h1 className="font-display font-bold text-4xl text-white uppercase">Upcoming Events</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {events.length === 0 ? (
          <p className="text-petrol/50 font-sans font-light">
            No upcoming events. Follow{" "}
            <a
              href="https://www.instagram.com/tende.beauty"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal hover:underline transition-colors"
            >
              @tende.beauty
            </a>{" "}
            on Instagram to stay in the loop.
          </p>
        ) : (
          <div className="space-y-10">
            {events.map((event) => (
              <div key={event._id} className="border-b border-parchment pb-10 flex gap-6 items-start">
                {event.image && (
                  <div className="w-44 flex-shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={240}
                      height={240}
                      className="w-full"
                      style={{ height: "auto" }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-widest text-petrol mb-1 font-sans">
                    {formatDate(event.date)}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-petrol mb-2 font-sans">
                    {formatTime(event.date)}
                  </p>
                  <h2 className="font-display font-bold text-xl text-foreground mb-2 uppercase">{event.title}</h2>
                  {event.location && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-light text-teal hover:underline transition-colors mb-3 font-sans"
                    >
                      <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                        <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor"/>
                      </svg>
                      {event.location}
                    </a>
                  )}
                  {event.description && (
                    <p className="text-sm font-light leading-relaxed text-petrol font-sans">{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 pt-10 border-t border-parchment">
          <p className="text-xs font-sans font-light text-petrol/60">
            Sage manages events in{" "}
            <Link href="/studio" className="text-teal hover:underline">
              Sanity Studio
            </Link>
            . Add or remove events there and they&apos;ll appear here within an hour.
          </p>
        </div>
      </div>
    </>
  );
}
