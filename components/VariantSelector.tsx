// 'use client'

// import { useState } from 'react'
// import type { Variant } from '@/types'

// interface VariantSelectorProps {
//   variants: Variant[]
//   onSelect: (variant: Variant | null) => void
// }

// export default function VariantSelector({ variants, onSelect }: VariantSelectorProps) {
//   const [selectedSize, setSelectedSize] = useState<string>('')
//   const [selectedColor, setSelectedColor] = useState<string>('')

//   const sizes = [...new Set(variants.map(v => v.size))].sort()
//   const colors = [...new Set(variants.map(v => v.color))]

//   const availableColors = selectedSize
//     ? [...new Set(variants.filter(v => v.size === selectedSize).map(v => v.color))]
//     : colors

//   const availableSizes = selectedColor
//     ? [...new Set(variants.filter(v => v.color === selectedColor).map(v => v.size))].sort()
//     : sizes

//   const selectedVariant = variants.find(
//     v => v.size === selectedSize && v.color === selectedColor
//   )

//   // const handleSizeSelect = (size: string) => {
//   //   setSelectedSize(size)
//   //   if (selectedColor) {
//   //     const variant = variants.find(v => v.size === size && v.color === selectedColor)
//   //     if (variant) onSelect(variant)
//   //   }
//   // }
//   // Handle size selection
//   const handleSizeSelect = (size: string) => {
//     if (size === selectedSize) {
//       // Deselect size if already selected
//       setSelectedSize('')
//       setSelectedColor('') // Clear color selection when size is deselected
//       onSelect(null) // Reset variant selection in the parent
//     } else {
//       setSelectedSize(size)
//       if (selectedColor) {
//         const variant = variants.find(v => v.size === size && v.color === selectedColor)
//         if (variant) onSelect(variant) // Select the variant
//       }
//     }
//   }

//   // const handleColorSelect = (color: string) => {
//   //   setSelectedColor(color)
//   //   if (selectedSize) {
//   //     const variant = variants.find(v => v.size === selectedSize && v.color === color)
//   //     if (variant) onSelect(variant)
//   //   }
//   // }
//    // Handle color selection
//   const handleColorSelect = (color: string) => {
//     if (color === selectedColor) {
//       // Deselect color if already selected
//       setSelectedColor('')
//       setSelectedSize('') // Clear size selection when color is deselected
//       onSelect(null) // Reset variant selection in the parent
//     } else {
//       setSelectedColor(color)
//       if (selectedSize) {
//         const variant = variants.find(v => v.size === selectedSize && v.color === color)
//         if (variant) onSelect(variant) // Select the variant
//       }
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-sm font-semibold mb-3">Select Size</h3>
//         <div className="flex flex-wrap gap-2">
//           {sizes.map(size => {
//             const available = availableSizes.includes(size)
//             return (
//               <button
//                 key={size}
//                 onClick={() => available && handleSizeSelect(size)}
//                 disabled={!available}
//                 className={`px-4 py-2 border rounded-md transition-colors ${
//                   selectedSize === size
//                     ? 'bg-primary-600 text-white border-primary-600'
//                     : available
//                     ? 'border-gray-300 hover:border-primary-600'
//                     : 'border-gray-200 text-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 {size}
//               </button>
//             )
//           })}
//         </div>
//       </div>

//       <div>
//         <h3 className="text-sm font-semibold mb-3">Select Color</h3>
//         <div className="flex flex-wrap gap-2">
//           {colors.map(color => {
//             const available = availableColors.includes(color)
//             return (
//               <button
//                 key={color}
//                 onClick={() => available && handleColorSelect(color)}
//                 disabled={!available}
//                 className={`px-4 py-2 border rounded-md transition-colors ${
//                   selectedColor === color
//                     ? 'bg-primary-600 text-white border-primary-600'
//                     : available
//                     ? 'border-gray-300 hover:border-primary-600'
//                     : 'border-gray-200 text-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 {color}
//               </button>
//             )
//           })}
//         </div>
//       </div>

//       {selectedVariant && (
//         <div className="p-4 bg-gray-50 rounded-lg">
//           <div className="flex justify-between items-center">
//             <span className="text-sm text-gray-600">
//               SKU: {selectedVariant.sku}
//             </span>
//             <span className={`text-sm font-semibold ${
//               selectedVariant.quantity > 0 ? 'text-green-600' : 'text-red-600'
//             }`}>
//               {selectedVariant.quantity > 0
//                 ? `${selectedVariant.quantity} in stock`
//                 : 'Out of stock'}
//             </span>
//           </div>
//           {selectedVariant.priceOverride && (
//             <div className="mt-2">
//               <span className="text-sm text-gray-500 line-through mr-2">
//                 Base Price
//               </span>
//               <span className="text-lg font-bold text-primary-600">
//                 Special Price
//               </span>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import type { Variant } from '@/types'

interface VariantSelectorProps {
  variants: Variant[]
  onSelect: (variant: Variant | null) => void
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

  // Automatically derive selected variant
  const selectedVariant =
    selectedSize && selectedColor
      ? variants.find(v => v.size === selectedSize && v.color === selectedColor) || null
      : null

  // Keep parent state synced
  useEffect(() => {
    onSelect(selectedVariant)
  }, [selectedVariant, onSelect])

  const handleSizeSelect = (size: string) => {
    if (size === selectedSize) {
      // Deselect current size
      setSelectedSize('')
      // If color is no longer valid without size, clear it
      if (!colors.includes(selectedColor)) setSelectedColor('')
    } else {
      setSelectedSize(size)
      // If the selected color isn't valid for this size, clear it
      if (selectedColor && !availableColors.includes(selectedColor)) {
        setSelectedColor('')
      }
    }
  }

  const handleColorSelect = (color: string) => {
    if (color === selectedColor) {
      // Deselect color
      setSelectedColor('')
      // If size is no longer valid without color, clear it
      if (!sizes.includes(selectedSize)) setSelectedSize('')
    } else {
      setSelectedColor(color)
      // If selected size isn’t valid for this color, clear it
      if (selectedSize && !availableSizes.includes(selectedSize)) {
        setSelectedSize('')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Size Selector */}
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

      {/* Color Selector */}
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

      {/* Variant Info */}
      {selectedVariant && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">SKU: {selectedVariant.sku}</span>
            <span
              className={`text-sm font-semibold ${
                selectedVariant.quantity > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
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
              <span className="text-lg font-bold text-primary-600">Special Price</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
