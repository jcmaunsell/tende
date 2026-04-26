import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import Stripe from "stripe";
import type { CartItem } from "@/types";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
  });
  const { items }: { items: CartItem[] } = await req.json();

  if (!items || items.length === 0) {
    after(() => logger.warn("Checkout rejected due to empty cart"));
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const lineItems = items
    .filter((item) => item.stripePriceId)
    .map((item) => ({ price: item.stripePriceId, quantity: item.quantity }));

  if (lineItems.length === 0) {
    after(() => logger.warn("Checkout rejected because no items had a Stripe price ID"));
    return NextResponse.json({ error: "No valid Stripe price IDs in cart" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    });

    after(() => logger.info("Checkout session created", {
      session_id: session.id,
      item_count: items.length,
    }));

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    after(() => logger.error("Stripe checkout session creation failed", { error: message }));
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
