function fmt(dollars: number): string {
  const isWhole = dollars % 1 === 0;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function formatPrice(dollars: number): string {
  return fmt(dollars);
}

export function priceRange(product: { price: number; variants?: Array<{ price?: number }> }): string {
  const prices = product.variants?.length
    ? product.variants.map((v) => v.price ?? product.price)
    : [product.price];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return fmt(min);
  return `${fmt(min)}\u2013${fmt(max)}`;
}

export function parseFragrance(name: string): { scentName: string; notes: string | null } {
  const idx = name.indexOf(" | ");
  if (idx === -1) return { scentName: name, notes: null };
  return { scentName: name.slice(0, idx), notes: name.slice(idx + 3) };
}
