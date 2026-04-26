import { client } from "./client";
import type { Product, SanityEvent } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product"] | order(_createdAt asc) {
        _id, title, slug, tagline, description, price, compareAtPrice,
        "images": images[].asset->url,
        category, ingredients, howToUse, inStock, stripePriceId
      }`
    );
  } catch {
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product" && inStock == true][0...4] | order(_createdAt asc) {
        _id, title, slug, tagline, price,
        "images": images[].asset->url,
        category, inStock,
        variants[]{ price }
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
        _id, title, slug, tagline, description, price, compareAtPrice,
        "images": images[].asset->url,
        category, ingredients, howToUse, inStock, stripePriceId,
        variants[]{ fragrance, "image": image.asset->url, price, stripePriceId, inStock }
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
        _id, title, date, "image": coalesce(image.asset->url, imageUrl), location, description
      }`
    );
  } catch {
    return [];
  }
}
