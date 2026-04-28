import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "core", title: "Product", default: true },
    { name: "details", title: "Details" },
    { name: "technical", title: "Shipping & Stripe" },
  ],
  fields: [
    orderRankField({ type: "product" }),
    // ── Core info ──────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Product name",
      type: "string",
      group: "core",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "core",
      description: 'The URL-friendly name for this product (e.g. "scalp-oil"). Click "Generate" to create it from the product name.',
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "core",
      description: 'Optional second line for the product name (e.g. "Clarifying & Renewal"). Shown below the title in a lighter style.',
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "core",
      description: 'One short sentence shown under the product name (e.g. "A lightweight oil for a balanced scalp").',
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      group: "core",
      description: "Upload one or more product photos. The first image is used as the main photo everywhere.",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "core",
      description: "Used to filter products on the shop page.",
      options: {
        list: [
          { title: "Skincare", value: "skincare" },
          { title: "Hair Care", value: "hair" },
          { title: "Body Care", value: "body" },
          { title: "Scalp Care", value: "scalp" },
          { title: "Accessories", value: "accessories" },
          { title: "Merch", value: "merch" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "inStock",
      title: "In stock?",
      type: "boolean",
      group: "core",
      description: 'Turn this off to show "Out of Stock" and disable the Add to Cart button.',
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage?",
      type: "boolean",
      group: "core",
      description: "Show this product in the featured section on the home page. Up to 4 featured products are shown.",
      initialValue: false,
    }),

    // ── Pricing ────────────────────────────────────────────────────────────
    defineField({
      name: "price",
      title: "Price ($)",
      type: "number",
      group: "core",
      description: "Enter the price in dollars — e.g. enter 24 for $24.00.",
      validation: (R) => R.required().positive(),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare-at price ($)",
      type: "number",
      group: "core",
      description: "Optional. If set, shown as a crossed-out original price. Enter in dollars.",
      validation: (R) => R.positive(),
    }),

    // ── Product details ────────────────────────────────────────────────────
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "details",
      description: "Shown on the product page. A few sentences about what the product is and who it's for.",
      rows: 4,
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      group: "details",
      description: "Add each ingredient as a separate item. They'll be displayed as a comma-separated list.",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "howToUse",
      title: "How to use",
      type: "text",
      group: "details",
      description: "Step-by-step instructions shown on the product page.",
      rows: 3,
    }),

    // ── Fragrance variants ─────────────────────────────────────────────────
    defineField({
      name: "variants",
      title: "Fragrance variants",
      type: "array",
      group: "core",
      description: "Add one entry per scent. If left empty, the product has no fragrance choice and uses the Stripe Price ID above.",
      of: [
        {
          type: "object",
          name: "variant",
          title: "Variant",
          fields: [
            defineField({
              name: "fragrance",
              title: "Fragrance",
              type: "reference",
              to: [{ type: "fragrance" }],
              description: "Pick from the fragrance list. Add new fragrances under Content → Fragrances.",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "image",
              title: "Fragrance photo",
              type: "image",
              description: "Optional. When selected, this image becomes the main photo when this scent is chosen.",
              options: { hotspot: true },
            }),
            defineField({
              name: "price",
              title: "Price override ($)",
              type: "number",
              description: "Optional. Leave blank to use the product base price. Enter in dollars, e.g. 22 for $22.00.",
              validation: (R) => R.positive(),
            }),
            defineField({
              name: "compareAtPrice",
              title: "Compare-at price ($)",
              type: "number",
              description: "Optional. If set, shown as a crossed-out original price for this scent. Enter in dollars.",
              validation: (R) => R.positive(),
            }),
            defineField({
              name: "stripePriceId",
              title: "Stripe Price ID",
              type: "string",
              description: "Set automatically when you publish. Do not edit manually.",
              readOnly: true,
            }),
            defineField({
              name: "inStock",
              title: "In stock?",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: { title: "fragrance.name", subtitle: "fragrance.notes" },
          },
        },
      ],
    }),

    // ── Shipping & Stripe (technical — set automatically) ──────────────────
    defineField({
      name: "stripePriceId",
      title: "Stripe Price ID",
      type: "string",
      group: "technical",
      description: "Set automatically when you publish. Do not edit manually.",
      readOnly: true,
    }),
    defineField({
      name: "weight",
      title: "Weight (lbs)",
      type: "number",
      group: "technical",
      description: "Shipping weight in pounds — e.g. 0.165 for a shampoo bar.",
      validation: (R) => R.positive(),
    }),
    defineField({
      name: "length",
      title: "Length (in)",
      type: "number",
      group: "technical",
      validation: (R) => R.positive(),
    }),
    defineField({
      name: "width",
      title: "Width (in)",
      type: "number",
      group: "technical",
      validation: (R) => R.positive(),
    }),
    defineField({
      name: "height",
      title: "Height (in)",
      type: "number",
      group: "technical",
      validation: (R) => R.positive(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "images.0" },
  },
  orderings: [
    { title: "Name A–Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
    { title: "Category", name: "category", by: [{ field: "category", direction: "asc" }] },
  ],
});
