import { client } from "./client";
import type { Product, SanityEvent } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
  return client.fetch(
    `*[_type == "product"] | order(_createdAt asc) {
      _id, title, slug, tagline, description, price, compareAtPrice,
      "images": images[].asset->url,
      category, ingredients, howToUse, inStock, stripePriceId
    }`
  );
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return client.fetch(
    `*[_type == "product" && inStock == true][0...4] | order(_createdAt asc) {
      _id, title, slug, tagline, price,
      "images": images[].asset->url,
      category, inStock
    }`
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      _id, title, slug, tagline, description, price, compareAtPrice,
      "images": images[].asset->url,
      category, ingredients, howToUse, inStock, stripePriceId
    }`,
    { slug }
  );
}

export async function getAllEvents(): Promise<SanityEvent[]> {
  return client.fetch(
    `*[_type == "event"] | order(date asc) {
      _id, title, date, location, description
    }`
  );
}
