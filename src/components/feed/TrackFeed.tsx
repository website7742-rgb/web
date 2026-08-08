import React from 'react';
import { InteractionBar } from './InteractionBar';
import { CustomAudioPlayer } from '@/components/media/CustomAudioPlayer';

interface Profile {
  full_name: string;
}

interface CountAggregate {
  count: number;
}

interface Track {
  id: string;
  user_id?: string;
  created_at: string;
  track_title: string;
  genre: string;
  media_url: string;
  profiles: Profile | Profile[];
  likes?: CountAggregate[];
  comments?: CountAggregate[];
}

export function TrackFeed({ tracks }: { tracks: Track[] }) {
  if (!tracks || tracks.length === 0) {
    return null;
  }

  return (
    <section className="my-16 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter font-display text-white">
          LATEST <span className="text-red-600">DROPS</span>
        </h2>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-red-600/50 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => {
          const artistName = Array.isArray(track.profiles)
            ? track.profiles[0]?.full_name
            : track.profiles?.full_name;

          const likeCount = track.likes?.[0]?.count ?? 0;
          const commentCount = track.comments?.[0]?.count ?? 0;

          return (
            <div 
              key={track.id} 
              className="bg-neutral-950 border border-neutral-800 hover:border-red-600/50 transition-colors rounded-sm overflow-hidden group flex flex-col shadow-2xl relative"
            >
              {/* ACCENT BAR */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                      {track.genre || 'EXCLUSIVE'}
                    </span>
                    <span className="text-xs text-zinc-600 font-mono">
                      {new Date(track.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1 truncate group-hover:text-red-500 transition-colors">
                    {track.track_title}
                  </h3>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest truncate mb-6">
                    {artistName || 'UNKNOWN ARTIST'}
                  </p>
                </div>

                <div className="mt-auto space-y-4">
                  {track.media_url ? (
                    <CustomAudioPlayer
                      src={track.media_url}
                      title={track.track_title}
                      artist={artistName || 'UNKNOWN ARTIST'}
                    />
                  ) : (
                    <div className="bg-black/50 p-3 rounded-sm border border-neutral-800/50 text-center text-xs text-zinc-600 font-mono italic">
                      Audio not available
                    </div>
                  )}

                  <InteractionBar 
                    entityId={track.id}
                    artistId={track.user_id}
                    artistName={artistName || 'UNKNOWN ARTIST'}
                    trackTitle={track.track_title}
                    initialLikeCount={likeCount}
                    initialCommentCount={commentCount}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
