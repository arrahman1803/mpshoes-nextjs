import Link from 'next/link'
import { api } from '@/lib/api'
import { Edit, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function AdminProductsPage() {
  const products = await api.getProducts()

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 flex items-center gap-2 mt-4 sm:mt-0"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Base Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Featured
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.$id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.slug}</p>
                  </div>
                </td>
                <td className="px-6 py-4">{formatPrice(product.basePrice)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      product.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {product.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/products/${product.$id}/edit`}
                    className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
