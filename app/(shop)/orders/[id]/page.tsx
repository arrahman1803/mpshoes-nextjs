'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { orderApi } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { useAuth, ProtectedRoute } from '@/components/AuthContext'
import { 
  ArrowLeft, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertCircle 
} from 'lucide-react'
import type { Order, OrderItem } from '@/types'

interface OrderWithItems extends Order {
  items?: OrderItem[]
}

function OrderDetailsContent() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const orderId = params?.id as string

  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (user?.$id && orderId) {
      loadOrderDetails()
    }
  }, [user, orderId])

  const loadOrderDetails = async () => {
    if (!user?.$id) return
    setLoading(true)
    setError('')
    try {
      console.log(`Loading order details for ID: ${orderId}`)

      const orderData = await orderApi.getOrderById(orderId)
      if (!orderData) {
        setError('Order not found.')
        return
      }

      if (orderData.userId !== user.$id) {
        setError('You do not have permission to view this order.')
        return
      }

      const items = await orderApi.getOrderItems(orderId)
      setOrder({ ...orderData, items })
    } catch (err: any) {
      console.error('Failed to load order details:', err)
      setError(err.message || 'Failed to load order details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />
      case 'processing':
        return <Package className="text-blue-600" size={20} />
      case 'shipped':
        return <Truck className="text-purple-600" size={20} />
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />
      default:
        return <Package className="text-gray-600" size={20} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="text-red-600 mt-1 flex-shrink-0" size={24} />
          <div className="flex-1">
            <h3 className="text-red-900 font-semibold mb-1">Error</h3>
            <p className="text-red-700 mb-3">{error}</p>
            <button
              onClick={() => router.push('/orders')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Orders</span>
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Order ID:</p>
            <p className="font-mono text-sm font-semibold">#{order.$id.slice(0, 8).toUpperCase()}</p>
            <p className="text-gray-600 text-sm mt-1">
              Placed on{' '}
              {new Date(order.$createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div>
            <span
              className={`px-4 py-2 rounded-full font-medium capitalize flex items-center gap-2 ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}
              {order.status}
            </span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="border-t pt-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Address:</span>
            <span className="font-medium text-right max-w-xs">{order.address}, {order.city}, {order.state}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Contact:</span>
            <span className="font-medium">{order.phone}</span>
          </div>
          {/* <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium capitalize">{order.paymentMethod || 'N/A'}</span>
          </div> */}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        <div className="divide-y">
          {order.items?.map((item) => (
            <div key={item.$id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{item.productName}</p>
                <p className="text-sm text-gray-600">
                  Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                </p>
              </div>
              <div className="font-semibold text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span className="text-primary-600">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  )
}

export default function OrderDetailsPage() {
  return (
    <ProtectedRoute>
      <OrderDetailsContent />
    </ProtectedRoute>
  )
}
