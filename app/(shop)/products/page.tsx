'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { SlidersHorizontal, Grid, List, Loader2 } from 'lucide-react'
import type { Product, Category, Brand } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, products])

  const loadData = async () => {
    try {
      const [productsData, categoriesData, brandsData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getBrands()
      ])
      setProducts(productsData)
      setFilteredProducts(productsData)
      setCategories(categoriesData)
      setBrands(brandsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(p => p.categoryId === filters.category)
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter(p => p.brandId === filters.brand)
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.basePrice >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.basePrice <= Number(filters.maxPrice))
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.basePrice - b.basePrice)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.basePrice - a.basePrice)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    setFilteredProducts(filtered)
  }

  const resetFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest'
    })
  }

  const [productsWithImages, setProductsWithImages] = useState<Array<{product: Product, imageId?: string}>>([])

  useEffect(() => {
    const loadImages = async () => {
      const results = await Promise.all(
        filteredProducts.map(async product => {
          const images = await api.getImagesByProduct(product.$id)
          return { product, imageId: images[0]?.imageId }
        })
      )
      setProductsWithImages(results)
    }
    if (filteredProducts.length > 0) {
      loadImages()
    }
  }, [filteredProducts])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary-600" size={48} />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <SlidersHorizontal size={20} />
                Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Reset
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={e => setFilters({...filters, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.$id} value={cat.$id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2">Brand</label>
                <select
                  value={filters.brand}
                  onChange={e => setFilters({...filters, brand: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand.$id} value={brand.$id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={e => setFilters({...filters, minPrice: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={e => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">All Products</h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={filters.sortBy}
                onChange={e => setFilters({...filters, sortBy: e.target.value})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>

              {/* View Toggle */}
              <div className="flex border rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No products found matching your filters</p>
              <button
                onClick={resetFilters}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {productsWithImages.map(({ product, imageId }) => (
                <ProductCard 
                  key={product.$id} 
                  product={product} 
                  imageId={imageId}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}