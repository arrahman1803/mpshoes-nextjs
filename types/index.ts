
export interface Product {
  $id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  categoryId: string;
  brandId: string;
  featured: boolean;
  createdAt: string;
}

export interface Variant {
  $id: string;
  productId: string;
  size: string;
  color: string;
  sku: string;
  quantity: number;
  priceOverride?: number;
}

export interface ProductImage {
  $id: string;
  productId: string;
  imageId: string;
  altText?: string;
  order: number;
}

export interface Category {
  $id: string;
  name: string;
  slug: string;
  description?: string;
  imageId?: string;
}

export interface Brand {
  $id: string;
  name: string;
  slug: string;
  logoId?: string;
  description?: string;
}

export interface Order {
  $id: string;
  userId: string;
  email: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface OrderItem {
  $id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Review {
  $id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  variant: Variant;
  quantity: number;
  image?: string;
}

export interface ProductWithDetails extends Product {
  category?: Category;
  brand?: Brand;
  variants?: Variant[];
  images?: ProductImage[];
  reviews?: Review[];
}