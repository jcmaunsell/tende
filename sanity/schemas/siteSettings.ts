import { defineField, defineType } from "sanity";

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "shippingBannerEnabled",
      title: "Show sitewide banner",
      type: "boolean",
      description: "Show the announcement bar at the top of every page.",
      initialValue: true,
    }),
    defineField({
      name: "shippingBannerText",
      title: "Sitewide banner text",
      type: "string",
      description: 'The message shown in the banner, e.g. "Free U.S. shipping on orders over $55 — no code needed".',
      initialValue: "Free U.S. shipping on orders over $55 — no code needed",
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});

(siteSettings as unknown as Record<string, unknown>).__experimental_actions = ["update", "publish"];

export default siteSettings;
