
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ShoppingBag, Tag, Grid, LayoutDashboard, LogOut } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Grid },
  { name: 'Brands', href: '/admin/brands', icon: Tag },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="text-2xl font-bold text-primary-600">
              MPShoes Admin
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary-600"
              >
                View Store
              </Link>
              <button className="text-gray-700 hover:text-primary-600">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-screen shadow-sm">
          <nav className="p-4 space-y-1">
            {navigation.map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
