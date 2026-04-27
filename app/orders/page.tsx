import type { Metadata } from "next";
import Link from "next/link";
import { getOrderByIdAndEmail } from "@/sanity/queries";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Track your order — Tende",
};

const STATUS_LABEL: Record<string, string> = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

const STATUS_COLOR: Record<string, string> = {
  processing: "text-muted",
  shipped: "text-teal",
  delivered: "text-teal",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; email?: string }>;
}) {
  const { id, email } = await searchParams;

  const order = id && email ? await getOrderByIdAndEmail(id.toUpperCase(), email.toLowerCase()) : null;
  const searched = !!(id && email);
  const notFound = searched && !order;

  return (
    <div className="max-w-xl mx-auto px-6 py-20">
      <h1 className="font-display text-4xl mb-3">Track your order</h1>
      <p className="text-sm font-sans font-light text-muted mb-10">
        Enter your order ID and the email address used at checkout.
      </p>

      <form method="get" action="/orders" className="space-y-4 mb-10">
        <div>
          <label className="block text-xs uppercase tracking-widest font-sans text-muted mb-1">
            Order ID
          </label>
          <input
            name="id"
            type="text"
            defaultValue={id ?? ""}
            placeholder="TND-XXXXXX"
            required
            className="w-full border border-foreground/20 px-3 py-2 text-sm font-sans bg-background focus:outline-none focus:border-teal transition-colors uppercase"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest font-sans text-muted mb-1">
            Email address
          </label>
          <input
            name="email"
            type="email"
            defaultValue={email ?? ""}
            placeholder="you@example.com"
            required
            className="w-full border border-foreground/20 px-3 py-2 text-sm font-sans bg-background focus:outline-none focus:border-teal transition-colors"
          />
        </div>
        <button
          type="submit"
          className="w-full py-4 bg-foreground text-background text-sm uppercase tracking-widest hover:bg-petrol transition-colors"
        >
          Look up order
        </button>
      </form>

      {notFound && (
        <p className="text-sm font-sans text-red-600">
          No order found. Please check your order ID and email address.
        </p>
      )}

      {order && (
        <div className="space-y-6">
          <div className="flex justify-between items-baseline">
            <p className="font-display text-2xl">{order.orderId}</p>
            <p className={`text-sm font-sans uppercase tracking-widest ${STATUS_COLOR[order.status] ?? "text-muted"}`}>
              {STATUS_LABEL[order.status] ?? order.status}
            </p>
          </div>

          <div className="border border-parchment">
            <div className="px-5 py-3 border-b border-parchment">
              <p className="text-xs uppercase tracking-widest font-sans text-muted">Order summary</p>
            </div>
            <div className="divide-y divide-parchment">
              {order.items.map((item, i) => (
                <div key={i} className="px-5 py-3 flex justify-between items-baseline gap-4">
                  <span className="text-sm font-sans text-foreground">
                    {item.quantity > 1 && (
                      <span className="text-muted mr-1">{item.quantity}×</span>
                    )}
                    {item.name}
                  </span>
                  <span className="text-sm font-sans text-teal flex-shrink-0">
                    {formatPrice(item.lineTotalCents / 100)}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-parchment flex justify-between items-baseline">
              <span className="text-sm font-sans font-light text-muted uppercase tracking-widest">Total</span>
              <span className="font-display font-bold text-lg text-foreground">
                {formatPrice(order.totalCents / 100)}
              </span>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="border border-parchment">
              <div className="px-5 py-3 border-b border-parchment">
                <p className="text-xs uppercase tracking-widest font-sans text-muted">Shipping to</p>
              </div>
              <div className="px-5 py-3 text-sm font-sans font-light text-foreground/80 leading-relaxed">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street1}{order.shippingAddress.street2 ? `, ${order.shippingAddress.street2}` : ""}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              </div>
            </div>
          )}

          {order.trackingNumber && (
            <div className="border border-parchment">
              <div className="px-5 py-3 border-b border-parchment">
                <p className="text-xs uppercase tracking-widest font-sans text-muted">Tracking</p>
              </div>
              <div className="px-5 py-3">
                <p className="text-sm font-sans text-foreground mb-1">{order.shippingService}</p>
                <a
                  href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-sans text-teal border-b border-teal pb-0.5 hover:text-petrol hover:border-petrol transition-colors"
                >
                  {order.trackingNumber}
                </a>
              </div>
            </div>
          )}

          {!order.trackingNumber && order.status === "processing" && (
            <p className="text-sm font-sans font-light text-muted">
              Your order is being prepared. Tracking information will appear here once it ships.
            </p>
          )}
        </div>
      )}

      <div className="mt-12 text-center">
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
