'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { DataProvider } from '@/providers/DataContext';
import { UIProvider } from '@/providers/UIContext';
import { Navbar } from '@/components/layout/Navbar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { Footer } from '@/components/layout/Footer';
import { AudioProvider } from '@/providers/AudioContext';
import { GlobalAudioPlayer } from '@/components/ui/GlobalAudioPlayer';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current route is admin or login
  const isSystemRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  return (
    <DataProvider>
      <AudioProvider>
        <UIProvider>
          {!isSystemRoute && <Navbar />}
          
          <main className={!isSystemRoute ? "flex-1 pt-24 pb-20" : "flex-1"}>
            {children}
          </main>
          
          {!isSystemRoute && (
            <>
              <CommandPalette />
              <Footer />
              <GlobalAudioPlayer />
            </>
          )}
        </UIProvider>
      </AudioProvider>
    </DataProvider>
  );
}
