
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MPShoes</h3>
            <p className="text-gray-400">
              Your trusted destination for quality footwear.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/category/men">Men</Link></li>
              <li><Link href="/category/women">Women</Link></li>
              <li><Link href="/category/kids">Kids</Link></li>
              <li><Link href="/products">All Products</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/shipping">Shipping Info</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/register">Register</Link></li>
              <li><Link href="/orders">My Orders</Link></li>
              <li><Link href="/admin">Admin</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 MPShoes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}