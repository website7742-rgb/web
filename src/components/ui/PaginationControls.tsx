'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  scrollOnPageChange?: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  scrollOnPageChange = true,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    onPageChange(newPage);
    if (scrollOnPageChange) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const endItem = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 w-full font-mono">
      {/* Item Range Counter */}
      <div className="text-xs text-zinc-400 font-bold uppercase">
        {startItem !== null && endItem !== null && totalItems !== undefined ? (
          <span>
            SHOWING <span className="text-white">{startItem}</span> - <span className="text-white">{endItem}</span> OF <span className="text-red-500 font-black">{totalItems}</span> ITEMS
          </span>
        ) : (
          <span>
            PAGE <span className="text-white">{currentPage}</span> OF <span className="text-white">{totalPages}</span>
          </span>
        )}
      </div>

      {/* Prev / Next Pagination Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:not-disabled:bg-red-600 hover:not-disabled:border-red-600 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREV</span>
        </button>

        {/* Page numbers indicator */}
        <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs font-extrabold text-red-500">
          {currentPage} / {totalPages}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:not-disabled:bg-red-600 hover:not-disabled:border-red-600 cursor-pointer"
        >
          <span>NEXT</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
