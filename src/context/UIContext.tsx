'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MerchItem } from '@/types';

export interface CartItem {
  item: MerchItem;
  quantity: number;
  selectedSize: 'S' | 'M' | 'L' | 'XL' | 'XXL';
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface UIContextType {
  isCommandPaletteOpen: boolean;
  isCartOpen: boolean;
  cart: CartItem[];
  toasts: ToastMessage[];
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  toggleCart: () => void;
  addToCart: (item: MerchItem, size?: 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  removeFromCart: (itemId: string, size: string) => void;
  clearCart: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openCommandPalette = () => setIsCommandPaletteOpen(true);
  const closeCommandPalette = () => setIsCommandPaletteOpen(false);
  const toggleCommandPalette = () => setIsCommandPaletteOpen(prev => !prev);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const addToCart = (item: MerchItem, size: 'S' | 'M' | 'L' | 'XL' | 'XXL' = 'M') => {
    setCart(prev => {
      const existingIndex = prev.findIndex(ci => ci.item.id === item.id && ci.selectedSize === size);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { item, quantity: 1, selectedSize: size }];
    });
    showToast(`Added "${item.title}" (${size}) to cart`, 'success');
  };

  const removeFromCart = (itemId: string, size: string) => {
    setCart(prev => prev.filter(ci => !(ci.item.id === itemId && ci.selectedSize === size)));
  };

  const clearCart = () => setCart([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <UIContext.Provider
      value={{
        isCommandPaletteOpen,
        isCartOpen,
        cart,
        toasts,
        openCommandPalette,
        closeCommandPalette,
        toggleCommandPalette,
        toggleCart,
        addToCart,
        removeFromCart,
        clearCart,
        showToast,
        removeToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
}
