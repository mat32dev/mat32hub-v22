
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VinylRecord, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (record: VinylRecord) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('mat32_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('mat32_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (record: VinylRecord) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === record.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === record.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...record, quantity: 1 }];
    });
    setIsCartOpen(true); // Open cart when adding item
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('mat32_cart');
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, isCartOpen, addToCart, removeFromCart, clearCart, toggleCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
