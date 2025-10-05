
'use client'

import { useState, useEffect } from 'react'
import { databases, ID } from '@/lib/appwrite'
import { api } from '@/lib/api'
import { slugify, getImageUrl } from '@/lib/utils'
import ImageUpload from '@/components/ImageUpload'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import type { Brand } from '@/types'

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logoId: '',
  })

  useEffect(() => {
    loadBrands()
  }, [])

  async function loadBrands() {
    const data = await api.getBrands()
    setBrands(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
      const COLLECTION_ID = process.env.NEXT_PUBLIC_BRANDS_COLLECTION_ID!

      const data = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        logoId: formData.logoId || null,
      }

      if (editingId) {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, editingId, data)
      } else {
        await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), data)
      }

      setFormData({ name: '', slug: '', description: '', logoId: '' })
      setShowForm(false)
      setEditingId(null)
      loadBrands()
    } catch (error) {
      console.error('Failed to save brand:', error)
      alert('Failed to save brand')
    }
  }

  const handleEdit = (brand: Brand) => {
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      logoId: brand.logoId || '',
    })
    setEditingId(brand.$id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return

    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
      const COLLECTION_ID = process.env.NEXT_PUBLIC_BRANDS_COLLECTION_ID!
      
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)
      loadBrands()
    } catch (error) {
      console.error('Failed to delete brand:', error)
      alert('Failed to delete brand')
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Brands</h1>
        <button
          onClick={() => {
            setFormData({ name: '', slug: '', description: '', logoId: '' })
            setEditingId(null)
            setShowForm(true)
          }}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Brand
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Brand' : 'New Brand'}
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
              <label className="block text-sm font-semibold mb-2">Brand Logo</label>
              <ImageUpload
                onUpload={fileId => setFormData(prev => ({ ...prev, logoId: fileId }))}
              />
              {formData.logoId && (
                <div className="mt-2 relative w-32 h-32">
                  <Image
                    src={getImageUrl(formData.logoId)}
                    alt="Brand logo"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map(brand => (
          <div key={brand.$id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{brand.name}</h3>
                <p className="text-sm text-gray-600">{brand.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(brand)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(brand.$id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            {brand.logoId && (
              <div className="relative w-full h-24 mb-4">
                <Image
                  src={getImageUrl(brand.logoId)}
                  alt={brand.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            {brand.description && (
              <p className="text-sm text-gray-600">{brand.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
