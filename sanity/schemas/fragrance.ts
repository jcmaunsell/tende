import { defineField, defineType } from "sanity";

export default defineType({
  name: "fragrance",
  title: "Fragrance",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Scent name",
      type: "string",
      description: 'The short name shown on buttons and filters — e.g. "Mountain Resin".',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "notes",
      title: "Scent notes",
      type: "string",
      description: 'The ingredient subtitle shown under the name — e.g. "Amyris & Cedarwood". Leave blank for Unscented.',
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "notes" },
  },
  orderings: [
    { title: "Name A–Z", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],
});
