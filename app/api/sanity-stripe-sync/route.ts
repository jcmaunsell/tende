import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import Stripe from "stripe";
import { createClient } from "@sanity/client";
import { logger } from "@/lib/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  useCdn: false,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(req: NextRequest) {
  // Validate webhook secret
  const auth = req.headers.get("authorization");
  const expected = `Bearer ${process.env.SANITY_WEBHOOK_SECRET}`;
  if (!auth || auth !== expected) {
    after(() => logger.warn("Sanity webhook rejected: invalid secret"));
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const documentId: string = body._id;
  const documentType: string = body._type;

  if (!documentId || documentType !== "product") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  after(async () => {
    try {
      await syncProductToStripe(documentId);
    } catch (err) {
      logger.error("Sanity→Stripe sync failed", {
        documentId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  });

  return NextResponse.json({ ok: true });
}

async function syncProductToStripe(documentId: string) {
  const product = await sanity.fetch(
    `*[_type == "product" && _id == $id][0] {
      _id, title, price,
      variants[]{ _key, "fragranceName": fragrance->name, price, stripePriceId }
    }`,
    { id: documentId }
  );

  if (!product) {
    logger.warn("Sanity→Stripe sync: product not found", { documentId });
    return;
  }

  // Find or create Stripe product
  const existing = await stripe.products.search({
    query: `metadata['sanity_id']:'${product._id}'`,
    limit: 1,
  });

  let stripeProductId: string;
  if (existing.data.length > 0) {
    await stripe.products.update(existing.data[0].id, { name: product.title });
    stripeProductId = existing.data[0].id;
  } else {
    const created = await stripe.products.create({
      name: product.title,
      metadata: { sanity_id: product._id },
    });
    stripeProductId = created.id;
  }

  if (product.variants && product.variants.length > 0) {
    for (const variant of product.variants) {
      if (variant.stripePriceId) continue;

      const price = await stripe.prices.create({
        product: stripeProductId,
        unit_amount: variant.price ?? product.price,
        currency: "usd",
        nickname: `${product.title} — ${variant.fragranceName}`,
        metadata: { sanity_id: product._id, variant_key: variant._key },
      });

      await sanity
        .patch(product._id)
        .set({ [`variants[_key == "${variant._key}"].stripePriceId`]: price.id })
        .commit();
    }
  } else {
    const productData = await sanity.fetch(
      `*[_type == "product" && _id == $id][0]{ stripePriceId }`,
      { id: documentId }
    );
    if (!productData?.stripePriceId) {
      const price = await stripe.prices.create({
        product: stripeProductId,
        unit_amount: product.price,
        currency: "usd",
        nickname: product.title,
        metadata: { sanity_id: product._id },
      });

      await sanity.patch(product._id).set({ stripePriceId: price.id }).commit();
    }
  }

  logger.info("Sanity→Stripe sync complete", { documentId, title: product.title });
}
