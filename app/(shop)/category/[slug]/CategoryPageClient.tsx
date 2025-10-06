// app/category/[slug]/CategoryPageClient.tsx
'use client'

import { useState, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'
import { Filter, SlidersHorizontal, X } from 'lucide-react'
import type { Product, Brand } from '@/types'

interface ProductWithImage {
  product: Product
  imageId?: string
  brandName: string
}

interface Props {
  products: ProductWithImage[]
  brands: Brand[]
  categoryName: string
}

export default function CategoryPageClient({ products, brands, categoryName }: Props) {
  const [sortBy, setSortBy] = useState<string>('featured')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [showFilters, setShowFilters] = useState(false)

  // Get unique brands from products
  const availableBrands = useMemo(() => {
    const brandIds = new Set(products.map(p => p.product.brandId))
    return brands.filter(b => brandIds.has(b.$id))
  }, [products, brands])

  // Get price range
  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 10000 }
    const prices = products.map(p => p.product.basePrice)
    return {
      minPrice: Math.floor(Math.min(...prices) / 100) * 100,
      maxPrice: Math.ceil(Math.max(...prices) / 100) * 100
    }
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filter by brand
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.product.brandId))
    }

    // Filter by price
    filtered = filtered.filter(p => 
      p.product.basePrice >= priceRange[0] && 
      p.product.basePrice <= priceRange[1]
    )

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.product.basePrice - b.product.basePrice)
        break
      case 'price-high':
        filtered.sort((a, b) => b.product.basePrice - a.product.basePrice)
        break
      case 'name':
        filtered.sort((a, b) => a.product.name.localeCompare(b.product.name))
        break
      case 'featured':
      default:
        filtered.sort((a, b) => (b.product.featured ? 1 : 0) - (a.product.featured ? 1 : 0))
        break
    }

    return filtered
  }, [products, selectedBrands, priceRange, sortBy])

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    )
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setPriceRange([minPrice, maxPrice])
  }

  const activeFiltersCount = selectedBrands.length + 
    (priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0)

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border w-full justify-center"
        >
          <SlidersHorizontal size={20} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Sidebar */}
      <aside className={`
        lg:block lg:w-64 flex-shrink-0
        ${showFilters ? 'block' : 'hidden'}
        fixed lg:sticky top-0 left-0 right-0 lg:top-24 h-screen lg:h-auto
        bg-white lg:bg-transparent z-40 lg:z-0
        overflow-y-auto lg:overflow-visible
        p-4 lg:p-0
      `}>
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h3 className="text-lg font-bold">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="pb-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Active Filters ({activeFiltersCount})
                </span>
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Brand Filter */}
          {availableBrands.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Filter size={16} />
                Brands
              </h3>
              <div className="space-y-2">
                {availableBrands.map(brand => (
                  <label key={brand.$id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.$id)}
                      onChange={() => toggleBrand(brand.$id)}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div>
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">₹{priceRange[0]}</span>
                <span className="text-gray-600">₹{priceRange[1]}</span>
              </div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={100}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || minPrice, priceRange[1]])}
                  min={minPrice}
                  max={priceRange[1]}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || maxPrice])}
                  min={priceRange[0]}
                  max={maxPrice}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Products Grid */}
      <div className="flex-1">
        {/* Sort and Results Count */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold">{products.length}</span> products
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Filter className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to see more results
              </p>
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(({ product, imageId }) => (
              <ProductCard key={product.$id} product={product} imageId={imageId} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}