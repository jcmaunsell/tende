import { getAllEvents } from "@/sanity/queries";

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
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--sage)] mb-3">markets + pop-ups</p>
      <h1 className="font-display text-5xl text-[var(--foreground)] mb-12">Upcoming Events</h1>
      {events.length === 0 ? (
        <p className="text-[var(--foreground)]/40 font-light">No upcoming events. Follow <a href="https://www.instagram.com/tende.beauty" target="_blank" rel="noopener noreferrer" className="text-[var(--green)] hover:text-[var(--clay)] transition-colors">@tende.beauty</a> on Instagram to stay in the loop.</p>
      ) : (
        <div className="space-y-10">
          {events.map((event) => (
            <div key={event._id} className="border-b border-[var(--cream)] pb-10">
              <p className="text-xs uppercase tracking-widest text-[var(--sage)] mb-2">{formatDate(event.date)}</p>
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
  );
}
