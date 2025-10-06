// app/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthContext'
import { account } from '@/lib/appwrite'
import { User, Mail, Shield, Calendar, Save, Loader, Package, ShoppingBag } from 'lucide-react'
import { ProtectedRoute } from '@/components/AuthContext'
import Link from 'next/link'
import { orderApi } from '@/lib/api'

function ProfilePageContent() {
  const { user, checkAuth } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })
  const [orderStats, setOrderStats] = useState({ total: 0, pending: 0, delivered: 0 })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      })
      loadOrderStats()
    }
  }, [user])

  const loadOrderStats = async () => {
    if (!user?.$id) return
    try {
      const orders = await orderApi.getOrdersByUser(user.$id)
      setOrderStats({
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
      })
    } catch (error) {
      console.error('Failed to load order stats:', error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      if (formData.name !== user?.name) {
        await account.updateName(formData.name)
      }

      await checkAuth()
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage({ type: '', text: '' })

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      return
    }

    setLoading(true)

    try {
      await account.updatePassword(passwordData.newPassword, passwordData.oldPassword)
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' })
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000)
    } catch (error: any) {
      setPasswordMessage({ type: 'error', text: error.message || 'Failed to update password. Check your current password.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-primary-600">{orderStats.total}</p>
              </div>
              <ShoppingBag className="text-primary-600" size={32} />
            </div>
          </Link>

          <Link
            href="/orders?status=pending"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
              </div>
              <Package className="text-yellow-600" size={32} />
            </div>
          </Link>

          <Link
            href="/orders?status=delivered"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
              </div>
              <Package className="text-green-600" size={32} />
            </div>
          </Link>
        </div>

        {/* Account Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <User size={24} className="text-primary-600" />
            Account Information
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium">
                  {user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            {user?.isAdmin && (
              <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg border border-primary-200">
                <Shield className="text-primary-600 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-primary-600 font-medium">Account Type</p>
                  <p className="font-semibold text-primary-700">Administrator</p>
                  <Link
                    href="/admin"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-1 inline-block"
                  >
                    Go to Admin Panel →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Update Profile Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Update Profile</h2>

          {message.text && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed for security reasons
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Change Password</h2>

          {passwordMessage.text && (
            <div className={`mb-4 p-4 rounded-lg ${
              passwordMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {passwordMessage.text}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-semibold mb-2">
                Current Password
              </label>
              <input
                id="oldPassword"
                type="password"
                value={passwordData.oldPassword}
                onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  )
}