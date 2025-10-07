// app/category/[slug]/page.tsx
import { api } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import CategoryPageClient from './CategoryPageClient'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = await api.getCategoryBySlug(slug)
  
  if (!category) {
    notFound()
  }

  const [products, brands] = await Promise.all([
    api.getProductsByCategory(category.$id),
    api.getBrands()
  ])
  
  const productsWithImages = await Promise.all(
    products.map(async product => {
      const images = await api.getImagesByProduct(product.$id)
      return { 
        product, 
        imageId: images[0]?.imageId,
        brandName: brands.find(b => b.$id === product.brandId)?.name || 'Unknown'
      }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-6">
            {category.imageId && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden hidden sm:block bg-white/10">
                <Image
                  src={getImageUrl(category.imageId)}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-primary-100 text-lg">{category.description}</p>
              )}
              <p className="text-primary-200 text-sm mt-2">
                {productsWithImages.length} {productsWithImages.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {productsWithImages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products available
              </h3>
              <p className="text-gray-600 mb-6">
                We're currently out of stock in this category. Check back soon for new arrivals!
              </p>
              <a
                href="/products"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse All Products
              </a>
            </div>
          </div>
        ) : (
          <CategoryPageClient 
            products={productsWithImages} 
            brands={brands}
            categoryName={category.name}
          />
        )}
      </div>
    </div>
  )
}
