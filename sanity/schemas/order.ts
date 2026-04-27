import { defineField, defineType } from "sanity";

export default defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "orderId",
      title: "Order ID",
      type: "string",
      readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
        ],
        layout: "radio",
      },
      initialValue: "processing",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "customerEmail",
      title: "Customer email",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      readOnly: true,
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "quantity", title: "Quantity", type: "number" }),
            defineField({ name: "priceCents", title: "Price (cents)", type: "number" }),
          ],
          preview: {
            select: { title: "name", subtitle: "quantity" },
            prepare({ title, subtitle }) {
              return { title, subtitle: `Qty: ${subtitle}` };
            },
          },
        },
      ],
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping address",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "street1", title: "Street", type: "string" }),
        defineField({ name: "street2", title: "Apt / Suite", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "state", title: "State", type: "string" }),
        defineField({ name: "zip", title: "ZIP", type: "string" }),
      ],
    }),
    defineField({
      name: "trackingNumber",
      title: "Tracking number",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "labelUrl",
      title: "Label PDF",
      type: "url",
      readOnly: true,
    }),
    defineField({
      name: "carrier",
      title: "Carrier",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "shippingService",
      title: "Shipping service",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "stripeSessionId",
      title: "Stripe session ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "totalCents",
      title: "Total (cents)",
      type: "number",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "orderId",
      subtitle: "customerName",
      status: "status",
    },
    prepare({ title, subtitle, status }) {
      const statusLabel = status === "processing" ? "⏳" : status === "shipped" ? "📦" : "✅";
      return { title: `${statusLabel} ${title}`, subtitle };
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "createdAtDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});
