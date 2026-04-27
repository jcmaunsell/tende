import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { randomBytes } from "crypto";
import type { CartItem } from "@/types";
import { logger } from "@/lib/logger";
import { stripe } from "@/lib/stripe";

function generateOrderId() {
  return "TND-" + randomBytes(3).toString("hex").toUpperCase();
}

interface ShippingAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
}

interface SelectedRate {
  service: string;
  amountCents: number;
}

export async function POST(req: NextRequest) {
  const { items, address, shippingRate }: {
    items: CartItem[];
    address: ShippingAddress;
    shippingRate: SelectedRate;
  } = await req.json();

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

  const orderId = generateOrderId();
  const origin = new URL(req.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      phone_number_collection: { enabled: true },
      shipping_options: [{
        shipping_rate_data: {
          type: "fixed_amount" as const,
          fixed_amount: { amount: shippingRate.amountCents, currency: "usd" },
          display_name: shippingRate.service,
        },
      }],
      payment_intent_data: {
        shipping: {
          name: address.name,
          phone: address.phone,
          address: {
            line1: address.street1,
            line2: address.street2,
            city: address.city,
            state: address.state,
            postal_code: address.zip,
            country: "US",
          },
        },
      },
      metadata: {
        order_id:     orderId,
        ship_name:    address.name,
        ship_street1: address.street1,
        ship_street2: address.street2 ?? "",
        ship_city:    address.city,
        ship_state:   address.state,
        ship_zip:     address.zip,
        ship_phone:   address.phone ?? "",
      },
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    after(() => logger.info("Checkout session created", {
      session_id: session.id,
      item_count: items.length,
      shipping_rate: shippingRate.service,
      shipping_cents: shippingRate.amountCents,
    }));

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    after(() => logger.error("Stripe checkout session creation failed", { error: message }));
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
