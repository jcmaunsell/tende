import { defineField, defineType } from "sanity";

const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Questions & Answers",
      type: "array",
      description: "Shown on the FAQ page. Drag to reorder.",
      of: [
        {
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (R) => R.required() }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 3, validation: (R) => R.required() }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "FAQ" }) },
});

(faq as unknown as Record<string, unknown>).__experimental_actions = ["update", "publish"];

export default faq;
