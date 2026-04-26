import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "market",
      title: "Market (optional)",
      type: "reference",
      to: [{ type: "market" }],
      description: "For recurring markets — pick from your saved markets list and the name + location auto-fill. Leave blank for a one-off event.",
    }),
    defineField({
      name: "title",
      title: "Event name",
      type: "string",
      description: 'Leave blank to use the market name. Or enter a custom name (e.g. "Brooklyn Flea — Holiday Edition").',
      validation: (R) =>
        R.custom((value, context) => {
          const market = (context.document as Record<string, unknown>)?.market;
          if (!value && !market) return "Enter an event name, or choose a market above.";
          return true;
        }),
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
      description: "Leave blank to use the market's default location. Or enter a different address for this event.",
    }),
    defineField({
      name: "image",
      title: "Event photo",
      type: "image",
      description: "Upload a photo, or paste an external URL below instead.",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageUrl",
      title: "Image URL (external)",
      type: "url",
      description: "Paste a direct image URL instead of uploading. Ignored if a photo is uploaded above.",
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
    select: { title: "title", marketName: "market.name", subtitle: "date" },
    prepare({ title, marketName, subtitle }) {
      const dateStr = subtitle
        ? new Date(subtitle).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "No date set";
      return { title: title || marketName || "Untitled event", subtitle: dateStr };
    },
  },
  orderings: [
    { title: "Soonest first", name: "dateAsc", by: [{ field: "date", direction: "asc" }] },
  ],
});
