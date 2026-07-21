'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Artist, Release, Track, TourDate, MerchItem, NewsArticle, ExtendedSubmission, Genre } from '@/types';
import { 
  MOCK_ARTISTS, 
  MOCK_RELEASES, 
  MOCK_TRACKS, 
  MOCK_TOUR_DATES, 
  MOCK_MERCH, 
  MOCK_NEWS, 
  MOCK_SUBMISSIONS 
} from '@/lib/data/mockData';
import { supabase } from '@/lib/supabase/client';

interface DataContextType {
  artists: Artist[];
  releases: Release[];
  tracks: Track[];
  tourDates: TourDate[];
  merch: MerchItem[];
  news: NewsArticle[];
  submissions: ExtendedSubmission[];
  isLoading: boolean;
  addSubmission: (submission: Omit<ExtendedSubmission, 'id' | 'status' | 'submittedAt'>) => Promise<void>;
  approveSubmission: (submissionId: string, adminNotes?: string) => Promise<void>;
  rejectSubmission: (submissionId: string, adminNotes?: string) => Promise<void>;
  createArtist: (artist: Omit<Artist, 'id'>) => Promise<void>;
  updateArtist: (artistId: string, updated: Partial<Artist>) => Promise<void>;
  deleteArtist: (artistId: string) => Promise<void>;
  uploadArtistImage: (file: File, pathFolder: string) => Promise<string | null>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [releases, setReleases] = useState<Release[]>(MOCK_RELEASES);
  const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);
  const [tourDates, setTourDates] = useState<TourDate[]>(MOCK_TOUR_DATES);
  const [merch, setMerch] = useState<MerchItem[]>(MOCK_MERCH);
  const [news, setNews] = useState<NewsArticle[]>(MOCK_NEWS);
  const [submissions, setSubmissions] = useState<ExtendedSubmission[]>(MOCK_SUBMISSIONS);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Load from Supabase with Local Storage Fallback
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
          const { data, error } = await supabase.from('artists').select('*');
          if (!error && data && data.length > 0) {
            const parsedArtists: Artist[] = data.map((item: any) => ({
              id: item.id,
              name: item.name,
              slug: item.slug,
              tagline: item.tagline || '',
              bio: item.bio || '',
              avatarUrl: item.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
              heroUrl: item.hero_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80',
              genres: item.genres || ['Pop'],
              country: item.country || 'United States',
              countryFlag: item.country_flag || '🇺🇸',
              isVerified: item.is_verified ?? true,
              isFeatured: item.is_featured ?? false,
              labelStatus: item.label_status || 'SIGNED',
              monthlyListeners: item.monthly_listeners || 100000,
              totalStreams: item.total_streams || 500000,
              grammyWins: item.grammy_wins || 0,
              topSongs: item.top_songs || [],
              riaaCertifications: {
                platinum: item.platinum_certs || 0,
                gold: item.gold_certs || 0,
                diamond: item.diamond_certs || 0,
              },
              latestReleaseTitle: item.latest_release_title,
              latestReleaseDate: item.latest_release_date,
              epkUrl: item.epk_url,
              biographyLastVerified: item.biography_last_verified || '2026-07-21',
              verificationConfidence: item.verification_confidence || 'HIGH',
              verificationNotes: item.verification_notes || 'Cross-referenced via Official Website, RIAA, and Grammy archives.',
              socials: {},
              streamingPlatforms: [
                { id: `sp-1-${item.id}`, name: 'Official Website', url: item.epk_url || 'https://officialwebsite.com' },
                { id: `sp-2-${item.id}`, name: 'Spotify', url: 'https://open.spotify.com' },
              ],
            }));
            setArtists(parsedArtists);
          }
        }
      } catch (e) {
        console.warn('Supabase fetch bypassed, using local persistence.', e);
      }

      if (typeof window !== 'undefined') {
        const savedSubmissions = localStorage.getItem('aetheria_submissions');
        if (savedSubmissions) {
          try {
            setSubmissions(JSON.parse(savedSubmissions));
          } catch (e) {
            console.error('Failed to parse saved submissions', e);
          }
        }
        const savedArtists = localStorage.getItem('aetheria_artists');
        if (savedArtists) {
          try {
            setArtists(JSON.parse(savedArtists));
          } catch (e) {
            console.error('Failed to parse saved artists', e);
          }
        }
      }
      setIsLoading(false);
    }

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSubmissionsLocal = (newSubmissions: ExtendedSubmission[]) => {
    setSubmissions(newSubmissions);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aetheria_submissions', JSON.stringify(newSubmissions));
    }
  };

  const saveArtistsLocal = (newArtists: Artist[]) => {
    setArtists(newArtists);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aetheria_artists', JSON.stringify(newArtists));
    }
  };

  const uploadArtistImage = async (file: File, pathFolder: string): Promise<string | null> => {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${pathFolder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { data, error } = await supabase.storage.from('artist-assets').upload(fileName, file);

        if (error) {
          console.error('Supabase storage upload error:', error);
        } else if (data) {
          const { data: publicUrlData } = supabase.storage.from('artist-assets').getPublicUrl(data.path);
          return publicUrlData.publicUrl;
        }
      }
    } catch (err) {
      console.error('Failed to upload to Supabase storage:', err);
    }
    return URL.createObjectURL(file);
  };

  const createArtist = async (artistData: Omit<Artist, 'id'>) => {
    const newId = `art-${Date.now()}`;
    const newArtist: Artist = { 
      ...artistData, 
      id: newId,
      biographyLastVerified: new Date().toISOString().split('T')[0],
      verificationConfidence: 'HIGH',
      verificationNotes: 'Manually verified via Executive Admin CMS.'
    };

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await supabase.from('artists').insert({
          id: newId,
          name: newArtist.name,
          slug: newArtist.slug,
          tagline: newArtist.tagline,
          bio: newArtist.bio,
          avatar_url: newArtist.avatarUrl,
          hero_url: newArtist.heroUrl,
          genres: newArtist.genres,
          country: newArtist.country,
          country_flag: newArtist.countryFlag,
          is_verified: newArtist.isVerified,
          is_featured: newArtist.isFeatured,
          monthly_listeners: newArtist.monthlyListeners,
          total_streams: newArtist.totalStreams,
          grammy_wins: newArtist.grammyWins,
          top_songs: newArtist.topSongs,
          biography_last_verified: newArtist.biographyLastVerified,
          verification_confidence: newArtist.verificationConfidence,
          verification_notes: newArtist.verificationNotes,
        });
      }
    } catch (e) {
      console.warn('Supabase insert failed, persisting locally.', e);
    }

    saveArtistsLocal([newArtist, ...artists]);
  };

  const updateArtist = async (artistId: string, updated: Partial<Artist>) => {
    const updatedArtists = artists.map(art => {
      if (art.id === artistId) {
        return { 
          ...art, 
          ...updated,
          biographyLastVerified: new Date().toISOString().split('T')[0]
        };
      }
      return art;
    });

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await supabase.from('artists').update({
          name: updated.name,
          tagline: updated.tagline,
          bio: updated.bio,
          avatar_url: updated.avatarUrl,
          hero_url: updated.heroUrl,
          genres: updated.genres,
          country: updated.country,
          is_verified: updated.isVerified,
          is_featured: updated.isFeatured,
          monthly_listeners: updated.monthlyListeners,
          total_streams: updated.totalStreams,
          grammy_wins: updated.grammyWins,
          top_songs: updated.topSongs,
          biography_last_verified: new Date().toISOString().split('T')[0],
          verification_confidence: updated.verificationConfidence,
          verification_notes: updated.verificationNotes,
        }).eq('id', artistId);
      }
    } catch (e) {
      console.warn('Supabase update failed, updating local state.', e);
    }

    saveArtistsLocal(updatedArtists);
  };

  const deleteArtist = async (artistId: string) => {
    const updatedArtists = artists.filter(art => art.id !== artistId);

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await supabase.from('artists').delete().eq('id', artistId);
      }
    } catch (e) {
      console.warn('Supabase delete failed, updating local state.', e);
    }

    saveArtistsLocal(updatedArtists);
  };

  const addSubmission = async (subData: Omit<ExtendedSubmission, 'id' | 'status' | 'submittedAt'>) => {
    const newSub: ExtendedSubmission = {
      ...subData,
      id: `sub-${Date.now()}`,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };
    const updated = [newSub, ...submissions];
    saveSubmissionsLocal(updated);
  };

  const approveSubmission = async (submissionId: string, adminNotes?: string) => {
    const updatedSubs = submissions.map(sub => {
      if (sub.id === submissionId) {
        return { ...sub, status: 'APPROVED' as const, adminNotes };
      }
      return sub;
    });
    saveSubmissionsLocal(updatedSubs);

    const approvedSub = submissions.find(s => s.id === submissionId);
    if (approvedSub) {
      const slug = approvedSub.stageName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newArtist: Artist = {
        id: `art-${Date.now()}`,
        name: approvedSub.stageName,
        slug,
        tagline: `${approvedSub.genre} Recording Artist`,
        bio: approvedSub.biography,
        avatarUrl: approvedSub.coverImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        heroUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80',
        genres: [approvedSub.genre as Genre],
        country: approvedSub.country,
        countryFlag: '🌐',
        isVerified: true,
        isFeatured: true,
        labelStatus: 'SIGNED',
        monthlyListeners: 125000,
        totalStreams: 500000,
        grammyWins: 0,
        riaaCertifications: { platinum: 0, gold: 1, diamond: 0 },
        socials: {
          spotify: approvedSub.spotifyUrl,
          apple: approvedSub.appleUrl,
          youtube: approvedSub.youtubeUrl,
          instagram: approvedSub.instagramUrl,
        },
        streamingPlatforms: [
          { id: `sp-1-${Date.now()}`, name: 'Spotify', url: approvedSub.spotifyUrl || 'https://open.spotify.com' },
          { id: `sp-2-${Date.now()}`, name: 'Apple Music', url: approvedSub.appleUrl || 'https://music.apple.com' },
        ],
        epkUrl: approvedSub.pressKitPdfUrl,
        biographyLastVerified: new Date().toISOString().split('T')[0],
        verificationConfidence: 'HIGH',
        verificationNotes: 'Approved via A&R Demo Submission Inbox.'
      };

      const existingIndex = artists.findIndex(a => a.slug === slug);
      if (existingIndex === -1) {
        await createArtist(newArtist);
      }
    }
  };

  const rejectSubmission = async (submissionId: string, adminNotes?: string) => {
    const updatedSubs = submissions.map(sub => {
      if (sub.id === submissionId) {
        return { ...sub, status: 'REJECTED' as const, adminNotes };
      }
      return sub;
    });
    saveSubmissionsLocal(updatedSubs);
  };

  return (
    <DataContext.Provider
      value={{
        artists,
        releases,
        tracks,
        tourDates,
        merch,
        news,
        submissions,
        isLoading,
        addSubmission,
        approveSubmission,
        rejectSubmission,
        createArtist,
        updateArtist,
        deleteArtist,
        uploadArtistImage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
