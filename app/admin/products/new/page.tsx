
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { databases, ID } from '@/lib/appwrite'
import { api } from '@/lib/api'
import { slugify } from '@/lib/utils'
import ImageUpload from '@/components/ImageUpload'
import { X, Plus } from 'lucide-react'
import type { Category, Brand } from '@/types'

interface Variant {
  size: string
  color: string
  sku: string
  quantity: number
  priceOverride: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [imageIds, setImageIds] = useState<string[]>([])
  const [variants, setVariants] = useState<Variant[]>([
    { size: '', color: '', sku: '', quantity: 0, priceOverride: '' },
  ])
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
  }, [])

  async function loadData() {
    const [categoriesData, brandsData] = await Promise.all([
      api.getCategories(),
      api.getBrands(),
    ])
    setCategories(categoriesData)
    setBrands(brandsData)
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

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: keyof Variant, value: string) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
      const PRODUCTS_COLLECTION = process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID!
      const VARIANTS_COLLECTION = process.env.NEXT_PUBLIC_VARIANTS_COLLECTION_ID!
      const IMAGES_COLLECTION = process.env.NEXT_PUBLIC_PRODUCT_IMAGES_COLLECTION_ID!

      // Create product
      const product = await databases.createDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION,
        ID.unique(),
        {
          ...formData,
          basePrice: parseFloat(formData.basePrice),
        }
      )

      // Create variants
      for (const variant of variants) {
        if (variant.size && variant.color && variant.sku) {
          await databases.createDocument(
            DATABASE_ID,
            VARIANTS_COLLECTION,
            ID.unique(),
            {
              productId: product.$id,
              size: variant.size,
              color: variant.color,
              sku: variant.sku,
              quantity: parseInt(variant.quantity.toString()),
              priceOverride: variant.priceOverride ? parseFloat(variant.priceOverride) : null,
            }
          )
        }
      }

      // Create product images
      for (let i = 0; i < imageIds.length; i++) {
        await databases.createDocument(
          DATABASE_ID,
          IMAGES_COLLECTION,
          ID.unique(),
          {
            productId: product.$id,
            imageId: imageIds[i],
            order: i,
          }
        )
      }

      router.push('/admin/products')
    } catch (error) {
      console.error('Failed to create product:', error)
      alert('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

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
          <ImageUpload
            multiple
            onUpload={fileId => setImageIds([...imageIds, fileId])}
          />
          {imageIds.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                {imageIds.length} image(s) uploaded
              </p>
            </div>
          )}
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
                  <h3 className="font-semibold">Variant {index + 1}</h3>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <input
                    type="text"
                    placeholder="Size (e.g., 42)"
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
            disabled={loading}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Product'}
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
