import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import Stripe from "stripe";
import { createClient } from "@sanity/client";
import { logger } from "@/lib/logger";

function getClients() {
  return {
    stripe: new Stripe(process.env.STRIPE_SECRET_KEY!),
    sanity: createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      useCdn: false,
      apiVersion: "2024-01-01",
      token: process.env.SANITY_API_TOKEN,
    }),
  };
}

function verifySanitySignature(rawBody: string, signature: string, secret: string): boolean {
  // Sanity uses the same signing scheme as Stripe: t=<ts>,v1=<hmac-sha256-hex>
  const parts = Object.fromEntries(signature.split(",").map((p) => p.split("=")));
  if (!parts.t || !parts.v1) return false;
  const expected = createHmac("sha256", secret)
    .update(`${parts.t}.${rawBody}`)
    .digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("sanity-webhook-signature") ?? "";
  const secret = process.env.SANITY_WEBHOOK_SECRET ?? "";

  if (!signature || !verifySanitySignature(rawBody, signature, secret)) {
    after(() => logger.warn("Sanity webhook rejected: invalid signature"));
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const documentId: string = body._id;
  const documentType: string = body._type;

  if (!documentId || documentType !== "product") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const clients = getClients();

  after(async () => {
    try {
      await syncProductToStripe(documentId, clients);
    } catch (err) {
      logger.error("Sanity→Stripe sync failed", {
        documentId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  });

  return NextResponse.json({ ok: true });
}

async function syncProductToStripe(
  documentId: string,
  { stripe, sanity }: ReturnType<typeof getClients>
) {
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
