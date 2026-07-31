'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';

export interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
}

export interface ThreeDotMenuProps {
  items: MenuItem[];
  align?: 'left' | 'right';
  ariaLabel?: string;
}

export function ThreeDotMenu({ items, align = 'right', ariaLabel = 'More options' }: ThreeDotMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (!target || !document.body.contains(target)) return;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    setIsOpen(false);
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div className="relative inline-block text-left z-30" ref={menuRef}>
      <button
        type="button"
        onClick={toggleMenu}
        onTouchEnd={(e) => {
          e.preventDefault();
          toggleMenu(e);
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={ariaLabel}
        className="p-2 rounded-full bg-black/60 hover:bg-red-600 text-zinc-300 hover:text-white border border-white/10 backdrop-blur-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 pointer-events-auto"
      >
        <MoreVertical className="w-4 h-4 pointer-events-none" />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-48 rounded-2xl bg-zinc-950/95 border border-white/15 shadow-2xl backdrop-blur-xl py-2 z-50 animate-in fade-in duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => {
            const content = (
              <span className="flex items-center gap-2 font-mono text-xs font-bold uppercase">
                {item.icon && <span className="w-4 h-4 flex items-center justify-center">{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            );

            if (item.href) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={(e) => handleItemClick(e, item)}
                  className={`w-full px-4 py-2.5 text-left flex items-center transition-colors hover:bg-white/10 ${
                    item.danger ? 'text-red-500 hover:bg-red-600/20' : 'text-zinc-200 hover:text-white'
                  }`}
                  role="menuitem"
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={index}
                type="button"
                onClick={(e) => handleItemClick(e, item)}
                className={`w-full px-4 py-2.5 text-left flex items-center transition-colors hover:bg-white/10 ${
                  item.danger ? 'text-red-500 hover:bg-red-600/20' : 'text-zinc-200 hover:text-white'
                }`}
                role="menuitem"
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
