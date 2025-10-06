'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { formatPrice, getImageUrl } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'

interface SearchResult extends Product {
  image?: string
}

export default function SearchBar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const products = await api.searchProducts(query)
        const resultsWithImages = await Promise.all(
          products.slice(0, 5).map(async product => {
            const images = await api.getImagesByProduct(product.$id)
            return { ...product, image: images[0]?.imageId }
          })
        )
        setResults(resultsWithImages)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
  }

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          className="w-full sm:w-64 lg:w-80 px-4 py-2 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full sm:w-96 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary-600" size={24} />
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2">
                {results.map(product => (
                  <Link
                    key={product.$id}
                    href={`/product/${product.slug}`}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {product.image ? (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <Search size={20} className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-primary-600 font-semibold text-sm">
                        {formatPrice(product.basePrice)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="border-t p-2">
                <button
                  onClick={handleSubmit}
                  className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2"
                >
                  View all results for "{query}"
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No products found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}