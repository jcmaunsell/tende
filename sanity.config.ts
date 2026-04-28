"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { schemaTypes } from "./sanity/schemas";

const PRODUCT_CATEGORIES = [
  { title: "Hair Care",    value: "hair" },
  { title: "Body Care",    value: "body" },
  { title: "Skin Care",    value: "skincare" },
  { title: "Scalp Care",   value: "scalp" },
  { title: "Accessories",  value: "accessories" },
  { title: "Merch",        value: "merch" },
];

export default defineConfig({
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Products")
              .icon(() => "🛍️")
              .child(
                S.list()
                  .title("Products by Category")
                  .items(
                    PRODUCT_CATEGORIES.map(({ title, value }) =>
                      orderableDocumentListDeskItem({
                        type: "product",
                        title,
                        id: `orderable-product-${value}`,
                        filter: "_type == $type && category == $category",
                        params: { type: "product", category: value },
                        S,
                        context,
                      })
                    )
                  )
              ),
            S.documentTypeListItem("fragrance").title("Fragrances"),
            S.documentTypeListItem("market").title("Markets"),
            S.documentTypeListItem("event").title("Events"),
            S.documentTypeListItem("order").title("Orders"),
            S.divider(),
            S.listItem().title("Site Settings").child(
              S.editor().schemaType("siteSettings").documentId("siteSettings")
            ),
            S.listItem().title("Home Page").child(
              S.editor().schemaType("homePage").documentId("homePage")
            ),
            S.listItem().title("About Page").child(
              S.editor().schemaType("aboutPage").documentId("aboutPage")
            ),
            S.listItem().title("FAQ").child(
              S.editor().schemaType("faq").documentId("faq")
            ),
            S.listItem().title("Gallery").child(
              S.editor().schemaType("gallery").documentId("gallery")
            ),
          ]),
    }),
    presentationTool({
      previewUrl: {
        preview: "/",
        draftMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
