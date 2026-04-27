"use client";

import { useCart } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { formatPrice } from "@/lib/utils";
import type { RateOption, AddressSuggestion } from "@/lib/shipping";

const FREE_SHIPPING_THRESHOLD = 55;

interface Address {
  name: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

const EMPTY_ADDRESS: Address = { name: "", street1: "", street2: "", city: "", state: "", zip: "", phone: "" };

function Field({ label, value, onChange, required, placeholder, maxLength }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest font-sans text-petrol mb-1">
        {label}{required && <span className="text-teal ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full border border-foreground/20 px-3 py-2 text-sm font-sans bg-background focus:outline-none focus:border-teal transition-colors"
      />
    </div>
  );
}

function CartStep({ onContinue }: { onContinue: () => void }) {
  const { items, updateQuantity, removeItem, total } = useCart();

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
                  <span className="font-display text-2xl text-petrol">t</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg">{item.title}</h3>
              {item.fragrance && (
                <p className="text-xs font-sans uppercase tracking-widest text-petrol mb-1">{item.fragrance}</p>
              )}
              <p className="text-sm text-teal mb-3">{formatPrice(item.price)}</p>
              <div className="flex items-center gap-3">
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.fragrance)} className="w-7 h-7 border border-foreground/20 text-sm hover:border-teal transition-colors">−</button>
                <span className="text-sm w-4 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.fragrance)} className="w-7 h-7 border border-foreground/20 text-sm hover:border-teal transition-colors">+</button>
                <button onClick={() => removeItem(item.productId, item.fragrance)} className="ml-4 text-xs uppercase tracking-wider text-petrol/50 hover:text-teal transition-colors">Remove</button>
              </div>
            </div>
            <p className="text-sm text-foreground">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-parchment pt-6 flex justify-between items-center mb-2">
        <span className="font-display text-xl">Subtotal</span>
        <span className="text-xl text-teal">{formatPrice(total())}</span>
      </div>
      <p className="text-xs font-sans text-right mb-6">
        {total() >= FREE_SHIPPING_THRESHOLD
          ? <span className="text-teal">Free standard shipping on this order</span>
          : <span className="text-petrol">+ shipping · Free standard shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
        }
      </p>

      <button
        onClick={onContinue}
        className="w-full py-4 bg-foreground text-background text-sm uppercase tracking-widest hover:bg-petrol transition-colors"
      >
        Continue to Shipping
      </button>
    </div>
  );
}

function AddressStep({
  address,
  onChange,
  onBack,
  onSubmit,
  loading,
  error,
}: {
  address: Address;
  onChange: (a: Address) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}) {
  const set = (field: keyof Address) => (v: string) => onChange({ ...address, [field]: v });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <button onClick={onBack} className="text-xs uppercase tracking-widest text-petrol mb-8 hover:text-teal transition-colors">← Back to Cart</button>
      <h1 className="font-display text-4xl mb-10">Shipping Address</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" value={address.name} onChange={set("name")} required />
        <Field label="Street address" value={address.street1} onChange={set("street1")} required />
        <Field label="Apt / Suite (optional)" value={address.street2} onChange={set("street2")} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" value={address.city} onChange={set("city")} required />
          <Field label="State" value={address.state} onChange={set("state")} required maxLength={2} placeholder="NY" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="ZIP code" value={address.zip} onChange={set("zip")} required maxLength={10} />
          <Field label="Phone (optional)" value={address.phone} onChange={set("phone")} />
        </div>

        {error && <p className="text-sm text-red-600 font-sans">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-foreground text-background text-sm uppercase tracking-widest hover:bg-petrol transition-colors disabled:opacity-50 mt-4"
        >
          {loading ? "Getting rates…" : "Get Shipping Rates"}
        </button>
      </form>
    </div>
  );
}

function ConfirmStep({
  entered,
  suggested,
  onUseSuggested,
  onUseOriginal,
  onBack,
  loading,
}: {
  entered: Address;
  suggested: AddressSuggestion;
  onUseSuggested: () => void;
  onUseOriginal: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <button onClick={onBack} className="text-xs uppercase tracking-widest text-petrol mb-8 hover:text-teal transition-colors">← Back</button>
      <h1 className="font-display text-4xl mb-3">Confirm Address</h1>
      <p className="text-sm font-sans font-light text-petrol mb-10">USPS suggests a slight correction. Which would you like to use?</p>

      <div className="space-y-4">
        <button
          onClick={onUseOriginal}
          disabled={loading}
          className="w-full text-left border border-parchment p-5 hover:border-foreground/40 transition-colors disabled:opacity-50"
        >
          <p className="text-xs uppercase tracking-widest font-sans text-petrol mb-2">You entered</p>
          <p className="text-sm font-sans text-foreground">{entered.street1}{entered.street2 ? `, ${entered.street2}` : ""}</p>
          <p className="text-sm font-sans text-foreground">{entered.city}, {entered.state} {entered.zip}</p>
        </button>
        <button
          onClick={onUseSuggested}
          disabled={loading}
          className="w-full text-left border border-teal p-5 hover:bg-teal/5 transition-colors disabled:opacity-50"
        >
          <p className="text-xs uppercase tracking-widest font-sans text-teal mb-2">{loading ? "Getting rates…" : "Suggested"}</p>
          <p className="text-sm font-sans text-foreground">{suggested.street1}{suggested.street2 ? `, ${suggested.street2}` : ""}</p>
          <p className="text-sm font-sans text-foreground">{suggested.city}, {suggested.state} {suggested.zip}</p>
        </button>
      </div>
    </div>
  );
}

