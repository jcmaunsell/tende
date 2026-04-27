import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import type { CartItem } from "@/types";
import { logger } from "@/lib/logger";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
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

  const origin = new URL(req.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
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
