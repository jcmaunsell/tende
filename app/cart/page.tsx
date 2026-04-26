"use client";

import { useCart } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-4xl mb-4">Your cart is empty</h1>
        <Link href="/shop" className="text-sm uppercase tracking-widest text-[var(--green)] border-b border-[var(--green)] pb-0.5">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-10">Cart</h1>

      <div className="space-y-6 mb-10">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 items-start pb-6 border-b border-[var(--cream)]">
            <div className="w-20 h-20 bg-[var(--cream)] flex-shrink-0 overflow-hidden">
              {item.image ? (
                <Image src={item.image} alt={item.title} width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-2xl text-[var(--sage)]">t</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg">{item.title}</h3>
              <p className="text-sm text-[var(--green)] mb-3">{formatPrice(item.price)}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-7 h-7 border border-[var(--foreground)]/20 text-sm hover:border-[var(--green)] transition-colors"
                >−</button>
                <span className="text-sm w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-7 h-7 border border-[var(--foreground)]/20 text-sm hover:border-[var(--green)] transition-colors"
                >+</button>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="ml-4 text-xs uppercase tracking-wider text-[var(--foreground)]/40 hover:text-[var(--clay)] transition-colors"
                >Remove</button>
              </div>
            </div>
            <p className="text-sm text-[var(--foreground)]">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--cream)] pt-6 flex justify-between items-center mb-8">
        <span className="font-display text-xl">Total</span>
        <span className="text-xl text-[var(--green)]">{formatPrice(total())}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-4 bg-[var(--green)] text-white text-sm uppercase tracking-widest hover:bg-[var(--green)]/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Redirecting…" : "Checkout"}
      </button>
    </div>
  );
}
