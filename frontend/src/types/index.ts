export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  image_url?: string;
  display_image: string;
  icon: string;
  is_active: boolean;
  products_count: number;
  created_at: string;
}

export interface ProductImage {
  id: number;
  image?: string;
  image_url?: string;
  display_image: string;
  alt_text?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: number | Category;
  category_name?: string;
  category_slug?: string;
  brand: string;
  short_description: string;
  description: string;
  price: string | number;
  compare_at_price?: string | number | null;
  discount_percentage: number;
  stock_quantity: number;
  is_in_stock: boolean;
  sku: string;
  is_featured: boolean;
  is_active: boolean;
  rating: number | string;
  reviews_count: number;
  main_image?: string;
  main_image_url?: string;
  display_image: string;
  images?: ProductImage[];
  created_at: string;
  updated_at?: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  name: string;
  phone_number?: string;
  avatar?: string;
  is_admin_user: boolean;
  is_staff: boolean;
  created_at: string;
}

export interface Address {
  id: number;
  full_name: string;
  phone_number: string;
  street_address: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  is_default: boolean;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  total_price: string | number;
  created_at: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  subtotal: string | number;
  updated_at: string;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string | number;
  discount_amount?: string | number;
  min_spend: string | number;
  max_discount?: string | number | null;
}

export interface OrderItem {
  id: number;
  product?: number;
  product_name: string;
  product_image?: string;
  price: string | number;
  quantity: number;
  total_price: string | number;
}

export interface Order {
  id: number;
  order_number: string;
  user?: number;
  guest_email?: string;
  guest_name?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  status_display: string;
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
  payment_status_display: string;
  payment_method: 'cod' | 'card' | 'aba_khqr' | 'paypal';
  payment_method_display: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country: string;
  subtotal: string | number;
  discount_amount: string | number;
  shipping_fee: string | number;
  tax_amount: string | number;
  total_amount: string | number;
  coupon_code?: string | null;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  product: number;
  user?: number;
  reviewer_name: string;
  user_avatar?: string;
  rating: number;
  title?: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

