import { defineField, defineType } from "sanity";

const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "founderPhoto",
      title: "Founder photo",
      type: "image",
      description: "The photo shown on the left side of the About page.",
      options: { hotspot: true },
    }),
    defineField({
      name: "founderBio",
      title: "Bio",
      type: "array",
      description: "Paragraphs shown next to the photo. Each item is one paragraph.",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "brandStory",
      title: "Mission & Brand Story",
      type: "array",
      description: "Paragraphs shown below the bio — the brand philosophy section.",
      of: [{ type: "text" }],
    }),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});

(aboutPage as unknown as Record<string, unknown>).__experimental_actions = ["update", "publish"];

export default aboutPage;
