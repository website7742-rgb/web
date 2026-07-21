'use client';

import React from 'react';
import { DataProvider } from '@/context/DataContext';
import { UIProvider } from '@/context/UIContext';
import { Navbar } from '@/components/layout/Navbar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { CartDrawer } from '@/components/merch/CartDrawer';
import { Footer } from '@/components/layout/Footer';
import { AudioProvider } from '@/context/AudioContext';
import { GlobalAudioPlayer } from '@/components/ui/GlobalAudioPlayer';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <AudioProvider>
        <UIProvider>
          <Navbar />
          <main className="flex-1 pt-24 pb-20">
            {children}
          </main>
          <CommandPalette />
          <CartDrawer />
          <Footer />
          <GlobalAudioPlayer />
        </UIProvider>
      </AudioProvider>
    </DataProvider>
  );
}
