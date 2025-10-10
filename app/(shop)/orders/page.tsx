// app/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { orderApi } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { Package, Clock, Truck, CheckCircle, XCircle, Eye, AlertCircle, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/AuthContext'
import type { Order, OrderItem } from '@/types'

interface OrderWithItems extends Order {
  items?: OrderItem[]
}

function OrdersPageContent() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (user?.$id) {
      loadOrders()
    }
  }, [user])

  const loadOrders = async () => {
    if (!user?.$id) {
      setError('User not authenticated')
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      console.log('Loading orders for user ID:', user.$id)
      
      // Fetch orders for this user
      const data = await orderApi.getOrdersByUser(user.$id)
      console.log('Orders received:', data.length)
      
      if (data.length === 0) {
        setOrders([])
        setLoading(false)
        return
      }
      
      // Sort orders by creation date (newest first)
      const sortedOrders = data.sort((a, b) => 
        new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      )
      
      // Load order items for each order
      const ordersWithItems = await Promise.all(
        sortedOrders.map(async (order) => {
          try {
            const items = await orderApi.getOrderItems(order.$id)
            console.log(`Order ${order.$id} has ${items.length} items`)
            return { ...order, items }
          } catch (err) {
            console.error(`Failed to load items for order ${order.$id}:`, err)
            return { ...order, items: [] }
          }
        })
      )
      
      setOrders(ordersWithItems)
    } catch (error: any) {
      console.error('Failed to load orders:', error)
      setError(error.message || 'Failed to load orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <h3 className="text-red-900 font-semibold mb-1">Error Loading Orders</h3>
            <p className="text-red-700 mb-3">{error}</p>
            <button
              onClick={loadOrders}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <ShoppingBag size={20} />
          <span className="text-sm">{orders.length} total orders</span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => {
          const count = status === 'all' 
            ? orders.length 
            : orders.filter(o => o.status === status).length
          
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {status} ({count})
            </button>
          )
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "You haven't placed any orders yet. Start shopping to see your orders here!" 
              : `No ${filter} orders found.`}
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.$id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-600">Order ID:</span>
                    <span className="font-mono text-sm font-semibold">#{order.$id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(order.$createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full font-medium capitalize flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                  <Link
                    href={`/orders/${order.$id}`}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    title="View Order Details"
                  >
                    <Eye size={20} />
                  </Link>
                </div>
              </div>

              {/* Order Items Summary */}
              {order.items && order.items.length > 0 && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Order Items ({order.items.length}):
                  </p>
                  <div className="space-y-2">
                    {order.items.slice(0, 3).map(item => (
                      <div key={item.$id} className="flex justify-between items-start text-sm">
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{item.productName}</span>
                          <div className="text-gray-600 text-xs mt-1">
                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900 ml-4">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-primary-600 font-medium">
                        +{order.items.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Address:</span>
                  <span className="font-medium text-right max-w-xs">{order.address}, {order.city}, {order.state}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium">{order.phone}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersPageContent />
    </ProtectedRoute>
  )
}