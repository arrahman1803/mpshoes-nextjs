import { api } from '@/lib/api'
import { orderApi } from '@/lib/api'
import { Package, ShoppingBag, Grid, Tag, TrendingUp, Clock } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [products, categories, brands, orderStats] = await Promise.all([
    api.getProducts(),
    api.getCategories(),
    api.getBrands(),
    orderApi.getOrderStats(),
  ])

  const stats = [
    {
      name: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/products',
    },
    {
      name: 'Total Orders',
      value: orderStats.total,
      icon: ShoppingBag,
      color: 'bg-orange-500',
      href: '/admin/orders',
    },
    {
      name: 'Pending Orders',
      value: orderStats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      href: '/admin/orders?status=pending',
    },
    {
      name: 'Total Revenue',
      value: formatPrice(orderStats.totalRevenue),
      icon: TrendingUp,
      color: 'bg-green-500',
      href: '/admin/orders',
    },
  ]

  const quickStats = [
    { label: 'Categories', value: categories.length, color: 'text-blue-600' },
    { label: 'Brands', value: brands.length, color: 'text-purple-600' },
    { label: 'Processing', value: orderStats.processing, color: 'text-blue-600' },
    { label: 'Shipped', value: orderStats.shipped, color: 'text-purple-600' },
    { label: 'Delivered', value: orderStats.delivered, color: 'text-green-600' },
    { label: 'Cancelled', value: orderStats.cancelled, color: 'text-red-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Welcome back! Here's your store overview.</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">{stat.name}</p>
                  <p className="text-xl sm:text-3xl font-bold mt-2 truncate">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg flex-shrink-0`}>
                  <Icon size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Stats Grid */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickStats.map(stat => (
            <div key={stat.label} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold">Recent Products</h2>
            <Link
              href="/admin/products"
              className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {products.slice(0, 5).map(product => (
              <div key={product.$id} className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base truncate">{product.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{formatPrice(product.basePrice)}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs flex-shrink-0 ml-2 ${
                    product.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/products/new"
              className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700 text-sm sm:text-base"
            >
              Add New Product
            </Link>
            <Link
              href="/admin/orders?status=pending"
              className="block w-full bg-yellow-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-yellow-600 text-sm sm:text-base"
            >
              View Pending Orders ({orderStats.pending})
            </Link>
            <Link
              href="/admin/categories"
              className="block w-full bg-white border-2 border-primary-600 text-primary-600 text-center py-3 rounded-lg font-semibold hover:bg-primary-50 text-sm sm:text-base"
            >
              Manage Categories
            </Link>
            <Link
              href="/admin/brands"
              className="block w-full bg-white border-2 border-primary-600 text-primary-600 text-center py-3 rounded-lg font-semibold hover:bg-primary-50 text-sm sm:text-base"
            >
              Manage Brands
            </Link>
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Order Status Overview</h2>
        <div className="space-y-3">
          {[
            { status: 'Pending', count: orderStats.pending, color: 'bg-yellow-500' },
            { status: 'Processing', count: orderStats.processing, color: 'bg-blue-500' },
            { status: 'Shipped', count: orderStats.shipped, color: 'bg-purple-500' },
            { status: 'Delivered', count: orderStats.delivered, color: 'bg-green-500' },
            { status: 'Cancelled', count: orderStats.cancelled, color: 'bg-red-500' },
          ].map(item => (
            <div key={item.status} className="flex items-center gap-3">
              <div className={`w-16 sm:w-24 ${item.color} text-white text-center py-2 rounded font-semibold text-xs sm:text-sm`}>
                {item.count}
              </div>
              <div className="flex-1">
                <div className={`h-2 rounded-full ${item.color} opacity-20`}>
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{
                      width: `${orderStats.total > 0 ? (item.count / orderStats.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <span className="text-xs sm:text-sm text-gray-600 w-20 sm:w-24 text-right">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}