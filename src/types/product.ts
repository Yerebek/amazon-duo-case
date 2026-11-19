export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
}

export interface RatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface Product {
  id: string;
  asin: string;
  brand: string;
  title: string;
  price: number;
  listPrice?: number;
  rating: number;
  reviewCount: number;
  boughtPastMonth?: string;
  badge?: "Amazon's Choice" | "Best Seller" | "Limited time deal";
  isPrime: boolean;
  deliveryTomorrow: boolean;
  deliveryText: string;
  freeDeliveryThresholdText?: string;
  compatibleModels: string[];
  features: string[];
  colors: ColorVariant[];
  image: string;
  category: string;
  releaseOrder: number;
  bullets: string[];
  ratingBreakdown: RatingBreakdown;
  seller: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedModel: string;
  quantity: number;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest';

export interface FilterState {
  query: string;
  department: string;
  deliveryTomorrowOnly: boolean;
  primeOnly: boolean;
  minRating: number;
  brands: string[];
  priceRange: [number | null, number | null];
  models: string[];
  features: string[];
}

export interface DeliveryLocation {
  country: string;
  city: string;
  postalCode: string;
}

export interface OrderRecord {
  orderId: string;
  date: string;
  total: number;
  status: string;
  deliveryAddress: string;
  items: CartItem[];
}
