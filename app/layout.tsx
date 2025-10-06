
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../components/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MPShoes - Quality Footwear Store',
  description: 'Your trusted destination for quality footwear',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <meta name="robots" content="noindex, nofollow" />
      <body className={inter.className}>
         <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}