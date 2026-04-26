"use client";

import { useCart } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";

  useEffect(() => {
    if (success) clearCart();
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="font-display text-4xl mb-4">Order placed!</p>
        <p className="text-sm font-light text-muted font-sans mb-8">
          You&apos;ll receive a confirmation email from Stripe shortly.
        </p>
        <Link href="/shop" className="text-sm uppercase tracking-widest text-teal border-b border-teal pb-0.5">
          Continue Shopping
        </Link>
      </div>
    );
  }

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
        <Link href="/shop" className="text-sm uppercase tracking-widest text-teal border-b border-teal pb-0.5">
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
          <div key={`${item.productId}|${item.fragrance ?? ""}`} className="flex gap-4 items-start pb-6 border-b border-parchment">
            <div className="w-20 h-20 bg-parchment flex-shrink-0 overflow-hidden">
              {item.image ? (
                <Image src={item.image} alt={item.title} width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-2xl text-muted">t</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg">{item.title}</h3>
              {item.fragrance && (
                <p className="text-xs font-sans uppercase tracking-widest text-muted mb-1">{item.fragrance}</p>
              )}
              <p className="text-sm text-teal mb-3">{formatPrice(item.price)}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1, item.fragrance)}
                  className="w-7 h-7 border border-foreground/20 text-sm hover:border-teal transition-colors"
                >−</button>
                <span className="text-sm w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1, item.fragrance)}
                  className="w-7 h-7 border border-foreground/20 text-sm hover:border-teal transition-colors"
                >+</button>
                <button
                  onClick={() => removeItem(item.productId, item.fragrance)}
                  className="ml-4 text-xs uppercase tracking-wider text-muted/50 hover:text-teal transition-colors"
                >Remove</button>
              </div>
            </div>
            <p className="text-sm text-foreground">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-parchment pt-6 flex justify-between items-center mb-8">
        <span className="font-display text-xl">Total</span>
        <span className="text-xl text-teal">{formatPrice(total())}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-4 bg-foreground text-background text-sm uppercase tracking-widest hover:bg-petrol transition-colors disabled:opacity-50"
      >
        {loading ? "Redirecting…" : "Checkout"}
      </button>
    </div>
  );
}
