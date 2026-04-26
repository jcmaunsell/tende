export interface ProductVariant {
  fragrance: string;
  image?: string;
  stripePriceId?: string;
  inStock: boolean;
}

export interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  tagline?: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  images?: string[];
  category?: "hair" | "body" | "scalp";
  ingredients?: string[];
  howToUse?: string;
  inStock: boolean;
  stripePriceId?: string;
  variants?: ProductVariant[];
}

export interface SanityEvent {
  _id: string;
  title: string;
  date: string;
  location?: string;
  description?: string;
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
