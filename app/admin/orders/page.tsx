// app/admin/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { databases, Query } from '@/lib/appwrite'
import { formatPrice } from '@/lib/utils'
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle, Download, RefreshCw } from 'lucide-react'
import type { Order, OrderItem } from '@/types'

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const ORDERS_COLLECTION = process.env.NEXT_PUBLIC_ORDERS_COLLECTION_ID!
const ORDER_ITEMS_COLLECTION = process.env.NEXT_PUBLIC_ORDER_ITEMS_COLLECTION_ID!

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

const statusIcons = {
  pending: Package,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION,
        // [Query.orderDesc('createdAt'), Query.limit(100)]
      )
      // setOrders(response.documents as Order[])
    setOrders(response.documents as unknown as Order[])

    } catch (error) {
      console.error('Failed to load orders:', error)
      alert('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const loadOrderItems = async (orderId: string) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        ORDER_ITEMS_COLLECTION,
        [Query.equal('orderId', orderId)]
      )
      // setOrderItems(response.documents as OrderItem[])
      setOrderItems(response.documents as unknown as OrderItem[])

    } catch (error) {
      console.error('Failed to load order items:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setUpdating(true)
    try {
      await databases.updateDocument(
        DATABASE_ID,
        ORDERS_COLLECTION,
        orderId,
        { status }
      )
      setOrders(prev =>
        prev.map(order =>
          order.$id === orderId ? { ...order, status } : order
        )
      )
      if (selectedOrder?.$id === orderId) {
        setSelectedOrder({ ...selectedOrder, status })
      }
      alert('Order status updated successfully!')
    } catch (error) {
      console.error('Failed to update order status:', error)
      alert('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const viewOrder = async (order: Order) => {
    setSelectedOrder(order)
    await loadOrderItems(order.$id)
  }

  const exportOrders = () => {
    const csv = [
      ['Order ID', 'Date', 'Customer', 'Email', 'Phone', 'Status', 'Amount'].join(','),
      ...filteredOrders.map(order => [
        order.$id.slice(-8),
        new Date(order.$createdAt).toLocaleDateString(),
        order.fullName,
        order.email,
        order.phone,
        order.status,
        order.totalAmount
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.$id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Orders Management</h1>
          <p className="text-sm text-gray-600 mt-1">{filteredOrders.length} orders found</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadOrders}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={exportOrders}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 text-sm"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total', value: orderStats.total, color: 'bg-gray-100 text-gray-800' },
          { label: 'Pending', value: orderStats.pending, color: 'bg-yellow-100 text-yellow-800' },
          { label: 'Processing', value: orderStats.processing, color: 'bg-blue-100 text-blue-800' },
          { label: 'Shipped', value: orderStats.shipped, color: 'bg-purple-100 text-purple-800' },
          { label: 'Delivered', value: orderStats.delivered, color: 'bg-green-100 text-green-800' },
          { label: 'Cancelled', value: orderStats.cancelled, color: 'bg-red-100 text-red-800' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} p-3 sm:p-4 rounded-lg text-center`}>
            <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
            <p className="text-xs sm:text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, phone, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
              {searchTerm || statusFilter !== 'all' ? 'No orders match your filters' : 'No orders found'}
            </div>
          ) : (
            filteredOrders.map(order => {
              const StatusIcon = statusIcons[order.status]
              return (
                <div
                  key={order.$id}
                  className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedOrder?.$id === order.$id ? 'ring-2 ring-primary-500' : ''
                  }`}
                  onClick={() => viewOrder(order)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-sm sm:text-base">{order.fullName}</h3>
                        <span className={`px-2 py-1 rounded border text-xs ${statusColors[order.status]} flex items-center gap-1`}>
                          <StatusIcon size={14} />
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">{order.email}</p>
                      <p className="text-xs text-gray-500">{order.phone}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.$createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600 text-lg">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <p className="text-xs text-gray-500">#{order.$id.slice(-6)}</p>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto mt-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 flex items-center justify-center gap-2 text-sm font-medium">
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Order Details */}
        {selectedOrder ? (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Order #{selectedOrder.$id.slice(-8)}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span>Customer Information</span>
                  <span className={`text-xs px-2 py-1 rounded ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </h3>
                <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                  <p><span className="font-medium">Name:</span> {selectedOrder.fullName}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.phone}</p>
                  <p><span className="font-medium">Date:</span> {new Date(selectedOrder.$createdAt).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <div className="text-sm bg-gray-50 p-3 rounded">
                  <p>{selectedOrder.address}</p>
                  <p>{selectedOrder.city}, {selectedOrder.state}</p>
                  <p>{selectedOrder.postalCode}, {selectedOrder.country}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="space-y-2">
                  {orderItems.map(item => (
                    <div key={item.$id} className="bg-gray-50 p-3 rounded text-sm">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-gray-600">
                        Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                      </p>
                      <p className="font-semibold text-primary-600 mt-1">
                        {formatPrice(item.price)} × {item.quantity} = {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary-600">
                    {formatPrice(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Update Status</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.$id, status)}
                      disabled={updating || selectedOrder.status === status}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedOrder.status === status
                          ? statusColors[status] + ' ring-2 ring-offset-1 ring-primary-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex bg-white rounded-lg shadow-md p-8 items-center justify-center text-gray-500 text-center">
            <div>
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Select an order to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}