function ShippingStep({
  rates,
  selectedId,
  onSelect,
  onBack,
  onCheckout,
  loading,
}: {
  rates: RateOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
  onCheckout: () => void;
  loading: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <button onClick={onBack} className="text-xs uppercase tracking-widest text-petrol mb-8 hover:text-teal transition-colors">← Back</button>
      <h1 className="font-display text-4xl mb-10">Shipping Method</h1>

      <div className="space-y-3 mb-10">
        {rates.map((rate) => (
          <label key={rate.object_id} className={`flex items-center gap-4 border p-4 cursor-pointer transition-colors ${selectedId === rate.object_id ? "border-teal" : "border-foreground/20 hover:border-foreground/40"}`}>
            <input
              type="radio"
              name="rate"
              value={rate.object_id}
              checked={selectedId === rate.object_id}
              onChange={() => onSelect(rate.object_id)}
              className="accent-teal"
            />
            <div className="flex-1">
              <p className="text-sm font-sans font-medium text-foreground">{rate.service}</p>
              {rate.estimatedDays && (
                <p className="text-xs font-sans text-petrol">{rate.estimatedDays} business day{rate.estimatedDays !== 1 ? "s" : ""}</p>
              )}
            </div>
            <p className="text-sm font-sans text-teal font-medium">
              {parseFloat(rate.amountDollars) === 0 ? "Free" : `$${parseFloat(rate.amountDollars).toFixed(2)}`}
            </p>
          </label>
        ))}
      </div>

      <button
        onClick={onCheckout}
        disabled={loading || !selectedId}
        className="w-full py-4 bg-foreground text-background text-sm uppercase tracking-widest hover:bg-petrol transition-colors disabled:opacity-50"
      >
        {loading ? "Redirecting…" : "Proceed to Payment"}
      </button>
    </div>
  );
}

function CartContent() {
  const { items, total } = useCart();
  const [step, setStep] = useState<"cart" | "address" | "confirm" | "shipping">("cart");
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [suggestion, setSuggestion] = useState<AddressSuggestion | null>(null);
  const [rates, setRates] = useState<RateOption[]>([]);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFree = total() >= FREE_SHIPPING_THRESHOLD;

  async function fetchRates(addr: Address) {
    setLoading(true);
    try {
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, address: { ...addr, country: "US" } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to get shipping rates");
      const fetchedRates: RateOption[] = data.rates;
      if (isFree && fetchedRates.length > 0) {
        fetchedRates[0] = { ...fetchedRates[0], amountDollars: "0.00" };
      }
      setRates(fetchedRates);
      setSelectedRateId(fetchedRates[0]?.object_id ?? null);
      setStep("shipping");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not retrieve shipping rates. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddressSubmit() {
    if (!address.name || !address.street1 || !address.city || !address.state || !address.zip) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/validate-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: { ...address, country: "US" } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Address validation failed");

      if (!data.valid) {
        setError(data.messages?.[0] ?? "Address not found — please double-check your entry.");
        return;
      }

      if (data.suggested) {
        setSuggestion(data.suggested);
        setStep("confirm");
        return;
      }

      await fetchRates(address);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not validate address. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUseSuggested() {
    if (!suggestion) return;
    const updated = { ...address, ...suggestion };
    setAddress(updated);
    await fetchRates(updated);
  }

  async function checkout(rate: { service: string; amountCents: number }) {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, address, shippingRate: rate }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setLoading(false);
    }
  }

  async function handleCheckout() {
    const rate = rates.find((r) => r.object_id === selectedRateId);
    if (!rate) return;
    await checkout({
      service: rate.service,
      amountCents: Math.round(parseFloat(rate.amountDollars) * 100),
    });
  }

  if (step === "cart") {
    return <CartStep onContinue={() => setStep("address")} />;
  }

  if (step === "address") {
    return (
      <AddressStep
        address={address}
        onChange={setAddress}
        onBack={() => setStep("cart")}
        onSubmit={handleAddressSubmit}
        loading={loading}
        error={error}
      />
    );
  }

  if (step === "confirm" && suggestion) {
    return (
      <ConfirmStep
        entered={address}
        suggested={suggestion}
        onUseSuggested={handleUseSuggested}
        onUseOriginal={() => fetchRates(address)}
        onBack={() => { setSuggestion(null); setStep("address"); }}
        loading={loading}
      />
    );
  }

  return (
    <ShippingStep
      rates={rates}
      selectedId={selectedRateId}
      onSelect={setSelectedRateId}
      onBack={() => setStep("address")}
      onCheckout={handleCheckout}
      loading={loading}
    />
  );
}

export default function CartPage() {
  return (
    <Suspense>
      <CartContent />
    </Suspense>
  );
}
