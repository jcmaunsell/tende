export interface Fragrance {
  _id: string;
  name: string;
  notes?: string;
}

export interface ProductVariant {
  fragrance: Fragrance;
  image?: string;
  price?: number;
  compareAtPrice?: number;
  stripePriceId?: string;
  inStock: boolean;
}

export interface Product {
  _id: string;
  title: string;
  subtitle?: string;
  slug: { current: string };
  tagline?: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  images?: string[];
  category?: "skincare" | "hair" | "body" | "scalp" | "accessories" | "merch";
  ingredients?: string[];
  howToUse?: string;
  inStock: boolean;
  featured?: boolean;
  stripePriceId?: string;
  variants?: ProductVariant[];
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
}

export interface Market {
  _id: string;
  name: string;
  location?: string;
  website?: string;
}

export interface SanityEvent {
  _id: string;
  title: string;
  date: string;
  image?: string;
  location?: string;
  description?: string;
  market?: Market;
}

export interface SiteSettings {
  _id: string;
  shippingBannerEnabled?: boolean;
  shippingBannerText?: string;
}

export interface HomePage {
  _id: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  testimonials?: { quote: string; author: string }[];
}

export interface AboutPage {
  _id: string;
  founderPhoto?: string;
  founderBio?: string[];
  brandStory?: string[];
}

export interface FAQPage {
  _id: string;
  items?: { question: string; answer: string }[];
}

export interface GalleryPage {
  _id: string;
  images?: { image: string; alt?: string }[];
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image?: string;
  stripePriceId: string;
  quantity: number;
  fragrance?: string;
}
