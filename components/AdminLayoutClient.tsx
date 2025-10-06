'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Package, ShoppingBag, Tag, Grid, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/components/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Grid },
  { name: 'Brands', href: '/admin/brands', icon: Tag },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
]

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link href="/admin" className="text-xl sm:text-2xl font-bold text-primary-600">
                MPShoes Admin
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="text-sm sm:text-base text-gray-700 hover:text-primary-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span className="hidden sm:inline">View Store</span>
                <span className="sm:hidden">Store</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:text-primary-600 p-2 rounded-lg hover:bg-gray-100"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex pt-16">
        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-20
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-1 overflow-y-auto h-full">
            {navigation.map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}