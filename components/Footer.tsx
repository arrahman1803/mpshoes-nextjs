import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">MPShoes</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Your trusted destination for quality footwear. Step into style and comfort with our curated collection.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-sm hover:text-white transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/category/men" className="text-sm hover:text-white transition-colors">
                  Men's Shoes
                </Link>
              </li>
              <li>
                <Link href="/category/women" className="text-sm hover:text-white transition-colors">
                  Women's Shoes
                </Link>
              </li>
              <li>
                <Link href="/category/kids" className="text-sm hover:text-white transition-colors">
                  Kids' Shoes
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/orders" className="text-sm hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  Ground Floor, Parajiya Building, Opposite Jivan Commercial Co Operative Bank, Dhebar Road One Way, Dhebar Road-360002
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-sm hover:text-white transition-colors">
                  +91 89057 92685
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary-400 flex-shrink-0" />
                <a href="mailto:support@mpshoes.com" className="text-sm hover:text-white transition-colors">
                  mpshoes@gmail.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            {/* <div className="mt-6">
              <h5 className="text-white font-semibold mb-2 text-sm">Newsletter</h5>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div> */}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center sm:text-left">
              © {currentYear} MPShoes. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Shipping Policy
              </Link>
            </div>
          </div>

          {/* Payment Methods */}
          {/* <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-400 text-center mb-3">We Accept:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Visa', 'Mastercard', 'PayPal', 'UPI', 'Paytm'].map(method => (
                <div
                  key={method}
                  className="px-4 py-2 bg-gray-800 rounded border border-gray-700 text-xs font-medium"
                >
                  {method}
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  )
}