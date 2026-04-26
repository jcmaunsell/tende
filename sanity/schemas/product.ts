import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    // ── Core info ──────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Product name",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      description: 'The URL-friendly name for this product (e.g. "scalp-oil"). Click "Generate" to create it from the product name.',
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: 'One short sentence shown under the product name (e.g. "A lightweight oil for a balanced scalp").',
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      description: "Upload one or more product photos. The first image is used as the main photo everywhere.",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
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
      description: 'Turn this off to show "Out of Stock" and disable the Add to Cart button.',
      initialValue: true,
    }),

    // ── Pricing ────────────────────────────────────────────────────────────
    defineField({
      name: "price",
      title: "Price (in cents)",
      type: "number",
      description: "Enter the price in cents — e.g. enter 2400 for $24.00.",
      validation: (R) => R.required().positive().integer(),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare-at price (in cents)",
      type: "number",
      description: "Optional. If set, shown as a crossed-out original price. Enter in cents.",
      validation: (R) => R.positive().integer(),
    }),
    defineField({
      name: "stripePriceId",
      title: "Stripe Price ID",
      type: "string",
      description: 'Found in your Stripe dashboard under Products → [this product] → Pricing. Looks like "price_1Abc…". Required for checkout to work.',
    }),

    // ── Product details ────────────────────────────────────────────────────
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Shown on the product page. A few sentences about what the product is and who it's for.",
      rows: 4,
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      description: "Add each ingredient as a separate item. They'll be displayed as a comma-separated list.",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "howToUse",
      title: "How to use",
      type: "text",
      description: "Step-by-step instructions shown on the product page.",
      rows: 3,
    }),

    // ── Fragrance variants ─────────────────────────────────────────────────
    defineField({
      name: "variants",
      title: "Fragrance variants",
      type: "array",
      description: "Add one entry per scent. If left empty, the product has no fragrance choice and uses the Stripe Price ID above.",
      of: [
        {
          type: "object",
          name: "variant",
          title: "Variant",
          fields: [
            defineField({
              name: "fragrance",
              title: "Fragrance name",
              type: "string",
              description: 'e.g. "Lavender", "Unscented", "Citrus & Mint"',
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
              title: "Price override (in cents)",
              type: "number",
              description: "Optional. Leave blank to use the product base price. Enter in cents, e.g. 2200 for $22.00.",
              validation: (R) => R.positive().integer(),
            }),
            defineField({
              name: "compareAtPrice",
              title: "Compare-at price (in cents)",
              type: "number",
              description: "Optional. If set, shown as a crossed-out original price for this scent. Enter in cents.",
              validation: (R) => R.positive().integer(),
            }),
            defineField({
              name: "stripePriceId",
              title: "Stripe Price ID",
              type: "string",
              description: 'The price_… ID for this specific scent in Stripe.',
            }),
            defineField({
              name: "inStock",
              title: "In stock?",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: { title: "fragrance", subtitle: "stripePriceId" },
          },
        },
      ],
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
