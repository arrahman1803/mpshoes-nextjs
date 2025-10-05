'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { CartItem } from '@/types'

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems(current => {
      const existing = current.find(i => i.variant.$id === item.variant.$id)
      if (existing) {
        return current.map(i =>
          i.variant.$id === item.variant.$id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...current, item]
    })
  }

  const removeItem = (variantId: string) => {
    setItems(current => current.filter(i => i.variant.$id !== variantId))
  }

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId)
      return
    }
    setItems(current =>
      current.map(i =>
        i.variant.$id === variantId ? { ...i, quantity } : i
      )
    )
  }

  const clearCart = () => setItems([])

  const total = items.reduce(
    (sum, item) =>
      sum +
      (item.variant.priceOverride || item.product.basePrice) * item.quantity,
    0
  )

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}