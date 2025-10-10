import Link from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { ArrowRight, TrendingUp, Award, Truck, ShieldCheck } from 'lucide-react'
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
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <TrendingUp size={16} />
                <span className="text-sm font-medium">New Collection 2025</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Step Into Style with <span className="text-yellow-300">MPShoes</span>
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-primary-100 leading-relaxed">
                Discover the perfect pair for every occasion. Quality footwear that combines comfort, style, and durability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center bg-gray-900 text-blue-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-lg"
                >
                  Shop Now
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  href="/category/new-arrivals"
                  className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  New Arrivals
                </Link>
              </div>
            </div>
            {/* <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="aspect-square bg-white/20 rounded-2xl"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 sm:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: Award,
                title: 'Premium Quality',
                description: 'Only the finest materials',
                color: 'text-yellow-600 bg-yellow-50'
              },
              {
                icon: Truck,
                title: 'Free Shipping',
                description: 'On orders over ₹2000',
                color: 'text-green-600 bg-green-50'
              },
              {
                icon: ShieldCheck,
                title: 'Secure Payment',
                description: '100% protected transactions',
                color: 'text-blue-600 bg-blue-50'
              },
              {
                icon: ArrowRight,
                title: 'Easy Returns',
                description: '30-day return policy',
                color: 'text-purple-600 bg-purple-50'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of footwear collections designed for every style and occasion
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map(category => (
              <Link
                key={category.$id}
                href={`/category/${category.slug}`}
                className="group relative h-64 sm:h-72 lg:h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                {category.imageId ? (
                  <Image
                    src={getImageUrl(category.imageId)}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600" />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 transform group-hover:translate-y-[-4px] transition-transform">
                    {category.name}
                  </h3>
                  <p className="text-white/90 text-sm mb-3 line-clamp-2">{category.description}</p>
                  <div className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                    Explore Collection
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked favorites from our latest collection</p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group"
            >
              View All Products
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {productsWithImages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No featured products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsWithImages.slice(0, 8).map(({ product, imageId }) => (
                <ProductCard key={product.$id} product={product} imageId={imageId} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brands Section */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Popular Brands</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Shop from the world's most trusted footwear brands
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {brands.map(brand => (
              <Link
                key={brand.$id}
                href={`/brand/${brand.slug}`}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center group"
              >
                {brand.logoId ? (
                  <div className="relative w-full h-16">
                    <Image
                      src={getImageUrl(brand.logoId)}
                      alt={brand.name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                ) : (
                  <span className="font-semibold text-gray-700 group-hover:text-primary-600 transition-colors">
                    {brand.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Find Your Perfect Pair?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who've found their ideal footwear with MPShoes
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
          >
            Start Shopping
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </div>
  )
}