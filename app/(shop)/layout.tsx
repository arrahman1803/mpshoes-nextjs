import { CartProvider } from '@/components/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </CartProvider>
  )
}
