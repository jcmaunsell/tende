/**
 * One-time migration: convert all Sanity product prices from cents to dollars.
 * Run once after deploying the schema change.
 *
 * Run: node scripts/migrate-prices-to-dollars.mjs
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

const products = await sanity.fetch(`
  *[_type == "product"] {
    _id, title, price, compareAtPrice,
    variants[]{ _key, price, compareAtPrice }
  }
`);

for (const product of products) {
  // Heuristic: if price > 100, it's probably still in cents
  if (product.price <= 100) {
    console.log(`⏭  ${product.title}: price=${product.price} looks like dollars already, skipping`);
    continue;
  }

  console.log(`▶ ${product.title}: $${product.price / 100}`);

  const patch = sanity.patch(product._id);
  patch.set({ price: product.price / 100 });

  if (product.compareAtPrice) {
    patch.set({ compareAtPrice: product.compareAtPrice / 100 });
  }

  if (product.variants?.length) {
    for (const v of product.variants) {
      if (v.price != null) {
        patch.set({ [`variants[_key == "${v._key}"].price`]: v.price / 100 });
      }
      if (v.compareAtPrice != null) {
        patch.set({ [`variants[_key == "${v._key}"].compareAtPrice`]: v.compareAtPrice / 100 });
      }
    }
  }

  await patch.commit();
  console.log(`  ✓ done`);
}

console.log("\n✅ Migration complete.");
