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

async function upsertStripePrice(
  stripe: Stripe,
  sanity: ReturnType<typeof getClients>["sanity"],
  {
    stripeProductId,
    unitAmount,
    nickname,
    metadata,
    existingPriceId,
    patchPath,
    sanityDocId,
  }: {
    stripeProductId: string;
    unitAmount: number;
    nickname: string;
    metadata: Record<string, string>;
    existingPriceId?: string | null;
    patchPath: string;
    sanityDocId: string;
  }
) {
  // If a price already exists, check whether the amount has changed
  if (existingPriceId) {
    const existing = await stripe.prices.retrieve(existingPriceId);
    if (existing.unit_amount === unitAmount) return; // no change
    // Amount changed — archive old price and create a new one
    await stripe.prices.update(existingPriceId, { active: false });
  }

  const price = await stripe.prices.create({
    product: stripeProductId,
    unit_amount: unitAmount,
    currency: "usd",
    nickname,
    metadata,
  });

  await sanity.patch(sanityDocId).set({ [patchPath]: price.id }).commit();
}

async function syncProductToStripe(
  documentId: string,
  { stripe, sanity }: ReturnType<typeof getClients>
) {
  const product = await sanity.fetch(
    `*[_type == "product" && _id == $id][0] {
      _id, title, price, stripePriceId,
      variants[]{ _key, "fragranceName": fragrance->name, price, stripePriceId }
    }`,
    { id: documentId }
  );

  if (!product) {
    logger.warn("Sanity→Stripe sync: product not found", { documentId });
    return;
  }

  // Find or create the Stripe product record
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
      await upsertStripePrice(stripe, sanity, {
        stripeProductId,
        unitAmount: Math.round((variant.price ?? product.price) * 100),
        nickname: `${product.title} — ${variant.fragranceName}`,
        metadata: { sanity_id: product._id, variant_key: variant._key },
        existingPriceId: variant.stripePriceId,
        patchPath: `variants[_key == "${variant._key}"].stripePriceId`,
        sanityDocId: product._id,
      });
    }
  } else {
    await upsertStripePrice(stripe, sanity, {
      stripeProductId,
      unitAmount: Math.round(product.price * 100),
      nickname: product.title,
      metadata: { sanity_id: product._id },
      existingPriceId: product.stripePriceId,
      patchPath: "stripePriceId",
      sanityDocId: product._id,
    });
  }

  logger.info("Sanity→Stripe sync complete", { documentId, title: product.title });
}
