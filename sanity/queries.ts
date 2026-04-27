import { client, writeClient } from "./client";
import type { Product, SanityEvent, SiteSettings } from "@/types";

// ── Shared GROQ fragments ──────────────────────────────────────────────────

const FRAGRANCE_FRAGMENT = `fragrance->{ _id, name, notes }`;

// Fields needed on every product surface (card, featured, detail)
const PRODUCT_BASE = `
  _id, title, subtitle, slug, tagline,
  price, compareAtPrice,
  "images": images[].asset->url,
  category, inStock, featured
`;

// Additional fields only needed on the product detail page
const PRODUCT_DETAIL_EXTRA = `
  description, ingredients, howToUse, stripePriceId
`;

// Variant fields for list views (no image, no stripePriceId needed)
const VARIANT_LIST = `variants[]{ "fragrance": ${FRAGRANCE_FRAGMENT}, price, compareAtPrice }`;

// Variant fields for the detail page
const VARIANT_DETAIL = `variants[]{
  "fragrance": ${FRAGRANCE_FRAGMENT},
  "image": image.asset->url,
  price, compareAtPrice, stripePriceId, inStock
}`;

// ── Product shape returned by getProductsByStripePriceIds ──────────────────

export interface ProductDimensions {
  _id: string;
  title: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  stripePriceId?: string;
  variants?: Array<{ stripePriceId?: string }>;
}

// ── Queries ────────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product"] | order(_createdAt asc) { ${PRODUCT_BASE}, ${VARIANT_LIST} }`
    );
  } catch {
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && inStock == true] | order(coalesce(featured, false) desc, _createdAt asc) [0...4] {
        ${PRODUCT_BASE}, ${VARIANT_LIST}
      }`
    );
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await client.fetch(
      `*[_type == "product" && slug.current == $slug][0] {
        ${PRODUCT_BASE}, ${PRODUCT_DETAIL_EXTRA}, ${VARIANT_DETAIL}
      }`,
      { slug }
    );
  } catch {
    return null;
  }
}

export async function getAllEvents(): Promise<SanityEvent[]> {
  try {
    return await client.fetch(
      `*[_type == "event" && date >= now()] | order(date asc) {
        _id,
        "title": coalesce(title, market->name),
        date,
        "image": coalesce(image.asset->url, imageUrl),
        "location": coalesce(location, market->location),
        description,
        "market": market->{ _id, name, location, website }
      }`
    );
  } catch {
    return [];
  }
}

export async function getProductsByStripePriceIds(priceIds: string[]): Promise<ProductDimensions[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && (
        stripePriceId in $ids ||
        count(variants[stripePriceId in $ids]) > 0
      )] {
        _id, title, weight, length, width, height,
        stripePriceId,
        variants[]{ stripePriceId }
      }`,
      { ids: priceIds }
    );
  } catch {
    return [];
  }
}

// ── Order types ────────────────────────────────────────────────────────────

export interface OrderItem {
  name: string;
  quantity: number;
  lineTotalCents: number;
}

export interface OrderAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface Order {
  _id: string;
  _createdAt: string;
  orderId: string;
  status: "processing" | "shipped" | "delivered";
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  trackingNumber?: string;
  labelUrl?: string;
  carrier?: string;
  shippingService?: string;
  stripeSessionId: string;
  totalCents: number;
}

export interface CreateOrderInput {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  trackingNumber?: string;
  labelUrl?: string;
  carrier?: string;
  shippingService?: string;
  stripeSessionId: string;
  totalCents: number;
}

export async function createOrder(input: CreateOrderInput): Promise<void> {
  await writeClient.createIfNotExists({
    _id: input.orderId,
    _type: "order",
    ...input,
    status: "processing",
  });
}

export async function getOrderByIdAndEmail(orderId: string, email: string): Promise<Order | null> {
  try {
    return await client.fetch(
      `*[_type == "order" && orderId == $orderId && customerEmail == $email][0]`,
      { orderId, email }
    );
  } catch {
    return null;
  }
}

// ── Site settings ──────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(
      `*[_type == "siteSettings"][0] {
        heroHeadline,
        heroSubheadline,
        "founderPhoto": founderPhoto.asset->url,
        founderBio,
        brandStory,
        faqs[]{ question, answer },
        testimonials[]{ quote, author }
      }`
    );
  } catch {
    return null;
  }
}
