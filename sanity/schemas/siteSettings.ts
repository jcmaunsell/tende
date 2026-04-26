import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    // ── About / Founder ────────────────────────────────────────────────────
    defineField({
      name: "founderPhoto",
      title: "Founder photo",
      type: "image",
      description: "The photo that appears on the About page.",
      options: { hotspot: true },
    }),
    defineField({
      name: "founderBio",
      title: "Founder bio",
      type: "array",
      description: "Paragraphs shown on the About page beneath the headline.",
      of: [{ type: "text" }],
    }),

    // ── FAQ ────────────────────────────────────────────────────────────────
    defineField({
      name: "faqs",
      title: "FAQ",
      type: "array",
      description: "Questions and answers shown on the FAQ page. Drag to reorder.",
      of: [
        {
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: R => R.required() }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 3, validation: R => R.required() }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),

    // ── Testimonials ───────────────────────────────────────────────────────
    defineField({
      name: "testimonials",
      title: "Customer reviews",
      type: "array",
      description: "Reviews shown on the home page. Add real customer quotes here.",
      of: [
        {
          type: "object",
          name: "testimonial",
          fields: [
            defineField({ name: "quote", title: "Quote", type: "text", rows: 2, validation: R => R.required() }),
            defineField({ name: "author", title: "Name", type: "string", description: 'e.g. "Maya R."', validation: R => R.required() }),
          ],
          preview: { select: { title: "author", subtitle: "quote" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
  __experimental_actions: ["update", "publish"],
});
