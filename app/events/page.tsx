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

export const revalidate = 3600;

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <>
      <div className="relative h-56 overflow-hidden">
        <Image
          src="/images/bars-lineup.jpg"
          alt="tende products"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-sage-dark/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-2 font-sans">markets + pop-ups</p>
          <h1 className="font-display font-bold text-4xl text-white uppercase">Upcoming Events</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {events.length === 0 ? (
          <p className="text-foreground/40 font-sans font-light">
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
              <div key={event._id} className="border-b border-cream pb-10">
                <p className="text-xs uppercase tracking-widest text-muted mb-2 font-sans">{formatDate(event.date)}</p>
                <h2 className="font-display font-bold text-xl text-foreground mb-1 uppercase">{event.title}</h2>
                {event.location && (
                  <p className="text-sm font-light text-foreground/60 mb-3 font-sans">{event.location}</p>
                )}
                {event.description && (
                  <p className="text-sm font-light leading-relaxed text-foreground/70 font-sans">{event.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 pt-10 border-t border-cream">
          <p className="text-xs font-sans font-light text-foreground/50">
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
