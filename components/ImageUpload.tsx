
'use client'

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { api } from '@/lib/api'

interface ImageUploadProps {
  onUpload: (fileId: string) => void
  multiple?: boolean
}

export default function ImageUpload({ onUpload, multiple = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      if (multiple) {
        for (let i = 0; i < files.length; i++) {
          const fileId = await api.uploadFile(files[i])
          onUpload(fileId)
        }
      } else {
        const fileId = await api.uploadFile(files[0])
        onUpload(fileId)
      }
    } catch (err) {
      setError('Failed to upload image')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : 'Click to upload'}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
