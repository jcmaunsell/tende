// Run: node --env-file=.env.local scripts/migrate-fragrances.mjs
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Canonical fragrance definitions (name -> notes).
// Deep Breath: "Lavender" added per Sage.
const CANONICAL = {
  "Atlas Rose": "Rosebud & Cedarwood Atlas",
  "Citrus Wood": "Grapefruit & Sandalwood",
  "Deep Breath": "Lavender",
  "Frosted Bloom": "Jasmine & Winter Citrus",
  "Golden Ritual": "Vanilla & Cardamom",
  "Midnight Musk": "Hinoki & Yuzu",
  "Mountain Resin": "Amyris & Cedarwood",
  "Simplicity": "Unscented",
  "Spiced Fig": "Cardamom & Orange Peel",
  "Sweet Moss": "Bergamot & Lavender",
  "Verdant Mind": "Tea Tree & Cedarwood",
};

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Step 1: create or update fragrance documents
console.log("Creating fragrance documents...");
const fragranceDocs = {};
for (const [name, notes] of Object.entries(CANONICAL)) {
  const id = `fragrance-${slugify(name)}`;
  const doc = await client.createOrReplace({
    _id: id,
    _type: "fragrance",
    name,
    notes,
  });
  fragranceDocs[name] = doc._id;
  console.log(`  ${doc._id}: ${name} | ${notes}`);
}

// Step 2: fetch all products with variants
const products = await client.fetch(
  `*[_type == "product" && defined(variants)]{ _id, title, variants[] }`
);

// Step 3: rewrite variant.fragrance from string to reference
console.log("\nMigrating product variants...");
const tx = client.transaction();

for (const product of products) {
  const updatedVariants = (product.variants ?? []).map((v) => {
    // Already migrated (reference object)?
    if (v.fragrance && typeof v.fragrance === "object" && v.fragrance._type === "reference") {
      return v;
    }
    const raw = typeof v.fragrance === "string" ? v.fragrance : "";
    const scentName = raw.split(" | ")[0].trim();
    const docId = fragranceDocs[scentName];
    if (!docId) {
      console.warn(`  WARNING: no fragrance doc for "${scentName}" in ${product.title}`);
      return v;
    }
    return { ...v, fragrance: { _type: "reference", _ref: docId } };
  });
  tx.patch(product._id, { set: { variants: updatedVariants } });
  console.log(`  ${product.title}: ${updatedVariants.length} variant(s) updated`);
}

await tx.commit();
console.log("\nMigration complete.");
