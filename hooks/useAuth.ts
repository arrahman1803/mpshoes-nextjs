
// 'use client'

// import { useState, useEffect } from 'react'
// import { authUtils, User } from '@/lib/auth'
// import { useRouter } from 'next/navigation'

// export function useAuth() {
//   const [user, setUser] = useState<any>(null)
//   const [profile, setProfile] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     checkAuth()
//   }, [])

//   const checkAuth = async () => {
//     try {
//       const currentUser = await authUtils.getCurrentUser()
//       if (currentUser) {
//         setUser(currentUser)
//         const userProfile = await authUtils.getUserProfile(currentUser.$id)
//         setProfile(userProfile || null)
//       }
//     } catch (error) {
//       setUser(null)
//       setProfile(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const logout = async () => {
//     await authUtils.logout()
//     setUser(null)
//     setProfile(null)
//     router.push('/login')
//   }

//   return {
//     user,
//     profile,
//     loading,
//     isAuthenticated: !!user,
//     isAdmin: profile?.role === 'admin',
//     logout,
//     refetch: checkAuth,
//   }
// }