
'use client'

import { useState } from 'react'
import type { Variant } from '@/types'

interface VariantSelectorProps {
  variants: Variant[]
  onSelect: (variant: Variant) => void
}

export default function VariantSelector({ variants, onSelect }: VariantSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')

  const sizes = [...new Set(variants.map(v => v.size))].sort()
  const colors = [...new Set(variants.map(v => v.color))]

  const availableColors = selectedSize
    ? [...new Set(variants.filter(v => v.size === selectedSize).map(v => v.color))]
    : colors

  const availableSizes = selectedColor
    ? [...new Set(variants.filter(v => v.color === selectedColor).map(v => v.size))].sort()
    : sizes

  const selectedVariant = variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  )

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    if (selectedColor) {
      const variant = variants.find(v => v.size === size && v.color === selectedColor)
      if (variant) onSelect(variant)
    }
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    if (selectedSize) {
      const variant = variants.find(v => v.size === selectedSize && v.color === color)
      if (variant) onSelect(variant)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Select Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => {
            const available = availableSizes.includes(size)
            return (
              <button
                key={size}
                onClick={() => available && handleSizeSelect(size)}
                disabled={!available}
                className={`px-4 py-2 border rounded-md transition-colors ${
                  selectedSize === size
                    ? 'bg-primary-600 text-white border-primary-600'
                    : available
                    ? 'border-gray-300 hover:border-primary-600'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Select Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map(color => {
            const available = availableColors.includes(color)
            return (
              <button
                key={color}
                onClick={() => available && handleColorSelect(color)}
                disabled={!available}
                className={`px-4 py-2 border rounded-md transition-colors ${
                  selectedColor === color
                    ? 'bg-primary-600 text-white border-primary-600'
                    : available
                    ? 'border-gray-300 hover:border-primary-600'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {color}
              </button>
            )
          })}
        </div>
      </div>

      {selectedVariant && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              SKU: {selectedVariant.sku}
            </span>
            <span className={`text-sm font-semibold ${
              selectedVariant.quantity > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {selectedVariant.quantity > 0
                ? `${selectedVariant.quantity} in stock`
                : 'Out of stock'}
            </span>
          </div>
          {selectedVariant.priceOverride && (
            <div className="mt-2">
              <span className="text-sm text-gray-500 line-through mr-2">
                Base Price
              </span>
              <span className="text-lg font-bold text-primary-600">
                Special Price
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}