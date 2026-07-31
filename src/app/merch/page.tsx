'use client';

import React, { useState, useTransition } from 'react';
import { ShoppingBag, Filter, Sparkles, CheckCircle2, Loader2, Share2, Copy } from 'lucide-react';
import Link from 'next/link';
import { ThreeDotMenu } from '@/components/ui/ThreeDotMenu';
import { PaginationControls } from '@/components/ui/PaginationControls';

interface MerchItem {
  id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string;
  isExclusive: boolean;
  description: string;
}

export default function MerchPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isPending, startTransition] = useTransition();
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const categories = ['ALL', 'APPAREL', 'VINYL & MEDIA', 'ACCESSORIES', 'COLLECTIBLES'];

  const merchItems: MerchItem[] = [
    {
      id: 'm1',
      title: 'WorldStar Executive Heavyweight Hoodie',
      category: 'APPAREL',
      price: 85.00,
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      isExclusive: true,
      description: 'Custom 500GSM heavyweight French terry hoodie with embroidered red WorldStar crown logo.',
    },
    {
      id: 'm2',
      title: 'Tupac Shakur - Me Against The World 2LP Vinyl',
      category: 'VINYL & MEDIA',
      price: 42.00,
      imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
      isExclusive: false,
      description: 'Remastered audiophile pressing on 180g red translucent vinyl with gatefold jacket.',
    },
    {
      id: 'm3',
      title: 'WorldStar Gold Plated Cuban Chain & Pendant',
      category: 'ACCESSORIES',
      price: 120.00,
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      isExclusive: true,
      description: '18k gold plated 12mm Cuban link chain featuring heavy iced WSHH crown emblem.',
    },
    {
      id: 'm4',
      title: 'J. Cole - 2014 Forest Hills Drive Anniversary Vinyl',
      category: 'VINYL & MEDIA',
      price: 38.00,
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      isExclusive: false,
      description: '10th Anniversary special edition double vinyl featuring unreleased studio session commentary.',
    },
    {
      id: 'm5',
      title: 'WorldStar Vintage Tour Dad Hat (Black/Red)',
      category: 'APPAREL',
      price: 32.00,
      imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      isExclusive: false,
      description: '100% washed cotton unstructured dad cap with 3D embroidery.',
    },
  ];

  const filteredMerch = merchItems.filter(
    (item) => selectedCategory === 'ALL' || item.category === selectedCategory
  );

  const totalPages = Math.ceil(filteredMerch.length / pageSize);
  const paginatedMerch = filteredMerch.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleAddToCart = (id: string, title: string) => {
    startTransition(() => {
      setTimeout(() => {
        setAddedItem(id);
        setCartCount(prev => prev + 1);
        setTimeout(() => setAddedItem(null), 2000);
      }, 300);
    });
  };

  return (
    <div className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-12 selection:bg-red-600 selection:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 text-red-500 border border-red-600/30 text-xs font-mono font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL WORLDSTAR STORE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            MERCHANDISE &amp; <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">VINYL</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Cart Badge Button */}
          <div className="px-4 py-2 rounded-xl bg-[#0a0a0a] border border-red-600/40 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg">
            <ShoppingBag className="w-4 h-4 text-red-500" />
            <span>CART ({cartCount})</span>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-zinc-500 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all min-h-[44px] cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white font-bold shadow-lg'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Merch Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedMerch.map((item) => {
          const isJustAdded = addedItem === item.id;

          return (
            <div
              key={item.id}
              className="group bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10 hover:border-red-600/40 transition-all flex flex-col justify-between shadow-xl relative"
            >
              <div className="relative aspect-square overflow-hidden bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                />
                {item.isExclusive && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold uppercase tracking-widest shadow-xl pointer-events-none">
                    LIMITED EDITION
                  </span>
                )}

                {/* THREE-DOT MENU AT TOP RIGHT */}
                <div className="absolute top-4 right-4 z-20">
                  <ThreeDotMenu
                    items={[
                      {
                        label: 'ADD TO CART',
                        icon: <ShoppingBag className="w-3.5 h-3.5 text-red-500" />,
                        onClick: () => handleAddToCart(item.id, item.title),
                      },
                      {
                        label: 'COPY TITLE',
                        icon: <Copy className="w-3.5 h-3.5 text-zinc-400" />,
                        onClick: () => {
                          navigator.clipboard.writeText(item.title);
                        },
                      },
                      {
                        label: 'SHARE ITEM',
                        icon: <Share2 className="w-3.5 h-3.5 text-zinc-400" />,
                        onClick: () => {
                          navigator.clipboard.writeText(window.location.href);
                        },
                      },
                    ]}
                    ariaLabel={`Options for ${item.title}`}
                  />
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{item.category}</span>
                  <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-red-500 transition-colors uppercase">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-sans">{item.description}</p>
                  <p className="text-base font-mono font-bold text-red-500 mt-2">${item.price.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => handleAddToCart(item.id, item.title)}
                  disabled={isPending || isJustAdded}
                  className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer ${
                    isJustAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-lg'
                  } disabled:opacity-80`}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isJustAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ADDED TO CART!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO CART</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredMerch.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
