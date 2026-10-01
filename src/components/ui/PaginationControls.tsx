'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  itemLabel?: string;
  createPageUrl?: (page: number) => string;
  onPageChange?: (page: number) => void;
  scrollOnPageChange?: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  itemLabel = 'ITEMS',
  createPageUrl,
  onPageChange,
  scrollOnPageChange = true,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const handlePageClick = (newPage: number, e?: React.MouseEvent) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) {
      if (e) e.preventDefault();
      return;
    }
    if (onPageChange) {
      onPageChange(newPage);
    }
    if (scrollOnPageChange && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate numbered pages with smart ellipsis
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();
  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const endItem = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : null;

  const renderButton = (page: number, isActive: boolean) => {
    const content = (
      <span className="font-mono text-sm tracking-wider font-bold">
        {page}
      </span>
    );

    const baseClass = `min-w-[44px] min-h-[44px] px-3.5 py-2 flex items-center justify-center transition-all duration-200 select-none cursor-pointer ${
      isActive
        ? 'bg-red-600 text-white font-black shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-500 scale-105 z-10'
        : 'bg-white/[0.04] hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 hover:border-white/20'
    }`;

    if (createPageUrl) {
      return (
        <Link
          key={`page-${page}`}
          href={createPageUrl(page)}
          onClick={(e) => handlePageClick(page, e)}
          aria-current={isActive ? 'page' : undefined}
          aria-label={`Go to page ${page}`}
          className={baseClass}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={`page-${page}`}
        type="button"
        onClick={(e) => handlePageClick(page, e)}
        aria-current={isActive ? 'page' : undefined}
        aria-label={`Go to page ${page}`}
        className={baseClass}
      >
        {content}
      </button>
    );
  };

  const renderPrev = () => {
    const disabled = currentPage <= 1;
    const targetPage = currentPage - 1;
    const baseClass = `min-h-[44px] px-4 py-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider transition-all select-none ${
      disabled
        ? 'opacity-30 cursor-not-allowed text-zinc-600 border border-transparent'
        : 'bg-white/[0.04] hover:bg-red-600 hover:border-red-600 text-zinc-300 hover:text-white border border-white/10 cursor-pointer shadow-md'
    }`;

    if (disabled || !createPageUrl) {
      return (
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => handlePageClick(targetPage, e)}
          aria-label="Previous Page"
          className={baseClass}
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">PREVIOUS</span>
          <span className="sm:hidden">PREV</span>
        </button>
      );
    }

    return (
      <Link
        href={createPageUrl(targetPage)}
        onClick={(e) => handlePageClick(targetPage, e)}
        aria-label="Previous Page"
        className={baseClass}
      >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">PREVIOUS</span>
        <span className="sm:hidden">PREV</span>
      </Link>
    );
  };

  const renderNext = () => {
    const disabled = currentPage >= totalPages;
    const targetPage = currentPage + 1;
    const baseClass = `min-h-[44px] px-4 py-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider transition-all select-none ${
      disabled
        ? 'opacity-30 cursor-not-allowed text-zinc-600 border border-transparent'
        : 'bg-white/[0.04] hover:bg-red-600 hover:border-red-600 text-zinc-300 hover:text-white border border-white/10 cursor-pointer shadow-md'
    }`;

    if (disabled || !createPageUrl) {
      return (
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => handlePageClick(targetPage, e)}
          aria-label="Next Page"
          className={baseClass}
        >
          <span>NEXT</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      );
    }

    return (
      <Link
        href={createPageUrl(targetPage)}
        onClick={(e) => handlePageClick(targetPage, e)}
        aria-label="Next Page"
        className={baseClass}
      >
        <span>NEXT</span>
        <ArrowRight className="w-4 h-4 shrink-0" />
      </Link>
    );
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-white/10 w-full"
    >
      {/* Item Range Counter */}
      <div className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
        {startItem !== null && endItem !== null && totalItems !== undefined ? (
          <span>
            SHOWING <span className="text-white font-black">{startItem}–{endItem}</span> OF{' '}
            <span className="text-red-500 font-black">{totalItems}</span> {itemLabel}
          </span>
        ) : (
          <span>
            PAGE <span className="text-white font-black">{currentPage}</span> OF{' '}
            <span className="text-white font-black">{totalPages}</span>
          </span>
        )}
      </div>

      {/* Main Numbered Pagination Row: ← Previous 1 2 3 4 5 ... Next → */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {renderPrev()}

        <div className="flex items-center gap-1 sm:gap-1.5">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-zinc-600 font-mono font-bold select-none text-xs"
                >
                  ...
                </span>
              );
            }
            return renderButton(p as number, p === currentPage);
          })}
        </div>

        {renderNext()}
      </div>
    </nav>
  );
}
