import { NextRequest, NextResponse } from "next/server";
import type { CartItem } from "@/types";
import type { ShippoAddress } from "@/lib/shipping";
import { calcParcel, getRates } from "@/lib/shipping";
import { getProductsByStripePriceIds } from "@/sanity/queries";

export async function POST(req: NextRequest) {
  const { items, address }: { items: CartItem[]; address: ShippoAddress } = await req.json();

  const priceIds = items.map((i) => i.stripePriceId).filter(Boolean) as string[];
  const products = await getProductsByStripePriceIds(priceIds);

  const dimMap = new Map<string, { weight?: number; length?: number; width?: number; height?: number }>();
  for (const p of products) {
    if (p.stripePriceId) dimMap.set(p.stripePriceId, p);
    for (const v of p.variants ?? []) {
      if (v.stripePriceId) dimMap.set(v.stripePriceId, p);
    }
  }

  const parcelItems = items.map((item) => {
    const dims = dimMap.get(item.stripePriceId ?? "");
    return { weight: dims?.weight, length: dims?.length, width: dims?.width, height: dims?.height, quantity: item.quantity };
  });

  const parcel = calcParcel(parcelItems);

  try {
    const rates = await getRates({ ...address, country: "US" }, parcel);
    return NextResponse.json({ rates });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
