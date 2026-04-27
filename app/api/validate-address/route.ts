import { NextRequest, NextResponse } from "next/server";
import type { ShippoAddress } from "@/lib/shipping";
import { validateAddress } from "@/lib/shipping";

export async function POST(req: NextRequest) {
  const { address }: { address: ShippoAddress } = await req.json();
  try {
    const result = await validateAddress(address);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
