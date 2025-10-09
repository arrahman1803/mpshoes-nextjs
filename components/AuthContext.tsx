'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { account, databases } from '@/lib/appwrite'
import type { Models } from 'appwrite'

interface User extends Models.User<Models.Preferences> {
  isAdmin?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Admin emails - you can also use Appwrite teams or custom collection
const ADMIN_EMAILS = [
  'admin@mpshoes.com',
  // Add your admin emails here
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const currentUser = await account.get()
      
      // Check if user is admin based on email or prefs
      const isAdmin = 
        ADMIN_EMAILS.includes(currentUser.email) || 
        currentUser.prefs?.role === 'admin'
      
      setUser({ ...currentUser, isAdmin })
      
      console.log('User authenticated:', { 
        email: currentUser.email, 
        isAdmin,
        userId: currentUser.$id 
      })
    } catch (error) {
      setUser(null)
      console.log('No active session')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // First, delete any existing sessions
      try {
        await account.deleteSession('current')
      } catch (e) {
        // No existing session, continue
      }
      
      await account.createEmailPasswordSession(email, password)
      await checkAuth()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const { ID } = await import('@/lib/appwrite')
      await account.create(ID.unique(), email, password, name)
      await login(email, password)
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await account.deleteSession('current')
      setUser(null)
      console.log('User logged out')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected Route Component
export function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}: { 
  children: React.ReactNode
  requireAdmin?: boolean 
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login with return URL
        // const redirectUrl = encodeURIComponent(pathname)
        // router.push(`/login?redirect=${redirectUrl}`)
        router.push('/login')
      } else if (requireAdmin && !user.isAdmin) {
        // Non-admin trying to access admin route
        console.warn('Access denied: Admin privileges required')
        router.push('/')
      }
    }
  }, [user, loading, requireAdmin, router, pathname])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if no user or insufficient permissions
  if (!user || (requireAdmin && !user.isAdmin)) {
    return null
  }

  return <>{children}</>
}