import { defineField, defineType } from "sanity";

const shopPage = defineType({
  name: "shopPage",
  title: "Shop Page",
  type: "document",
  fields: [
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      description: "All products shown on the shop page. Drag to reorder.",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
  ],
  preview: { prepare: () => ({ title: "Shop Page" }) },
});

(shopPage as unknown as Record<string, unknown>).__experimental_actions = ["update", "publish"];

export default shopPage;
