import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import Stripe from "stripe";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
  });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    after(() => logger.warn("Stripe webhook rejected due to missing signature"));
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    after(() => logger.error("Stripe webhook signature verification failed", { error: message }));
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    after(() => logger.info("Order completed", {
      session_id: session.id,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
    }));
  }

  return NextResponse.json({ received: true });
}
