
'use client'

import Link from 'next/link'
import { useCart } from './CartContext'
import { ShoppingCart, User, Search, Menu } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { itemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              MPShoes
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600">
              Products
            </Link>
            <Link href="/category/men" className="text-gray-700 hover:text-primary-600">
              Men
            </Link>
            <Link href="/category/women" className="text-gray-700 hover:text-primary-600">
              Women
            </Link>
            <Link href="/category/kids" className="text-gray-700 hover:text-primary-600">
              Kids
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-primary-600">
              <Search size={20} />
            </button>
            <Link href="/login" className="text-gray-700 hover:text-primary-600">
              <User size={20} />
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-primary-600 relative">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link href="/" className="block py-2 text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link href="/products" className="block py-2 text-gray-700 hover:text-primary-600">
              Products
            </Link>
            <Link href="/category/men" className="block py-2 text-gray-700 hover:text-primary-600">
              Men
            </Link>
            <Link href="/category/women" className="block py-2 text-gray-700 hover:text-primary-600">
              Women
            </Link>
            <Link href="/category/kids" className="block py-2 text-gray-700 hover:text-primary-600">
              Kids
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
