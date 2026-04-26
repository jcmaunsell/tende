import { defineField, defineType } from "sanity";

export default defineType({
  name: "market",
  title: "Market",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Market name",
      type: "string",
      description: 'E.g. "Brooklyn Flea Market" or "Hudson Farmers Market".',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "location",
      title: "Default location",
      type: "string",
      description: "The usual address or venue name. Events at this market inherit this unless overridden.",
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 2,
      description: "Internal notes — not shown to visitors.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "location" },
  },
  orderings: [
    { title: "Name A–Z", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],
});
