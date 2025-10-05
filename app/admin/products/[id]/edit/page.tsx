
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { databases, ID, Query } from '@/lib/appwrite'
import { api } from '@/lib/api'
import { slugify, getImageUrl } from '@/lib/utils'
import ImageUpload from '@/components/ImageUpload'
import { X, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import type { Product, Category, Brand, Variant, ProductImage } from '@/types'

interface VariantForm {
  $id?: string
  size: string
  color: string
  sku: string
  quantity: number
  priceOverride: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])
  const [newImageIds, setNewImageIds] = useState<string[]>([])
  const [variants, setVariants] = useState<VariantForm[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    basePrice: '',
    categoryId: '',
    brandId: '',
    isActive: true,
    featured: false,
  })

  useEffect(() => {
    loadData()
  }, [params.id])

  async function loadData() {
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
      const PRODUCTS_COLLECTION = process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID!

      const [categoriesData, brandsData, productData] = await Promise.all([
        api.getCategories(),
        api.getBrands(),
        databases.getDocument(DATABASE_ID, PRODUCTS_COLLECTION, params.id as string),
      ])

      const product = productData as Product
      setProduct(product)
      setCategories(categoriesData)
      setBrands(brandsData)

      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        basePrice: product.basePrice.toString(),
        categoryId: product.categoryId,
        brandId: product.brandId,
        isActive: product.isActive,
        featured: product.featured,
      })

      const [variantsData, imagesData] = await Promise.all([
        api.getVariantsByProduct(product.$id),
        api.getImagesByProduct(product.$id),
      ])

      setVariants(
        variantsData.map(v => ({
          $id: v.$id,
          size: v.size,
          color: v.color,
          sku: v.sku,
          quantity: v.quantity,
          priceOverride: v.priceOverride?.toString() || '',
        }))
      )

      setExistingImages(imagesData)
    } catch (error) {
      console.error('Failed to load product:', error)
      alert('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))

    if (name === 'name') {
      setFormData(prev => ({ ...prev, slug: slugify(value) }))
    }
  }

  const addVariant = () => {
    setVariants([...variants, { size: '', color: '', sku: '', quantity: 0, priceOverride: '' }])
  }

  const removeVariant = async (index: number) => {
    const variant = variants[index]
    if (variant.$id) {
      if (!confirm('Delete this variant?')) return
      try {
        const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
        const VARIANTS_COLLECTION = process.env.NEXT_PUBLIC_VARIANTS_COLLECTION_ID!
        await databases.deleteDocument(DATABASE_ID, VARIANTS_COLLECTION, variant.$id)
      } catch (error) {
        console.error('Failed to delete variant:', error)
      }
    }
    setVariants(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: keyof VariantForm, value: string) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const removeExistingImage = async (imageId: string, fileId: string) => {
    if (!confirm('Delete this image?')) return
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
      const IMAGES_COLLECTION = process.env.NEXT_PUBLIC_PRODUCT_IMAGES_COLLECTION_ID!
      
      await databases.deleteDocument(DATABASE_ID, IMAGES_COLLECTION, imageId)
      await api.deleteFile(fileId)
      setExistingImages(existingImages.filter(img => img.$id !== imageId))
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
      const PRODUCTS_COLLECTION = process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID!
      const VARIANTS_COLLECTION = process.env.NEXT_PUBLIC_VARIANTS_COLLECTION_ID!
      const IMAGES_COLLECTION = process.env.NEXT_PUBLIC_PRODUCT_IMAGES_COLLECTION_ID!

      // Update product
      await databases.updateDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION,
        params.id as string,
        {
          ...formData,
          basePrice: parseFloat(formData.basePrice),
        }
      )

      // Update/create variants
      for (const variant of variants) {
        if (variant.size && variant.color && variant.sku) {
          const data = {
            productId: params.id as string,
            size: variant.size,
            color: variant.color,
            sku: variant.sku,
            quantity: parseInt(variant.quantity.toString()),
            priceOverride: variant.priceOverride ? parseFloat(variant.priceOverride) : null,
          }

          if (variant.$id) {
            await databases.updateDocument(DATABASE_ID, VARIANTS_COLLECTION, variant.$id, data)
          } else {
            await databases.createDocument(DATABASE_ID, VARIANTS_COLLECTION, ID.unique(), data)
          }
        }
      }

      // Add new images
      const currentOrder = existingImages.length
      for (let i = 0; i < newImageIds.length; i++) {
        await databases.createDocument(
          DATABASE_ID,
          IMAGES_COLLECTION,
          ID.unique(),
          {
            productId: params.id as string,
            imageId: newImageIds[i],
            order: currentOrder + i,
          }
        )
      }

      router.push('/admin/products')
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button
          onClick={() => router.push('/admin/products')}
          className="text-primary-600 hover:text-primary-700"
        >
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Base Price *
              </label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.$id} value={cat.$id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Brand *</label>
              <select
                name="brandId"
                value={formData.brandId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.$id} value={brand.$id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm font-semibold">Active</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm font-semibold">Featured</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Product Images</h2>
          
          {existingImages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Current Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map(img => (
                  <div key={img.$id} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl(img.imageId)}
                        alt={img.altText || 'Product'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.$id, img.imageId)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-3">Add New Images</h3>
            <ImageUpload
              multiple
              onUpload={fileId => setNewImageIds([...newImageIds, fileId])}
            />
            {newImageIds.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {newImageIds.length} new image(s) ready to upload
              </p>
            )}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Variant
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">
                    Variant {index + 1} {variant.$id && '(Existing)'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <input
                    type="text"
                    placeholder="Size"
                    value={variant.size}
                    onChange={e => updateVariant(index, 'size', e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Color"
                    value={variant.color}
                    onChange={e => updateVariant(index, 'color', e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="SKU"
                    value={variant.sku}
                    onChange={e => updateVariant(index, 'sku', e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={variant.quantity}
                    onChange={e => updateVariant(index, 'quantity', e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Price Override"
                    value={variant.priceOverride}
                    onChange={e => updateVariant(index, 'priceOverride', e.target.value)}
                    step="0.01"
                    className="px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Update Product'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}