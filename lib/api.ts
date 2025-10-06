
import { databases, storage, ID, Query } from './appwrite'
import type { Product, Variant, ProductImage, Category, Brand } from '@/types'
import type { Order, OrderItem } from '@/types'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const PRODUCTS_COLLECTION = process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID!
const VARIANTS_COLLECTION = process.env.NEXT_PUBLIC_VARIANTS_COLLECTION_ID!
const IMAGES_COLLECTION = process.env.NEXT_PUBLIC_PRODUCT_IMAGES_COLLECTION_ID!
const CATEGORIES_COLLECTION = process.env.NEXT_PUBLIC_CATEGORIES_COLLECTION_ID!
const BRANDS_COLLECTION = process.env.NEXT_PUBLIC_BRANDS_COLLECTION_ID!

const ORDERS_COLLECTION = process.env.NEXT_PUBLIC_ORDERS_COLLECTION_ID!
const ORDER_ITEMS_COLLECTION = process.env.NEXT_PUBLIC_ORDER_ITEMS_COLLECTION_ID!

export const orderApi = {
  // Get all orders
  async getOrders(limit = 100) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION,
      // [Query.orderDesc('createdAt'), Query.limit(limit)]
    )
    return response.documents as Order[]
  },

  // Get order by ID
  async getOrderById(orderId: string) {
    const order = await databases.getDocument(
      DATABASE_ID,
      ORDERS_COLLECTION,
      orderId
    )
    return order as Order
  },

  // Get orders by user
  async getOrdersByUser(userId: string) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION,
      [Query.equal('userId', userId) ]
    // Query.orderDesc('createdAt')
    )
    return response.documents as Order[]
  },

  // Get orders by status
  async getOrdersByStatus(status: Order['status']) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION,
      [Query.equal('status', status), Query.orderDesc('createdAt')]
    )
    return response.documents as Order[]
  },

  // Create order
  async createOrder(orderData: Omit<Order, '$id' | 'createdAt'>) {
    const order = await databases.createDocument(
      DATABASE_ID,
      ORDERS_COLLECTION,
      ID.unique(),
      {
        ...orderData,
        createdAt: new Date().toISOString(),
      }
    )
    return order as Order
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']) {
    const order = await databases.updateDocument(
      DATABASE_ID,
      ORDERS_COLLECTION,
      orderId,
      { status }
    )
    return order as Order
  },

  // Get order items
  async getOrderItems(orderId: string) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDER_ITEMS_COLLECTION,
      [Query.equal('orderId', orderId)]
    )
    return response.documents as OrderItem[]
  },

  // Create order item
  async createOrderItem(itemData: Omit<OrderItem, '$id'>) {
    const item = await databases.createDocument(
      DATABASE_ID,
      ORDER_ITEMS_COLLECTION,
      ID.unique(),
      itemData
    )
    return item as OrderItem
  },

  // Update variant quantity (decrease after order)
  async updateVariantQuantity(variantId: string, quantityChange: number) {
    const variant = await databases.getDocument(
      DATABASE_ID,
      VARIANTS_COLLECTION,
      variantId
    )
    
    const newQuantity = Math.max(0, variant.quantity + quantityChange)
    
    await databases.updateDocument(
      DATABASE_ID,
      VARIANTS_COLLECTION,
      variantId,
      { quantity: newQuantity }
    )
  },

  // Get order statistics
  async getOrderStats() {
    const orders = await this.getOrders(1000)
    
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0),
    }
    
    return stats
  },
}
export const api = {
  // Products
  async getProducts(limit = 50) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION,
      [Query.equal('isActive', true), Query.limit(limit)]
    )
    return response.documents as Product[]
  },

  async getProductBySlug(slug: string) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION,
      [Query.equal('slug', slug)]
    )
    return response.documents[0] as Product | undefined
  },

  async getProductsByCategory(categoryId: string) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION,
      [Query.equal('categoryId', categoryId), Query.equal('isActive', true)]
    )
    return response.documents as Product[]
  },

  async getProductsByBrand(brandId: string) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION,
      [Query.equal('brandId', brandId), Query.equal('isActive', true)]
    )
    return response.documents as Product[]
  },

  async getFeaturedProducts() {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION,
      [Query.equal('featured', true), Query.equal('isActive', true)]
    )
    return response.documents as Product[]
  },

  // Variants
  async getVariantsByProduct(productId: string) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      VARIANTS_COLLECTION,
      [Query.equal('productId', productId)]
    )
    return response.documents as Variant[]
  },

  // Images
  async getImagesByProduct(productId: string) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      IMAGES_COLLECTION,
      [Query.equal('productId', productId), Query.orderAsc('order')]
    )
    return response.documents as ProductImage[]
  },

  // Categories
  async getCategories() {
    const response = await databases.listDocuments(
      DATABASE_ID,
      CATEGORIES_COLLECTION
    )
    return response.documents as Category[]
  },

  async getCategoryBySlug(slug: string) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      CATEGORIES_COLLECTION,
      [Query.equal('slug', slug)]
    )
    return response.documents[0] as Category | undefined
  },

  // Brands
  async getBrands() {
    const response = await databases.listDocuments(
      DATABASE_ID,
      BRANDS_COLLECTION
    )
    return response.documents as Brand[]
  },

  async getBrandBySlug(slug: string) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      BRANDS_COLLECTION,
      [Query.equal('slug', slug)]
    )
    return response.documents[0] as Brand | undefined
  },

  // Storage
  async uploadFile(file: File) {
    const response = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      ID.unique(),
      file
    )
    return response.$id
  },

  async deleteFile(fileId: string) {
    await storage.deleteFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      fileId
    )
  },
// Search products by name
async searchProducts(query: string) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION,
      [
        Query.search('name', query),
        Query.equal('isActive', true),
        Query.limit(50)
      ]
    )
    return response.documents as Product[]
  } catch (error) {
    console.error('Search error:', error)
    // Fallback to client-side filtering if search fails
    const allProducts = await this.getProducts(100)
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    )
  }
}
  
}