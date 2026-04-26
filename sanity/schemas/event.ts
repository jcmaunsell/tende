import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event name",
      type: "string",
      description: 'E.g. "Brooklyn Flea Market" or "Harlem Pop-Up".',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "date",
      title: "Date & time",
      type: "datetime",
      description: "When the event starts.",
      validation: (R) => R.required(),
      options: { dateFormat: "MMMM D, YYYY", timeFormat: "h:mm A" },
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Street address or venue name — shown directly to visitors.",
    }),
    defineField({
      name: "description",
      title: "Details",
      type: "text",
      description: "Any extra info visitors should know (hours, what you'll have, etc.).",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "date" },
    prepare({ title, subtitle }) {
      const dateStr = subtitle
        ? new Date(subtitle).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "No date set";
      return { title, subtitle: dateStr };
    },
  },
  orderings: [
    { title: "Soonest first", name: "dateAsc", by: [{ field: "date", direction: "asc" }] },
  ],
});
