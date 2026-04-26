import { client } from "./client";
import type { Product, SanityEvent, SiteSettings } from "@/types";

const FRAGRANCE_PROJECTION = `fragrance->{ _id, name, notes }`;

export async function getAllProducts(): Promise<Product[]> {
  try {
    return await client.fetch(
      `*[_type == "product"] | order(_createdAt asc) {
        _id, title, slug, tagline, description, price, compareAtPrice,
        "images": images[].asset->url,
        category, ingredients, howToUse, inStock, stripePriceId,
        variants[]{ "fragrance": ${FRAGRANCE_PROJECTION}, price, compareAtPrice }
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
        variants[]{ "fragrance": ${FRAGRANCE_PROJECTION}, price, compareAtPrice }
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
        variants[]{ "fragrance": ${FRAGRANCE_PROJECTION}, "image": image.asset->url, price, compareAtPrice, stripePriceId, inStock }
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

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(
      `*[_type == "siteSettings"][0] {
        "founderPhoto": founderPhoto.asset->url,
        founderBio,
        faqs[]{ question, answer },
        testimonials[]{ quote, author }
      }`
    );
  } catch {
    return null;
  }
}
