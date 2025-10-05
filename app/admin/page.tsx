
import { api } from '@/lib/api'
import { Package, ShoppingBag, Grid, Tag } from 'lucide-react'

export default async function AdminDashboard() {
  const [products, categories, brands] = await Promise.all([
    api.getProducts(),
    api.getCategories(),
    api.getBrands(),
  ])

  const stats = [
    {
      name: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Categories',
      value: categories.length,
      icon: Grid,
      color: 'bg-green-500',
    },
    {
      name: 'Brands',
      value: brands.length,
      icon: Tag,
      color: 'bg-purple-500',
    },
    {
      name: 'Orders',
      value: 0,
      icon: ShoppingBag,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.name}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Products</h2>
          <div className="space-y-4">
            {products.slice(0, 5).map(product => (
              <div key={product.$id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">₹{product.basePrice}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/products/new"
              className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700"
            >
              Add New Product
            </a>
            <a
              href="/admin/categories"
              className="block w-full bg-white border-2 border-primary-600 text-primary-600 text-center py-3 rounded-lg font-semibold hover:bg-primary-50"
            >
              Manage Categories
            </a>
            <a
              href="/admin/brands"
              className="block w-full bg-white border-2 border-primary-600 text-primary-600 text-center py-3 rounded-lg font-semibold hover:bg-primary-50"
            >
              Manage Brands
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
