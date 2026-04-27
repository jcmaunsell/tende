import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import ClearCart from "./ClearCart";

export const metadata: Metadata = {
  title: "Order confirmed — Tende",
  robots: { index: false, follow: false },
};

function formatAddress(address: Stripe.Address | null | undefined) {
  if (!address) return null;
  return [address.line1, address.line2, `${address.city}, ${address.state} ${address.postal_code}`]
    .filter(Boolean)
    .join(", ");
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) notFound();

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });
  } catch {
    notFound();
  }

  const lineItems: Stripe.LineItem[] = session.line_items?.data ?? [];
  const customer = session.customer_details;
  const shipping = session.collected_information?.shipping_details;
  const total = ((session.amount_total ?? 0) / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="max-w-xl mx-auto px-6 py-20">
      <ClearCart />

      {/* Confirmation header */}
      <div className="mb-10 text-center">
        <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display font-bold text-3xl uppercase text-foreground mb-2">Order confirmed</h1>
        {customer?.email && (
          <p className="text-sm font-light font-sans text-muted">
            A receipt has been sent to <strong>{customer.email}</strong>
          </p>
        )}
      </div>

      {/* Order summary */}
      <div className="border border-parchment mb-6">
        <div className="px-5 py-3 border-b border-parchment">
          <p className="text-xs uppercase tracking-widest font-sans text-muted">Order summary</p>
        </div>
        <div className="divide-y divide-parchment">
          {lineItems.map((li) => (
            <div key={li.id} className="px-5 py-3 flex justify-between items-baseline gap-4">
              <span className="text-sm font-sans text-foreground">
                {li.quantity && li.quantity > 1 && (
                  <span className="text-muted mr-1">{li.quantity}×</span>
                )}
                {(li.price as Stripe.Price | null)?.nickname ?? li.description ?? "Product"}
              </span>
              <span className="text-sm font-sans text-teal flex-shrink-0">
                {((li.amount_total ?? 0) / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
              </span>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-parchment flex justify-between items-baseline">
          <span className="text-sm font-sans font-light text-muted uppercase tracking-widest">Total</span>
          <span className="font-display font-bold text-lg text-foreground">{total}</span>
        </div>
      </div>

      {/* Shipping address */}
      {shipping?.address && (
        <div className="border border-parchment mb-10">
          <div className="px-5 py-3 border-b border-parchment">
            <p className="text-xs uppercase tracking-widest font-sans text-muted">Shipping to</p>
          </div>
          <div className="px-5 py-3 text-sm font-sans font-light text-foreground/80 leading-relaxed">
            <p>{customer?.name}</p>
            <p>{formatAddress(shipping.address)}</p>
          </div>
        </div>
      )}

      {/* What's next */}
      <div className="bg-parchment/50 px-5 py-4 text-sm font-sans font-light text-foreground/70 leading-relaxed mb-10">
        Your order is on its way to being packed. A shipping label will be generated and you&apos;ll
        receive a separate email with your tracking number once it ships.
      </div>

      <div className="text-center">
        <Link
          href="/shop"
          className="text-xs uppercase tracking-widest font-sans text-teal border-b border-teal pb-0.5 hover:text-petrol hover:border-petrol transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
