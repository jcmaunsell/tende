// Shippo REST API integration for purchasing USPS shipping labels.
// Shippo weight unit: oz; dimensions: inches.

const SHIPPO_BASE = "https://api.goshippo.com";

function shippoHeaders() {
  return {
    Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
    "Content-Type": "application/json",
  };
}

async function shippoPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${SHIPPO_BASE}${path}`, {
    method: "POST",
    headers: shippoHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shippo ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface ShippoAddress {
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

interface ShippoRate {
  object_id: string;
  provider: string;
  servicelevel: { name: string; token: string };
  amount: string;
  currency: string;
  estimated_days?: number;
}

export interface RateOption {
  object_id: string;
  service: string;
  amountDollars: string;
  estimatedDays?: number;
}

interface ShippoShipment {
  object_id: string;
  rates: ShippoRate[];
}

interface ShippoAddressResponse {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  validation_results?: {
    is_valid: boolean;
    messages: Array<{ text: string }>;
  };
}

export interface AddressSuggestion {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}

interface ShippoTransaction {
  object_state: string;
  tracking_number: string;
  label_url: string;
  tracking_url_provider: string;
  messages: Array<{ text: string }>;
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
      sum + (item.length ?? 4) * (item.width ?? 4) * (item.height ?? 2) * item.quantity,
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

export function fromAddress(): ShippoAddress {
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
// Prefer USPS Ground Advantage (cheapest for lighter parcels), then cheapest
// USPS rate, then cheapest overall.

function selectRate(rates: ShippoRate[]): ShippoRate {
  const sorted = [...rates].sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
  const usps = sorted.filter((r) => r.provider === "USPS");
  const groundAdvantage = usps.find((r) => r.servicelevel.token.includes("ground_advantage"));
  return groundAdvantage ?? usps[0] ?? sorted[0];
}

// ── Address helpers ────────────────────────────────────────────────────────

function toTitleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeForCompare(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function validateAddress(address: ShippoAddress): Promise<{
  valid: boolean;
  messages: string[];
  suggested?: AddressSuggestion;
}> {
  const result = await shippoPost<ShippoAddressResponse>("/addresses", {
    name: address.name,
    street1: address.street1,
    street2: address.street2,
    city: address.city,
    state: address.state,
    zip: address.zip,
    country: address.country ?? "US",
    validate: true,
  });

  const valid = result.validation_results?.is_valid ?? false;
  const messages = (result.validation_results?.messages ?? []).map((m) => m.text);

  if (!valid) return { valid, messages };

  const suggested: AddressSuggestion = {
    street1: toTitleCase(result.street1),
    street2: result.street2 ? toTitleCase(result.street2) : undefined,
    city:    toTitleCase(result.city),
    state:   result.state,
    zip:     result.zip.slice(0, 5),
  };

  const hasCorrection =
    normalizeForCompare(suggested.street1) !== normalizeForCompare(address.street1) ||
    normalizeForCompare(suggested.street2 ?? "") !== normalizeForCompare(address.street2 ?? "") ||
    normalizeForCompare(suggested.city) !== normalizeForCompare(address.city) ||
    suggested.state.toUpperCase() !== (address.state ?? "").toUpperCase() ||
    suggested.zip !== (address.zip ?? "").slice(0, 5);

  return { valid, messages, suggested: hasCorrection ? suggested : undefined };
}

export async function getRates(
  toAddress: ShippoAddress,
  parcel: { weightOz: number; length: number; width: number; height: number }
): Promise<RateOption[]> {
  const shipment = await shippoPost<ShippoShipment>("/shipments", {
    address_from: fromAddress(),
    address_to: toAddress,
    parcels: [{
      length: String(parcel.length),
      width:  String(parcel.width),
      height: String(parcel.height),
      distance_unit: "in",
      weight: String(parcel.weightOz),
      mass_unit: "oz",
    }],
    async: false,
  });

  return shipment.rates
    .filter((r) => r.provider === "USPS")
    .sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount))
    .map((r) => ({
      object_id:    r.object_id,
      service:      r.servicelevel.name,
      amountDollars: r.amount,
      estimatedDays: r.estimated_days,
    }));
}

export async function purchaseLabel(
  toAddress: ShippoAddress,
  parcel: { weightOz: number; length: number; width: number; height: number }
): Promise<{ labelUrl: string; trackingCode: string; carrier: string; service: string; rateDollars: string }> {
  const shipment = await shippoPost<ShippoShipment>("/shipments", {
    address_from: fromAddress(),
    address_to: toAddress,
    parcels: [{
      length: String(parcel.length),
      width:  String(parcel.width),
      height: String(parcel.height),
      distance_unit: "in",
      weight: String(parcel.weightOz),
      mass_unit: "oz",
    }],
    async: false,
  });

  const rate = selectRate(shipment.rates);

  const transaction = await shippoPost<ShippoTransaction>("/transactions", {
    rate: rate.object_id,
    label_file_type: "PDF",
    async: false,
  });

  if (transaction.object_state !== "VALID") {
    const msg = transaction.messages?.[0]?.text ?? "Unknown error";
    throw new Error(`Shippo label purchase failed: ${msg}`);
  }

  return {
    labelUrl:     transaction.label_url,
    trackingCode: transaction.tracking_number,
    carrier:      rate.provider,
    service:      rate.servicelevel.name,
    rateDollars:  rate.amount,
  };
}
