
import Link from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { ArrowRight } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

export default async function HomePage() {
  const [featuredProducts, categories, brands] = await Promise.all([
    api.getFeaturedProducts(),
    api.getCategories(),
    api.getBrands(),
  ])

  const productsWithImages = await Promise.all(
    featuredProducts.map(async product => {
      const images = await api.getImagesByProduct(product.$id)
      return { product, imageId: images[0]?.imageId }
    })
  )

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Step Into Style with MPShoes
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Discover the perfect pair for every occasion. Quality footwear that combines comfort and style.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.slice(0, 3).map(category => (
            <Link
              key={category.$id}
              href={`/category/${category.slug}`}
              className="group relative h-64 rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              {category.imageId && (
                <Image
                  src={getImageUrl(category.imageId)}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-white/90">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              href="/products"
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
            >
              View All
              <ArrowRight className="ml-1" size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsWithImages.slice(0, 8).map(({ product, imageId }) => (
              <ProductCard key={product.$id} product={product} imageId={imageId} />
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Brands</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brands.map(brand => (
            <Link
              key={brand.$id}
              href={`/brand/${brand.slug}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow flex items-center justify-center"
            >
              {brand.logoId ? (
                <div className="relative w-full h-16">
                  <Image
                    src={getImageUrl(brand.logoId)}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <span className="font-semibold text-gray-700">{brand.name}</span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">Premium materials and craftsmanship</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over ₹2000</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
