/**
 * Seeds weight and dimensions into Sanity products from CSV export data.
 * Matches products by title (case-insensitive). Safe to re-run.
 *
 * Run: node scripts/seed-product-dimensions.mjs
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
});

// Extracted from Squarespace CSV export (weight lbs, length/width/height inches).
// Hat is print-on-demand and ships from the printer — excluded intentionally.
const DIMENSIONS_BY_TITLE = {
  "shampoo bar":                              { weight: 0.165, length: 3.5, width: 3.5, height: 2.0 },
  "clarifying shampoo bar":                   { weight: 0.165, length: 3.5, width: 3.5, height: 2.0 },
  "volumizing shampoo bar":                   { weight: 0.165, length: 3.5, width: 3.5, height: 2.0 },
  "scalp rescue treatment bar":               { weight: 0.165, length: 3.5, width: 3.5, height: 2.0 },
  "equilibrium treatment bar":                { weight: 0.165, length: 3.5, width: 3.5, height: 2.0 },
  "conditioner bar for thick or curly hair":  { weight: 0.17,  length: 3.5, width: 3.5, height: 2.0 },
  "conditioner bar for fine hair":            { weight: 0.17,  length: 3.5, width: 3.5, height: 2.0 },
  "exfoliating mineral scrub":                { weight: 0.98,  length: 5.0, width: 5.0, height: 5.5 },
  "body oil":                                 { weight: 0.257, length: 2.75, width: 2.75, height: 6.0 },
  "hair serum | clarifying & renewal":        { weight: 0.255, length: 2.75, width: 2.75, height: 6.0 },
  "hair serum | restorative seal":            { weight: 0.255, length: 2.75, width: 2.75, height: 6.0 },
  "brightening face oil | sea buckthorn & primrose": { weight: 0.255, length: 2.75, width: 2.75, height: 6.0 },
  "red alder shampoo & conditioner bar rest": { weight: 0.11,  length: 4.0, width: 2.6, height: 0.75 },
  "hand thrown ceramic bar rest":             { weight: 0.11,  length: 4.0, width: 2.6, height: 0.75 },
  "bar travel tin":                           { weight: 0.11,  length: 4.0, width: 2.6, height: 0.75 },
};

const products = await sanity.fetch(
  `*[_type == "product"] { _id, title, weight }`
);

console.log(`Found ${products.length} products in Sanity.\n`);

for (const product of products) {
  const key = product.title.toLowerCase();
  const dims = DIMENSIONS_BY_TITLE[key];

  if (!dims) {
    console.log(`⏭  "${product.title}" — no dimensions in map, skipping`);
    continue;
  }

  if (product.weight != null) {
    console.log(`⏭  "${product.title}" — already has weight=${product.weight}, skipping`);
    continue;
  }

  await sanity.patch(product._id).set(dims).commit();
  console.log(`✓  "${product.title}" — ${dims.weight}lb, ${dims.length}×${dims.width}×${dims.height}in`);
}

console.log("\n✅ Done.");
