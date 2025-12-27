// Product Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  parent: number | null;
  children: Category[];
  is_active: boolean;
  product_count: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string;
  is_active: boolean;
  product_count: number;
}

export interface AttributeValue {
  id: number;
  attribute: number;
  attribute_name: string;
  value: string;
  slug: string;
  color_code: string;
}

export interface ProductVariation {
  id: number;
  attribute_values: AttributeValue[];
  price_override: number | null;
  price: number;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  image: string | null;
  variation_name: string;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  base_price: number;
  sale_price: number | null;
  current_price: number;
  discount_percentage: number;
  category: Category | number;
  category_name?: string;
  brand: Brand | number | null;
  brand_name?: string;
  attributes: AttributeValue[];
  main_image: string;
  images: ProductImage[];
  variations: ProductVariation[];
  variations_summary?: Record<string, { id: number; value: string; color_code: string }[]>;
  sku: string | null;
  stock_quantity: number;
  is_in_stock: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  allow_financing: boolean;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

// Cart Types
export interface CartItem {
  id: number;
  product: Product;
  variation: ProductVariation | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  added_at: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
  total_items: number;
  created_at: string;
  updated_at: string;
}

// Order Types
export interface OrderItem {
  id: number;
  product: number | null;
  product_name: string;
  variation_details: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  full_name: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_county: string;
  shipping_postal_code: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  customer_notes: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

// Financing Types
export interface Sacco {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string;
  is_active: boolean;
}

export interface PaymentTimeline {
  id: number;
  months: number;
  label: string;
  is_active: boolean;
}

export interface FinancingRequest {
  id: number;
  request_number: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  email: string;
  national_id: string;
  town_of_residence: string;
  product: number;
  product_name: string;
  variation_details: string;
  product_price: number;
  sacco: number;
  sacco_name: string;
  payment_timeline: number;
  payment_months: number;
  monthly_payment: number | null;
  customer_notes: string;
  created_at: string;
  updated_at: string;
}

// Blog Types
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  post_count: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featured_image: string | null;
  category: BlogCategory | number | null;
  category_name?: string;
  author: number | null;
  author_name?: string;
  status: 'draft' | 'published' | 'archived';
  meta_title: string;
  meta_description: string;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// User Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  date_of_birth: string | null;
  profile_image: string | null;
  address: string;
  city: string;
  county: string;
  postal_code: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  date_joined: string;
  updated_at: string;
}

export interface Address {
  id: number;
  address_type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  county: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Homepage Slider Type
export interface HomepageSlider {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  mobile_image: string | null;
  button_text: string;
  button_link: string;
  order: number;
  is_active: boolean;
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
