import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, getImageUrl } from '@/lib/utils'
import { Star, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  imageId?: string
  viewMode?: 'grid' | 'list'
}

export default function ProductCard({ product, imageId, viewMode = 'grid' }: ProductCardProps) {
  // List View Layout
  if (viewMode === 'list') {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="flex gap-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4"
      >
        <div className="relative w-32 h-32 flex-shrink-0">
          {imageId ? (
            <Image
              src={getImageUrl(imageId)}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <ShoppingCart size={32} className="text-gray-400" />
            </div>
          )}
          {product.featured && (
            <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Featured
            </span>
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product.description}</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">(24)</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-primary-600">
              {formatPrice(product.basePrice)}
            </p>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold">
              View Details
            </button>
          </div>
        </div>
      </Link>
    )
  }

  // Grid View Layout (Default)
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden">
        {imageId ? (
          <Image
            src={getImageUrl(imageId)}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <ShoppingCart size={48} className="text-gray-400" />
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            Featured
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">(24)</span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-primary-600">
            {formatPrice(product.basePrice)}
          </p>
          <button className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </Link>
  )
}
