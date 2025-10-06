'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/components/CartContext'
import { useAuth } from '@/components/AuthContext'
import { formatPrice, getImageUrl } from '@/lib/utils'
import { databases, ID } from '@/lib/appwrite'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/AuthContext'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const ORDERS_COLLECTION = process.env.NEXT_PUBLIC_ORDERS_COLLECTION_ID!
const ORDER_ITEMS_COLLECTION = process.env.NEXT_PUBLIC_ORDER_ITEMS_COLLECTION_ID!

function CheckoutPageContent() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
      }))
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.$id) {
      alert('Please log in to place an order.')
      router.push('/login?redirect=/checkout')
      return
    }

    if (items.length === 0) {
      alert('Your cart is empty')
      return
    }

    setLoading(true)

    try {
      const shippingCost = total >= 2000 ? 0 : 100
      const finalTotal = total + shippingCost

      console.log('Creating order for user:', user.$id)

      // Create order in database
      const order = await databases.createDocument(
        DATABASE_ID,
        ORDERS_COLLECTION,
        ID.unique(),
        {
          userId: user.$id,
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          totalAmount: finalTotal,
          status: 'pending',
        }
      )

      console.log('Order created:', order.$id)

      // Create order items
      const itemPromises = items.map(item =>
        databases.createDocument(
          DATABASE_ID,
          ORDER_ITEMS_COLLECTION,
          ID.unique(),
          {
            orderId: order.$id,
            productId: item.product.$id,
            variantId: item.variant.$id,
            productName: item.product.name,
            size: item.variant.size,
            color: item.variant.color,
            quantity: item.quantity,
            price: item.variant.priceOverride || item.product.basePrice,
          }
        )
      )

      await Promise.all(itemPromises)
      console.log('Order items created')

      // Show success message
      alert(`Order placed successfully! Order ID: #${order.$id.slice(0, 8).toUpperCase()}`)
      
      // Clear cart
      clearCart()
      
      // Redirect to orders page
      router.push('/orders')
    } catch (error: any) {
      console.error('Failed to create order:', error)
      alert(`Failed to place order: ${error.message || 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const shippingCost = total >= 2000 ? 0 : 100
  const finalTotal = total + shippingCost

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="max-w-md mx-auto">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add items to your cart before checkout.</p>
            <a
              href="/products"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 9876543210"
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Shipping Address</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 text-sm sm:text-base"
            >
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-64 sm:max-h-96 overflow-y-auto">
              {items.map(item => (
                <div key={item.variant.$id} className="flex gap-3 sm:gap-4">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    {item.image && (
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-600">
                      {item.variant.size} / {item.variant.color}
                    </p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm">
                      {formatPrice(
                        (item.variant.priceOverride || item.product.basePrice) *
                          item.quantity
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Shipping</span>
                <span className="font-semibold">
                  {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                </span>
              </div>
              {total < 2000 && (
                <p className="text-xs text-gray-600">
                  Add {formatPrice(2000 - total)} more for free shipping
                </p>
              )}
              <div className="border-t pt-2 flex justify-between text-lg sm:text-xl font-bold">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-blue-800">
                💳 Your order will be confirmed and you'll receive an email with order details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutPageContent />
    </ProtectedRoute>
  )
}