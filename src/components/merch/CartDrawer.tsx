'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '@/context/UIContext';
import { X, ShoppingBag, Trash2, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';

export function CartDrawer() {
  const { isCartOpen, toggleCart, cart, removeFromCart, clearCart, showToast } = useUI();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        clearCart();
        toggleCart();
        showToast('Order placed successfully! Confirmation sent to your email.', 'success');
      }, 2500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-screen max-w-md glass-panel-gold bg-obsidian-light border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  <h3 className="font-display font-semibold text-lg text-white">Merchandise Bag</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 font-mono">
                    {cart.reduce((acc, i) => acc + i.quantity, 0)} Items
                  </span>
                </div>
                <button
                  onClick={toggleCart}
                  className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success View */}
              {isSuccess ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-gold animate-bounce" />
                  <h4 className="text-2xl font-display font-bold text-white">ORDER CONFIRMED</h4>
                  <p className="text-sm text-zinc-400">
                    Your luxury merchandise package is being prepared at our London fulfillment center.
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart Item List */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 space-y-3">
                        <ShoppingBag className="w-12 h-12 text-zinc-700" />
                        <p className="text-sm">Your shopping bag is empty.</p>
                      </div>
                    ) : (
                      cart.map((ci) => (
                        <div
                          key={`${ci.item.id}-${ci.selectedSize}`}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                              <Image
                                src={ci.item.imageUrl}
                                alt={ci.item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h5 className="text-sm font-semibold text-white line-clamp-1">{ci.item.title}</h5>
                              <p className="text-xs text-gold font-mono">{formatCurrency(ci.item.price)}</p>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">
                                SIZE: {ci.selectedSize} | QTY: {ci.quantity}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(ci.item.id, ci.selectedSize)}
                            className="p-2 text-zinc-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Checkout Footer */}
                  {cart.length > 0 && (
                    <div className="border-t border-white/10 pt-4 space-y-4">
                      <div className="flex items-center justify-between font-mono text-sm">
                        <span className="text-zinc-400">Subtotal</span>
                        <span className="text-gold font-bold text-lg">{formatCurrency(subtotal)}</span>
                      </div>

                      <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full py-3.5 rounded-xl bg-gold text-obsidian font-display font-bold hover:bg-gold-light transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isCheckingOut ? (
                          <div className="w-5 h-5 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>PROCEED TO SECURE CHECKOUT</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                        <span>256-BIT ENCRYPTED LUXURY CHECKOUT</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
