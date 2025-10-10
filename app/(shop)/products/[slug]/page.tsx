'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import ImageCarousel from '@/components/ImageCarousel'
import VariantSelector from '@/components/VariantSelector'
import { useCart } from '@/components/CartContext'
import { ShoppingCart, Star, Heart, Share2, Truck, RefreshCw, Shield, ArrowLeft, Check,Home } from 'lucide-react'
import Link from 'next/link'
import type { Product, Variant, ProductImage, Brand, Category } from '@/types'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [images, setImages] = useState<ProductImage[]>([])
  const [brand, setBrand] = useState<Brand | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)

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

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center bg-white rounded-lg shadow-md p-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const price = selectedVariant?.priceOverride || product.basePrice
  const inStock = selectedVariant ? selectedVariant.quantity > 0 : variants.some(v => v.quantity > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap">
          <Home className="text-blue-500" size={16} />
          <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-600 transition-colors">Products</Link>
          {category && (
            <>
              <span>/</span>
              <Link href={`/category/${category.slug}`} className="hover:text-primary-600 transition-colors">
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ImageCarousel images={images} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  {brand && (
                    <Link 
                      href={`/brand/${brand.slug}`}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-2 inline-block"
                    >
                      {brand.name}
                    </Link>
                  )}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
                  <Heart size={24} className="text-gray-400 hover:text-red-500" />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
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

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-primary-600">
                  {formatPrice(price)}
                </span>
                {selectedVariant?.priceOverride && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {inStock ? (
                  <span className="inline-flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                    <Check size={16} />
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="bg-white rounded-lg p-6">
                <VariantSelector
                  variants={variants}
                  onSelect={setSelectedVariant}
                />
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg"
                  >
                    -
                  </button>
                  <span className="text-2xl font-semibold w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant?.quantity || 99, quantity + 1))}
                    className="w-12 h-12 border-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg"
                    disabled={!selectedVariant || quantity >= selectedVariant.quantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.quantity < quantity || !inStock}
                className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-colors text-lg"
              >
                {addedToCart ? (
                  <>
                    <Check size={24} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={24} />
                    Add to Cart
                  </>
                )}
              </button>

              <button className="w-full bg-gray-100 text-gray-900 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Truck className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Free Shipping</h4>
                    <p className="text-xs text-gray-600">On orders over ₹2000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <RefreshCw className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Easy Returns</h4>
                    <p className="text-xs text-gray-600">30-day return policy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Shield className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Secure Payment</h4>
                    <p className="text-xs text-gray-600">100% secure transactions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Truck className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Fast Delivery</h4>
                    <p className="text-xs text-gray-600">3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm font-medium text-gray-600">Share this product:</span>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}