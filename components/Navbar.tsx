'use client'

import Link from 'next/link'
import { useAuth } from './AuthContext'
import { useCart } from './CartContext'
import SearchBar from './SearchBar'
import { ShoppingCart, User, Menu, X, LogOut, Package, UserCircle } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsUserMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              MPShoes
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link href="/category/men" className="text-gray-700 hover:text-primary-600 transition-colors">
              Men
            </Link>
            <Link href="/category/women" className="text-gray-700 hover:text-primary-600 transition-colors">
              Women
            </Link>
            <Link href="/category/kids" className="text-gray-700 hover:text-primary-600 transition-colors">
              Kids
            </Link>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* Cart */}
            <Link href="/cart" className="text-gray-700 hover:text-primary-600 relative">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
                >
                  <UserCircle size={22} />
                  <span className="hidden sm:inline text-sm font-medium">{user.name.split(' ')[0]}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Package size={16} />
                      My Orders
                    </Link>
                    {user.isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 border-t"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-block bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t space-y-2">
            {/* Mobile Search */}
            <div className="md:hidden mb-4">
              <SearchBar />
            </div>

            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-primary-600"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-primary-600"
            >
              Products
            </Link>
            <Link
              href="/category/men"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-primary-600"
            >
              Men
            </Link>
            <Link
              href="/category/women"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-primary-600"
            >
              Women
            </Link>
            <Link
              href="/category/kids"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-primary-600"
            >
              Kids
            </Link>

            {!user && (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-primary-600 font-medium"
              >
                Login / Register
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
