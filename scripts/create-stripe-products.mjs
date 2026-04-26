/**
 * One-time script: creates Stripe products + prices from Sanity data,
 * then writes the price IDs back to Sanity.
 *
 * Run: node scripts/create-stripe-products.mjs
 */

import Stripe from "stripe";
import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
});

const products = await sanity.fetch(`
  *[_type == "product"] | order(_createdAt asc) {
    _id, title, price, compareAtPrice,
    variants[]{ _key, "fragranceName": fragrance->name, price, compareAtPrice, stripePriceId }
  }
`);

for (const product of products) {
  console.log(`\n▶ ${product.title}`);

  // Create (or look up existing) Stripe product
  const existing = await stripe.products.search({
    query: `metadata['sanity_id']:'${product._id}'`,
    limit: 1,
  });

  let stripeProduct;
  if (existing.data.length > 0) {
    stripeProduct = existing.data[0];
    console.log(`  ↩ reusing Stripe product ${stripeProduct.id}`);
  } else {
    stripeProduct = await stripe.products.create({
      name: product.title,
      metadata: { sanity_id: product._id },
    });
    console.log(`  ✓ created Stripe product ${stripeProduct.id}`);
  }

  if (product.variants && product.variants.length > 0) {
    // Per-variant prices
    for (const variant of product.variants) {
      const dollars = variant.price ?? product.price;
      const unitAmount = Math.round(dollars * 100);
      const label = `${product.title} — ${variant.fragranceName}`;

      // Check if this variant already has a price
      if (variant.stripePriceId) {
        console.log(`  ↩ ${variant.fragranceName}: already has ${variant.stripePriceId}`);
        continue;
      }

      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: unitAmount,
        currency: "usd",
        nickname: label,
        metadata: { sanity_id: product._id, variant_key: variant._key },
      });

      console.log(`  ✓ ${variant.fragranceName}: ${price.id} ($${dollars})`);

      // Write back to Sanity
      await sanity
        .patch(product._id)
        .set({ [`variants[_key == "${variant._key}"].stripePriceId`]: price.id })
        .commit();
    }
  } else {
    // Single price on product
    if (product.stripePriceId) {
      console.log(`  ↩ already has ${product.stripePriceId}`);
      continue;
    }

    const price = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(product.price * 100),
      currency: "usd",
      nickname: product.title,
      metadata: { sanity_id: product._id },
    });

    console.log(`  ✓ ${price.id} ($${product.price})`);

    await sanity.patch(product._id).set({ stripePriceId: price.id }).commit();
  }
}

console.log("\n✅ Done.");
