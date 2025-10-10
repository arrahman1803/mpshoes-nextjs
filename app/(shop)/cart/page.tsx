'use client'

import { useCart } from '@/components/CartContext'
import { formatPrice, getImageUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  const shippingCost = total >= 2000 ? 0 : 100
  const discount = 0
  const finalTotal = total + shippingCost - discount

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8 text-sm sm:text-base">
                Looks like you haven't added anything to your cart yet. Start shopping to find great deals!
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Start Shopping
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div
                key={item.variant.$id}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image ? (
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-semibold text-sm sm:text-base hover:text-primary-600 transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            Size: {item.variant.size}
                          </span>
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            Color: {item.variant.color}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.variant.$id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => updateQuantity(item.variant.$id, item.quantity - 1)}
                          className="w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-base sm:text-lg font-semibold w-8 sm:w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variant.$id, item.quantity + 1)}
                          className="w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                          disabled={item.quantity >= item.variant.quantity}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg sm:text-xl font-bold text-primary-600">
                          {formatPrice(
                            (item.variant.priceOverride || item.product.basePrice) *
                              item.quantity
                          )}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatPrice(item.variant.priceOverride || item.product.basePrice)} each
                        </p>
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {item.quantity >= item.variant.quantity && (
                      <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                        <Tag size={12} />
                        Max quantity reached
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg sm:text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {total < 2000 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <p className="text-xs sm:text-sm text-blue-800">
                    Add <span className="font-semibold">{formatPrice(2000 - total)}</span> more for free shipping! 🚚
                  </p>
                </div>
              )}

              <Link
                href="/checkout"
                className="block w-full bg-primary-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center mb-3"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="block w-full bg-gray-100 text-gray-900 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                  </div>
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}