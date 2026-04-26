export function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function parseFragrance(name: string): { scentName: string; notes: string | null } {
  const idx = name.indexOf(" | ");
  if (idx === -1) return { scentName: name, notes: null };
  return { scentName: name.slice(0, idx), notes: name.slice(idx + 3) };
}
