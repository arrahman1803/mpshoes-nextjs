
import { api } from '@/lib/api'
import ProductCard from '@/components/ProductCard'

export default async function ProductsPage() {
  const products = await api.getProducts()
  
  const productsWithImages = await Promise.all(
    products.map(async product => {
      const images = await api.getImagesByProduct(product.$id)
      return { product, imageId: images[0]?.imageId }
    })
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">All Products</h1>
      
      {productsWithImages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsWithImages.map(({ product, imageId }) => (
            <ProductCard key={product.$id} product={product} imageId={imageId} />
          ))}
        </div>
      )}
    </div>
  )
}
