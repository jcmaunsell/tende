import { defineField, defineType } from "sanity";

const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "string",
      description: 'Large text over the hero photo, e.g. "Science Meets Simplicity".',
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero sub-headline",
      type: "text",
      rows: 3,
      description: "Brand statement in the teal bar beneath the hero. Use a blank line to split into two sentences.",
    }),
    defineField({
      name: "testimonials",
      title: "Customer reviews",
      type: "array",
      description: "Reviews shown in the carousel on the home page. Drag to reorder.",
      of: [
        {
          type: "object",
          name: "testimonial",
          fields: [
            defineField({ name: "quote", title: "Quote", type: "text", rows: 2, validation: (R) => R.required() }),
            defineField({ name: "author", title: "Name", type: "string", description: 'e.g. "Maya R."', validation: (R) => R.required() }),
          ],
          preview: { select: { title: "author", subtitle: "quote" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});

(homePage as unknown as Record<string, unknown>).__experimental_actions = ["update", "publish"];

export default homePage;
