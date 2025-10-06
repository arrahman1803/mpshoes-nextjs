
// import { account, databases, Query } from './appwrite'

// const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
// const USERS_COLLECTION = process.env.NEXT_PUBLIC_USERS_COLLECTION_ID!

// export interface User {
//   $id: string
//   name: string
//   email: string
//   role: 'admin' | 'customer'
//   phone?: string
//   createdAt: string
// }

// export const authUtils = {
//   // Get current user
//   async getCurrentUser() {
//     try {
//       const user = await account.get()
//       return user
//     } catch (error) {
//       return null
//     }
//   },

//   // Get user profile with role
//   async getUserProfile(userId: string) {
//     try {
//       const response = await databases.listDocuments(
//         DATABASE_ID,
//         USERS_COLLECTION,
//         [Query.equal('userId', userId)]
//       )
//       return response.documents[0] as User | undefined
//     } catch (error) {
//       return undefined
//     }
//   },

//   // Check if user is admin
//   async isAdmin(userId: string) {
//     const profile = await this.getUserProfile(userId)
//     return profile?.role === 'admin'
//   },

//   // Create user profile
//   async createUserProfile(userId: string, name: string, email: string, role: 'admin' | 'customer' = 'customer') {
//     try {
//       const profile = await databases.createDocument(
//         DATABASE_ID,
//         USERS_COLLECTION,
//         userId,
//         {
//           userId,
//           name,
//           email,
//           role,
//           createdAt: new Date().toISOString(),
//         }
//       )
//       return profile as User
//     } catch (error) {
//       console.error('Failed to create user profile:', error)
//       return null
//     }
//   },

//   // Update user profile
//   async updateUserProfile(userId: string, data: Partial<User>) {
//     try {
//       const profile = await databases.updateDocument(
//         DATABASE_ID,
//         USERS_COLLECTION,
//         userId,
//         data
//       )
//       return profile as User
//     } catch (error) {
//       console.error('Failed to update user profile:', error)
//       return null
//     }
//   },

//   // Logout
//   async logout() {
//     try {
//       await account.deleteSession('current')
//       return true
//     } catch (error) {
//       console.error('Logout failed:', error)
//       return false
//     }
//   },
// }