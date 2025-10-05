
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

interface ImageCarouselProps {
  images: Array<{ imageId: string; altText?: string }>
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex(current => (current === 0 ? images.length - 1 : current - 1))
  }

  const goToNext = () => {
    setCurrentIndex(current => (current === images.length - 1 ? 0 : current + 1))
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <Image
          src={getImageUrl(images[currentIndex].imageId)}
          alt={images[currentIndex].altText || 'Product image'}
          fill
          className="object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.imageId}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                index === currentIndex ? 'border-primary-600' : 'border-gray-200'
              }`}
            >
              <Image
                src={getImageUrl(image.imageId)}
                alt={image.altText || 'Thumbnail'}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}