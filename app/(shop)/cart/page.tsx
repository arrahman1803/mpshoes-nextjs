
'use client'

import { useCart } from '@/components/CartContext'
import { formatPrice, getImageUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => {
            const price = item.variant.priceOverride || item.product.basePrice
            const subtotal = price * item.quantity

            return (
              <div
                key={item.variant.$id}
                className="bg-white rounded-lg shadow-md p-6 flex gap-6"
              >
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                  {item.image ? (
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-semibold text-lg hover:text-primary-600"
                  >
                    {item.product.name}
                  </Link>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>Size: {item.variant.size}</p>
                    <p>Color: {item.variant.color}</p>
                    <p>SKU: {item.variant.sku}</p>
                  </div>
                  <p className="text-primary-600 font-bold mt-2">
                    {formatPrice(price)}
                  </p>
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.variant.$id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.variant.$id, item.quantity - 1)
                      }
                      className="w-8 h-8 border rounded hover:bg-gray-100"
                    >
                      <Minus size={16} className="mx-auto" />
                    </button>
                    <span className="w-12 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.variant.$id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.variant.quantity}
                      className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} className="mx-auto" />
                    </button>
                  </div>

                  <p className="font-bold text-lg">{formatPrice(subtotal)}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {total >= 2000 ? 'Free' : formatPrice(100)}
                </span>
              </div>
              {total < 2000 && (
                <p className="text-sm text-primary-600">
                  Add {formatPrice(2000 - total)} more for free shipping!
                </p>
              )}
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">
                  {formatPrice(total >= 2000 ? total : total + 100)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="block w-full text-center mt-3 text-primary-600 hover:text-primary-700 font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}