export function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function priceRange(product: { price: number; variants?: Array<{ price?: number }> }): string {
  const prices = product.variants?.length
    ? product.variants.map((v) => v.price ?? product.price)
    : [product.price];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return formatPrice(min);
  const compact = (c: number) =>
    (c / 100).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return `${compact(min)}\u2013${compact(max)}`;
}

export function parseFragrance(name: string): { scentName: string; notes: string | null } {
  const idx = name.indexOf(" | ");
  if (idx === -1) return { scentName: name, notes: null };
  return { scentName: name.slice(0, idx), notes: name.slice(idx + 3) };
}
