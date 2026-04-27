import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { logger } from "@/lib/logger";
import { calcParcel, purchaseLabel } from "@/lib/shipping";
import { getProductsByStripePriceIds, createOrder, type ProductDimensions } from "@/sanity/queries";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    after(async () => {
      try {
        await handleOrderCompleted(session);
      } catch (err) {
        logger.error("Order fulfillment failed", {
          session_id: session.id,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    });
  }

  return NextResponse.json({ received: true });
}

async function handleOrderCompleted(session: Stripe.Checkout.Session) {
  // Expand line items
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items"],
  });

  const lineItems: Stripe.LineItem[] = fullSession.line_items?.data ?? [];
  const priceIds = lineItems
    .map((li) => (li.price as Stripe.Price | null)?.id)
    .filter((id): id is string => !!id);

  // Map price IDs → product dimensions
  const products = await getProductsByStripePriceIds(priceIds);
  const dimensionsByPriceId = new Map<string, ProductDimensions>();

  for (const product of products) {
    if (product.stripePriceId) {
      dimensionsByPriceId.set(product.stripePriceId, product);
    }
    for (const v of product.variants ?? []) {
      if (v.stripePriceId) {
        dimensionsByPriceId.set(v.stripePriceId, product);
      }
    }
  }

  const parcelItems = lineItems.map((li) => {
    const priceId = (li.price as Stripe.Price | null)?.id ?? "";
    const dims = dimensionsByPriceId.get(priceId);
    return {
      weight: dims?.weight,
      length: dims?.length,
      width:  dims?.width,
      height: dims?.height,
      quantity: li.quantity ?? 1,
    };
  });

  const parcel = calcParcel(parcelItems);

  const meta = session.metadata ?? {};
  const customer = session.customer_details;

  const toAddress = {
    name:    meta.ship_name || customer?.name || "Customer",
    street1: meta.ship_street1 || "",
    street2: meta.ship_street2 || undefined,
    city:    meta.ship_city || "",
    state:   meta.ship_state || "",
    zip:     meta.ship_zip || "",
    country: "US",
    phone:   meta.ship_phone || customer?.phone || undefined,
    email:   customer?.email ?? undefined,
  };

  // ── Generate shipping label ──────────────────────────────────────────────
  let label: Awaited<ReturnType<typeof purchaseLabel>> | null = null;

  if (process.env.SHIPPO_API_KEY) {
    try {
      label = await purchaseLabel(toAddress, parcel);
      logger.info("Shipping label purchased", {
        session_id: session.id,
        tracking: label.trackingCode,
        carrier: label.carrier,
        service: label.service,
        rate: label.rateDollars,
      });
    } catch (err) {
      logger.error("Label purchase failed", {
        session_id: session.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  } else {
    logger.warn("SHIPPO_API_KEY not set — skipping label generation", { session_id: session.id });
  }

  // ── Persist order to Sanity ─────────────────────────────────────────────
  if (meta.order_id) {
    try {
      await createOrder({
        orderId: meta.order_id,
        customerName: toAddress.name,
        customerEmail: customer?.email ?? "",
        items: lineItems.map((li) => ({
          name: (li.price as Stripe.Price | null)?.nickname ?? li.description ?? "Product",
          quantity: li.quantity ?? 1,
          lineTotalCents: li.amount_total ?? 0,
        })),
        shippingAddress: {
          name: toAddress.name,
          street1: toAddress.street1,
          street2: toAddress.street2,
          city: toAddress.city,
          state: toAddress.state,
          zip: toAddress.zip,
        },
        trackingNumber: label?.trackingCode,
        labelUrl: label?.labelUrl,
        carrier: label?.carrier,
        shippingService: label?.service,
        stripeSessionId: session.id,
        totalCents: fullSession.amount_total ?? 0,
      });
      logger.info("Order saved to Sanity", { session_id: session.id, order_id: meta.order_id });
    } catch (err) {
      logger.error("Failed to save order to Sanity", {
        session_id: session.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // ── Email Sage ──────────────────────────────────────────────────────────
  const notifyEmail = process.env.SAGE_NOTIFICATION_EMAIL;
  if (notifyEmail && process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "hello@tende.care";

    const itemsHtml = lineItems
      .map((li) => {
        const name = (li.price as Stripe.Price | null)?.nickname ?? "Product";
        return `<li>${li.quantity ?? 1}× ${name}</li>`;
      })
      .join("");

    const totalDollars = ((fullSession.amount_total ?? 0) / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    const addressHtml = [
      toAddress.name,
      toAddress.street1,
      toAddress.street2,
      `${toAddress.city}, ${toAddress.state} ${toAddress.zip}`,
    ]
      .filter(Boolean)
      .join("<br/>");

    const labelSection = label
      ? `<p><strong>Label:</strong> <a href="${label.labelUrl}">${label.carrier} ${label.service} — $${label.rateDollars}</a></p>
         <p><strong>Tracking:</strong> ${label.trackingCode}</p>`
      : `<p style="color:#c0392b">Label not generated — create manually in Shippo or USPS.</p>`;

    const parcelInfo = `${parcel.length}×${parcel.width}×${parcel.height} in, ${(parcel.weightOz / 16).toFixed(2)} lbs`;

    await resend.emails.send({
      from: fromEmail,
      to: notifyEmail,
      subject: `New order ${meta.order_id ? `(${meta.order_id}) ` : ""}— ${totalDollars} — ${toAddress.name}`,
      html: `
        <h2 style="font-family:sans-serif">New Tende order 🌿</h2>
        <p><strong>Total:</strong> ${totalDollars}</p>
        <h3>Items</h3>
        <ul>${itemsHtml}</ul>
        <h3>Ship to</h3>
        <p>${addressHtml}</p>
        ${customer?.email ? `<p><strong>Customer email:</strong> ${customer.email}</p>` : ""}
        <h3>Package</h3>
        <p>${parcelInfo}</p>
        ${labelSection}
        <hr/>
        <p style="font-size:12px;color:#999">
          <a href="https://dashboard.stripe.com/payments/${session.payment_intent}">View in Stripe</a>
        </p>
      `,
    });

    logger.info("Order notification sent", { session_id: session.id, to: notifyEmail });
  }

  // ── Email customer with tracking ────────────────────────────────────────
  if (label && customer?.email && process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "hello@tende.care";

    await resend.emails.send({
      from: fromEmail,
      to: customer.email,
      subject: "Your Tende order is on its way",
      html: `
        <p style="font-family:sans-serif">
          Hi ${customer.name?.split(" ")[0] ?? "there"},
        </p>
        <p style="font-family:sans-serif">
          Your order has been packed and a shipping label has been created.
          Your tracking number is:
        </p>
        <p style="font-family:sans-serif;font-size:18px;font-weight:bold">
          ${label.trackingCode}
        </p>
        <p style="font-family:sans-serif">
          You can track your package on the
          <a href="https://tools.usps.com/go/TrackConfirmAction?tLabels=${label.trackingCode}">USPS website</a>.
        </p>
        <p style="font-family:sans-serif">Thank you for your order! 🌿<br/>— Tende</p>
      `,
    });
  }
}
