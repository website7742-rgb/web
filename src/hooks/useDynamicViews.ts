'use client';

import { useState, useEffect, useRef } from 'react';

export function useDynamicViews(videoIds: string[]) {
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem('worldstar_views');
      let initialCounts: Record<string, number> = saved ? JSON.parse(saved) : {};
      
      let hasChanges = false;
      videoIds.forEach(id => {
        if (!initialCounts[id] || isNaN(initialCounts[id])) {
          // Generate initial random high view count (between 10k and 1.9M)
          initialCounts[id] = Math.floor(Math.random() * 1890000) + 10000;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        localStorage.setItem('worldstar_views', JSON.stringify(initialCounts));
      }
      
      setViewCounts(initialCounts);
      hasInitialized.current = true;
    } catch (e) {
      console.error('Error initializing views:', e);
    }
  }, [videoIds.join(',')]);

  useEffect(() => {
    if (!hasInitialized.current) return;

    // Auto-increment interval
    const interval = setInterval(() => {
      setViewCounts(prev => {
        const next = { ...prev };
        let updated = false;
        
        videoIds.forEach(id => {
          if (next[id] && Math.random() > 0.4) {
            // Increment by 15 to 120
            next[id] += Math.floor(Math.random() * 105) + 15;
            updated = true;
          }
        });
        
        if (updated) {
          try {
            localStorage.setItem('worldstar_views', JSON.stringify(next));
          } catch (e) {
            // ignore localStorage quota errors
          }
          return next;
        }
        return prev;
      });
    }, 4500); // every 4.5 seconds to look realistic

    return () => clearInterval(interval);
  }, [videoIds.join(',')]);

  const formatViews = (views: number | undefined) => {
    if (!views) return '0 VIEWS';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M VIEWS`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K VIEWS`;
    return `${views} VIEWS`;
  };

  return { viewCounts, formatViews };
}
