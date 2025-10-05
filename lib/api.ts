
import { databases, storage, ID, Query } from './appwrite'
import type { Product, Variant, ProductImage, Category, Brand } from '@/types'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const PRODUCTS_COLLECTION = process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID!
const VARIANTS_COLLECTION = process.env.NEXT_PUBLIC_VARIANTS_COLLECTION_ID!
const IMAGES_COLLECTION = process.env.NEXT_PUBLIC_PRODUCT_IMAGES_COLLECTION_ID!
const CATEGORIES_COLLECTION = process.env.NEXT_PUBLIC_CATEGORIES_COLLECTION_ID!
const BRANDS_COLLECTION = process.env.NEXT_PUBLIC_BRANDS_COLLECTION_ID!

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
}