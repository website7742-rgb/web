'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function LiveViewerBadge({ roomId }: { roomId: string }) {
  const [viewers, setViewers] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Generate a random unique ID for this user session
    const userId = `user-${Math.random().toString(36).substring(7)}`;
    
    // Subscribe to a unique room channel
    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        // Calculate the total number of unique presence keys in the room
        const activeUsers = Object.keys(presenceState).length;
        // To make it look "hyped" even for a single user, we ensure a minimum of 1
        // and optionally add some realistic randomness if desired, but we'll stick to actual count
        setViewers(Math.max(1, activeUsers));
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          await channel.track({ user: userId, joined_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [roomId]);

  if (!isConnected) {
    return (
      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5 opacity-50 transition-all duration-300">
        <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
        <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
          CONNECTING...
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-red-900/50 shadow-[0_4px_12px_rgba(220,38,38,0.2)] transition-all duration-300">
      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
      <span className="text-[9px] font-mono font-bold text-white uppercase tracking-wider">
        {viewers} {viewers === 1 ? 'WATCHING NOW' : 'WATCHING NOW'}
      </span>
    </div>
  );
}
