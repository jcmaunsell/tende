// EasyPost REST API integration for purchasing USPS shipping labels.
// Weight in EasyPost is always in oz; dimensions in inches.

const EP_BASE = "https://api.easypost.com/v2";

function epAuth() {
  return "Basic " + Buffer.from(`${process.env.EASYPOST_API_KEY}:`).toString("base64");
}

async function epPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${EP_BASE}${path}`, {
    method: "POST",
    headers: { Authorization: epAuth(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`EasyPost ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ── Types ──────────────────────────────────────────────────────────────────

interface EasyPostAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

interface EasyPostRate {
  id: string;
  carrier: string;
  service: string;
  rate: string;
}

interface EasyPostShipment {
  id: string;
  rates: EasyPostRate[];
}

interface PurchasedShipment {
  postage_label: { label_url: string };
  tracking_code: string;
}

// ── Box sizes ──────────────────────────────────────────────────────────────
// Volume-based selection: pick the smallest box that fits all items + packing.

const BOXES = [
  { length: 6,  width: 4,  height: 2,  volumeIn3: 48,  packagingOz: 1.5 },
  { length: 9,  width: 6,  height: 3,  volumeIn3: 162, packagingOz: 2.0 },
  { length: 10, width: 8,  height: 4,  volumeIn3: 320, packagingOz: 3.5 },
  { length: 12, width: 10, height: 6,  volumeIn3: 720, packagingOz: 5.0 },
] as const;

export interface ParcelItem {
  weight?: number;  // lbs
  length?: number;  // in
  width?: number;   // in
  height?: number;  // in
  quantity: number;
}

export function calcParcel(items: ParcelItem[]) {
  const totalWeightLbs = items.reduce(
    (sum, item) => sum + (item.weight ?? 0.2) * item.quantity,
    0
  );
  const totalVolumeIn3 = items.reduce(
    (sum, item) =>
      sum +
      (item.length ?? 4) * (item.width ?? 4) * (item.height ?? 2) * item.quantity,
    0
  );

  // Add 25% buffer for void fill, then pick smallest box that fits
  const paddedVolume = totalVolumeIn3 * 1.25;
  const box = BOXES.find((b) => b.volumeIn3 >= paddedVolume) ?? BOXES[BOXES.length - 1];

  return {
    weightOz: totalWeightLbs * 16 + box.packagingOz,
    length: box.length,
    width: box.width,
    height: box.height,
  };
}

// ── Shipping address builder ───────────────────────────────────────────────

export function fromAddress(): EasyPostAddress {
  return {
    name:    process.env.SHIPPING_FROM_NAME    ?? "Tende Beauty",
    street1: process.env.SHIPPING_FROM_STREET1 ?? "",
    city:    process.env.SHIPPING_FROM_CITY    ?? "",
    state:   process.env.SHIPPING_FROM_STATE   ?? "",
    zip:     process.env.SHIPPING_FROM_ZIP     ?? "",
    country: "US",
    phone:   process.env.SHIPPING_FROM_PHONE   ?? "",
  };
}

// ── Rate selection ─────────────────────────────────────────────────────────
// Prefer USPS First Class (cheapest for < 15.999 oz), then cheapest USPS
// Priority, then cheapest from any carrier.

function selectRate(rates: EasyPostRate[]): EasyPostRate {
  const sorted = [...rates].sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate));
  const usps = sorted.filter((r) => r.carrier === "USPS");
  const firstClass = usps.find((r) => r.service.includes("First"));
  return firstClass ?? usps[0] ?? sorted[0];
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function purchaseLabel(
  toAddress: EasyPostAddress,
  parcel: { weightOz: number; length: number; width: number; height: number }
): Promise<{ labelUrl: string; trackingCode: string; carrier: string; service: string; rateDollars: string }> {
  const shipment = await epPost<EasyPostShipment>("/shipments", {
    shipment: {
      to_address: toAddress,
      from_address: fromAddress(),
      parcel: {
        weight: parcel.weightOz,
        length: parcel.length,
        width: parcel.width,
        height: parcel.height,
      },
    },
  });

  const rate = selectRate(shipment.rates);

  const purchased = await epPost<PurchasedShipment>(
    `/shipments/${shipment.id}/buy`,
    { rate: { id: rate.id } }
  );

  return {
    labelUrl:     purchased.postage_label.label_url,
    trackingCode: purchased.tracking_code,
    carrier:      rate.carrier,
    service:      rate.service,
    rateDollars:  rate.rate,
  };
}
