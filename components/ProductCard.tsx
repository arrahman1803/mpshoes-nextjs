
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, getImageUrl } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  imageId?: string
}

export default function ProductCard({ product, imageId }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative aspect-square bg-gray-100">
          {imageId ? (
            <Image
              src={getImageUrl(imageId)}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(product.basePrice)}
            </span>
            {product.featured && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                Featured
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
