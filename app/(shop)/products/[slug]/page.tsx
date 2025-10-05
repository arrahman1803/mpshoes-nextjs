
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import ImageCarousel from '@/components/ImageCarousel'
import VariantSelector from '@/components/VariantSelector'
import { useCart } from '@/components/CartContext'
import { ShoppingCart, Star } from 'lucide-react'
import type { Product, Variant, ProductImage, Brand, Category } from '@/types'

export default function ProductDetailPage() {
  const params = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [images, setImages] = useState<ProductImage[]>([])
  const [brand, setBrand] = useState<Brand | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProduct()
  }, [params.slug])

  async function loadProduct() {
    try {
      const productData = await api.getProductBySlug(params.slug as string)
      if (!productData) {
        setLoading(false)
        return
      }

      setProduct(productData)

      const [variantsData, imagesData, brandData, categoryData] = await Promise.all([
        api.getVariantsByProduct(productData.$id),
        api.getImagesByProduct(productData.$id),
        api.getBrands().then(brands => brands.find(b => b.$id === productData.brandId)),
        api.getCategories().then(cats => cats.find(c => c.$id === productData.categoryId)),
      ])

      setVariants(variantsData)
      setImages(imagesData)
      setBrand(brandData || null)
      setCategory(categoryData || null)
    } catch (error) {
      console.error('Failed to load product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return

    addItem({
      product,
      variant: selectedVariant,
      quantity,
      image: images[0]?.imageId,
    })

    alert('Added to cart!')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const price = selectedVariant?.priceOverride || product.basePrice

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <ImageCarousel images={images} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {brand && <span>Brand: {brand.name}</span>}
              {category && <span>Category: {category.name}</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">(24 reviews)</span>
          </div>

          <div className="text-3xl font-bold text-primary-600">
            {formatPrice(price)}
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {variants.length > 0 && (
            <VariantSelector
              variants={variants}
              onSelect={setSelectedVariant}
            />
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border rounded-md hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border rounded-md hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.quantity < quantity}
              className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>

          <div className="border-t pt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Free Shipping</span>
              <span className="font-semibold">On orders over ₹2000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Returns</span>
              <span className="font-semibold">30-day return policy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery</span>
              <span className="font-semibold">3-5 business days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
