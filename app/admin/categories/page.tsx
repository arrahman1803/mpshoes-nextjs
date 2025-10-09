
// 'use client'

// import { useState, useEffect } from 'react'
// import { databases, ID } from '@/lib/appwrite'
// import { api } from '@/lib/api'
// import { getImageUrl, slugify } from '@/lib/utils'
// import { Plus, Edit, Trash2 } from 'lucide-react'
// import type { Category } from '@/types'
// import ImageUpload from '@/components/ImageUpload'
// import Image from 'next/image'

// export default function AdminCategoriesPage() {
//   const [categories, setCategories] = useState<Category[]>([])
//   const [showForm, setShowForm] = useState(false)
//   const [editingId, setEditingId] = useState<string | null>(null)
//   const [formData, setFormData] = useState({
//     name: '',
//     slug: '',
//     description: '',
//     imageId: '',
//   })

//   useEffect(() => {
//     loadCategories()
//   }, [])

//   async function loadCategories() {
//     const data = await api.getCategories()
//     setCategories(data)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     try {
//       const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
//       const COLLECTION_ID = process.env.NEXT_PUBLIC_CATEGORIES_COLLECTION_ID!

//       if (editingId) {
//         await databases.updateDocument(DATABASE_ID, COLLECTION_ID, editingId, formData)
//       } else {
//         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), formData)
//       }

//       setFormData({ name: '', slug: '', description: '', imageId: '' })
//       setShowForm(false)
//       setEditingId(null)
//       loadCategories()
//     } catch (error) {
//       console.error('Failed to save category:', error)
//       alert('Failed to save category')
//     }
//   }

//   const handleEdit = (category: Category) => {
//     setFormData({
//       name: category.name,
//       slug: category.slug,
//       description: category.description || '',
//       imageId: category.imageId || '',
//     })
//     setEditingId(category.$id)
//     setShowForm(true)
//   }

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this category?')) return

//     try {
//       const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
//       const COLLECTION_ID = process.env.NEXT_PUBLIC_CATEGORIES_COLLECTION_ID!
      
//       await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)
//       loadCategories()
//     } catch (error) {
//       console.error('Failed to delete category:', error)
//       alert('Failed to delete category')
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))

//     if (name === 'name') {
//       setFormData(prev => ({ ...prev, slug: slugify(value) }))
//     }
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Categories</h1>
//         <button
//           onClick={() => {
//             setFormData({ name: '', slug: '', description: '', imageId: '' })
//             setEditingId(null)
//             setShowForm(true)
//           }}
//           className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 flex items-center gap-2"
//         >
//           <Plus size={20} />
//           Add Category
//         </button>
//       </div>

//       {showForm && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h2 className="text-xl font-bold mb-4">
//             {editingId ? 'Edit Category' : 'New Category'}
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Slug *</label>
//                 <input
//                   type="text"
//                   name="slug"
//                   value={formData.slug}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-semibold mb-2">Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold mb-2">category Image</label>
//               <ImageUpload
//                 onUpload={fileId => setFormData(prev => ({ ...prev, imageId: fileId }))}
//               />
//               {formData.imageId && (
//                 <div className="mt-2 relative w-32 h-32">
//                   <Image
//                     src={getImageUrl(formData.imageId)}
//                     alt="Category Image"
//                     fill
//                     className="object-contain"
//                   />
//                 </div>
//               )}
//             </div>
//             <div className="flex gap-4">
//               <button
//                 type="submit"
//                 className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700"
//               >
//                 Save
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowForm(false)
//                   setEditingId(null)
//                 }}
//                 className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Slug
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Description
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {categories.map(category => (
//               <tr key={category.$id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 font-semibold">{category.name}</td>
//                 <td className="px-6 py-4 text-gray-600">{category.slug}</td>
//                 <td className="px-6 py-4 text-gray-600 max-w-md truncate">
//                   {category.description}
//                 </td>
//                 <td className="px-6 py-4 text-right">
//                   <div className="flex justify-end gap-2">
//                     <button
//                       onClick={() => handleEdit(category)}
//                       className="text-primary-600 hover:text-primary-700"
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(category.$id)}
//                       className="text-red-600 hover:text-red-700"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { databases, ID } from '@/lib/appwrite'
import { api } from '@/lib/api'
import { getImageUrl, slugify } from '@/lib/utils'
import { Plus, Edit, Trash2 } from 'lucide-react'
import type { Category } from '@/types'
import ImageUpload from '@/components/ImageUpload'
import Image from 'next/image'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageId: '',
  })

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const data = await api.getCategories()
    setCategories(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
      const COLLECTION_ID = process.env.NEXT_PUBLIC_CATEGORIES_COLLECTION_ID!

      if (editingId) {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, editingId, formData)
      } else {
        await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), formData)
      }

      setFormData({ name: '', slug: '', description: '', imageId: '' })
      setShowForm(false)
      setEditingId(null)
      loadCategories()
    } catch (error) {
      console.error('Failed to save category:', error)
      alert('Failed to save category')
    }
  }

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      imageId: category.imageId || '',
    })
    setEditingId(category.$id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
      const COLLECTION_ID = process.env.NEXT_PUBLIC_CATEGORIES_COLLECTION_ID!
      
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)
      loadCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Failed to delete category')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'name') {
      setFormData(prev => ({ ...prev, slug: slugify(value) }))
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Categories</h1>
        <button
          onClick={() => {
            setFormData({ name: '', slug: '', description: '', imageId: '' })
            setEditingId(null)
            setShowForm(true)
          }}
          className="bg-primary-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-primary-700 flex items-center gap-2 text-sm sm:text-base"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Category Image</label>
              <ImageUpload
                onUpload={fileId => setFormData(prev => ({ ...prev, imageId: fileId }))}
              />
              {formData.imageId && (
                <div className="mt-2 relative w-32 h-32">
                  <Image
                    src={getImageUrl(formData.imageId)}
                    alt="Category Image"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List - Responsive Cards on Mobile */}
      <div className="space-y-4 sm:hidden">
        {categories.map(category => (
          <div
            key={category.$id}
            className="bg-white p-4 rounded-lg shadow-md space-y-2"
          >
            <div className="font-bold text-lg">{category.name}</div>
            <div className="text-sm text-gray-600">Slug: {category.slug}</div>
            <div className="text-sm text-gray-600">{category.description}</div>
            <div className="flex justify-end gap-4 mt-2">
              <button onClick={() => handleEdit(category)} className="text-primary-600 hover:text-primary-700">
                <Edit size={18} />
              </button>
              <button onClick={() => handleDelete(category.$id)} className="text-red-600 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table View for Larger Screens */}
      <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase">
                Slug
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map(category => (
              <tr key={category.$id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{category.name}</td>
                <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                <td className="px-6 py-4 text-gray-600 max-w-md truncate">
                  {category.description}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.$id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
