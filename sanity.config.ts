"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { schemaTypes } from "./sanity/schemas";

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
            orderableDocumentListDeskItem({ type: "product", title: "Products", S, context }),
            S.documentTypeListItem("fragrance").title("Fragrances"),
            S.documentTypeListItem("market").title("Markets"),
            S.documentTypeListItem("event").title("Events"),
            S.documentTypeListItem("order").title("Orders"),
            S.documentTypeListItem("siteSettings").title("Site Settings"),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
