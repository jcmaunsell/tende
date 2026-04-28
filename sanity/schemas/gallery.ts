import { defineField, defineType } from "sanity";

const gallery = defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
  fields: [
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      description: "Photos shown on the /gallery page. Drag to reorder.",
      of: [
        {
          type: "object",
          name: "galleryImage",
          fields: [
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: (R) => R.required() }),
            defineField({ name: "alt", title: "Alt text", type: "string", description: "Describe the image for screen readers." }),
          ],
          preview: {
            select: { media: "image", title: "alt" },
            prepare(value: Record<string, unknown>) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return { media: value.image as any, title: (value.alt as string | undefined) ?? "Gallery image" };
            },
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Gallery" }) },
});

(gallery as unknown as Record<string, unknown>).__experimental_actions = ["update", "publish"];

export default gallery;
