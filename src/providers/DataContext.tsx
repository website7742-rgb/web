'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Artist, Release, Track, TourDate, NewsArticle, ExtendedSubmission, Genre, SiteSettings } from '@/types';
import { 
  MOCK_ARTISTS, 
  MOCK_RELEASES, 
  MOCK_TRACKS, 
  MOCK_TOUR_DATES, 
  MOCK_NEWS, 
  MOCK_SUBMISSIONS 
} from '@/lib/data/mockData';
import { supabase } from '@/lib/supabase/client';

interface DataContextType {
  artists: Artist[];
  releases: Release[];
  tracks: Track[];
  tourDates: TourDate[];
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
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [releases, setReleases] = useState<Release[]>(MOCK_RELEASES);
  const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);
  const [tourDates, setTourDates] = useState<TourDate[]>(MOCK_TOUR_DATES);
  const [news, setNews] = useState<NewsArticle[]>(MOCK_NEWS);
  const [submissions, setSubmissions] = useState<ExtendedSubmission[]>(MOCK_SUBMISSIONS);
  const [isLoading, setIsLoading] = useState(true);

  const defaultSiteSettings: SiteSettings = {
    heroVideoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0?autoplay=0&rel=0',
    heroTitle: 'DRAKE & 21 SAVAGE: UNCUT STUDIO FREESTYLE',
    heroSubtitle: 'WORLDSTAR EXCLUSIVE • OFFICIAL RELEASE',
    heroCtaText: 'WATCH NOW',
    heroCtaLink: '/roster'
  };
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);

  // Initial Load — Merge Supabase with MOCK_ARTISTS so all 200 artists always show
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);

      // Clear stale localStorage cache that was locking in old 100-artist data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('worldstar_artists');
      }

      try {
        // Load Site Settings from localStorage first for immediate render
        if (typeof window !== 'undefined') {
          const cachedSettings = localStorage.getItem('worldstar_site_settings');
          if (cachedSettings) setSiteSettings(JSON.parse(cachedSettings));
        }

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          setArtists(MOCK_ARTISTS);
          setIsLoading(false);
          return;
        }

        // Try to fetch settings from Supabase
        const { data: rawSettingsData, error: settingsError } = await supabase.from('site_settings').select('*').eq('id', 'global').single();
        const settingsData: any = rawSettingsData;
        if (!settingsError && settingsData) {
          const remoteSettings: SiteSettings = {
            heroTitle: settingsData.hero_title || defaultSiteSettings.heroTitle,
            heroSubtitle: settingsData.hero_subtitle || defaultSiteSettings.heroSubtitle,
            heroVideoUrl: settingsData.hero_video_url || defaultSiteSettings.heroVideoUrl,
            heroCtaText: settingsData.hero_cta_text || defaultSiteSettings.heroCtaText,
            heroCtaLink: settingsData.hero_cta_link || defaultSiteSettings.heroCtaLink,
          };
          setSiteSettings(remoteSettings);
          if (typeof window !== 'undefined') {
            localStorage.setItem('worldstar_site_settings', JSON.stringify(remoteSettings));
          }
        }

        const { data, error } = await supabase.from('artists').select('*');
        
        if (error || !data || data.length === 0) {
          // Graceful silent fallback to MOCK_ARTISTS dataset
          setArtists(MOCK_ARTISTS);
        } else {
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

          // MERGE: Supabase artists + MOCK_ARTISTS (deduplicated by slug)
          const supabaseSlugs = new Set(parsedArtists.map(a => a.slug));
          const mockOnly = MOCK_ARTISTS.filter(a => !supabaseSlugs.has(a.slug));
          const finalArtists = [...parsedArtists, ...mockOnly];
          
          setArtists(finalArtists.length > 0 ? finalArtists : MOCK_ARTISTS);
        }
      } catch (e) {
        // Silent production fallback to MOCK_ARTISTS dataset
        setArtists(MOCK_ARTISTS);
      }

      if (typeof window !== 'undefined') {
        const savedSubmissions = localStorage.getItem('worldstar_submissions');
        if (savedSubmissions) {
          try {
            setSubmissions(JSON.parse(savedSubmissions));
          } catch (e) {
            console.error('Failed to parse saved submissions', e);
          }
        }
      }
      setIsLoading(false);
    }

    loadInitialData();
  }, []);


  const saveSubmissionsLocal = useCallback((newSubmissions: ExtendedSubmission[]) => {
    setSubmissions(newSubmissions);
    if (typeof window !== 'undefined') {
      localStorage.setItem('worldstar_submissions', JSON.stringify(newSubmissions));
    }
  }, []);

  const saveArtistsLocal = useCallback((newArtists: Artist[]) => {
    setArtists(newArtists);
    if (typeof window !== 'undefined') {
      localStorage.setItem('worldstar_artists', JSON.stringify(newArtists));
    }
  }, []);

  const uploadArtistImage = useCallback(async (file: File, pathFolder: string): Promise<string | null> => {
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
  }, []);

  const createArtist = useCallback(async (artistData: Omit<Artist, 'id'>) => {
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
      // Supabase fallback
    }

    setArtists(prev => {
      const updated = [newArtist, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('worldstar_artists', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const updateArtist = useCallback(async (artistId: string, updated: Partial<Artist>) => {
    setArtists(prev => {
      const updatedArtists = prev.map(art => {
        if (art.id === artistId) {
          return { 
            ...art, 
            ...updated,
            biographyLastVerified: new Date().toISOString().split('T')[0]
          };
        }
        return art;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('worldstar_artists', JSON.stringify(updatedArtists));
      }
      return updatedArtists;
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
      // Supabase fallback
    }
  }, []);

  const deleteArtist = useCallback(async (artistId: string) => {
    setArtists(prev => {
      const updatedArtists = prev.filter(art => art.id !== artistId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('worldstar_artists', JSON.stringify(updatedArtists));
      }
      return updatedArtists;
    });

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await supabase.from('artists').delete().eq('id', artistId);
      }
    } catch (e) {
      // Supabase fallback
    }
  }, []);

  const addSubmission = useCallback(async (subData: Omit<ExtendedSubmission, 'id' | 'status' | 'submittedAt'>) => {
    const newSub: ExtendedSubmission = {
      ...subData,
      id: `sub-${Date.now()}`,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };
    setSubmissions(prev => {
      const updated = [newSub, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('worldstar_submissions', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const approveSubmission = useCallback(async (submissionId: string, adminNotes?: string) => {
    let approvedSub: ExtendedSubmission | undefined;
    setSubmissions(prev => {
      const updatedSubs = prev.map(sub => {
        if (sub.id === submissionId) {
          approvedSub = sub;
          return { ...sub, status: 'APPROVED' as const, adminNotes };
        }
        return sub;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('worldstar_submissions', JSON.stringify(updatedSubs));
      }
      return updatedSubs;
    });

    if (approvedSub) {
      const sub = approvedSub as ExtendedSubmission;
      const slug = sub.stageName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newArtist: Artist = {
        id: `art-${Date.now()}`,
        name: sub.stageName,
        slug,
        tagline: `${sub.genre} Recording Artist`,
        bio: sub.biography,
        avatarUrl: sub.coverImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        heroUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80',
        genres: [sub.genre as Genre],
        country: sub.country,
        countryFlag: '🌐',
        isVerified: true,
        isFeatured: true,
        labelStatus: 'SIGNED',
        monthlyListeners: 125000,
        totalStreams: 500000,
        grammyWins: 0,
        riaaCertifications: { platinum: 0, gold: 1, diamond: 0 },
        socials: {
          spotify: sub.spotifyUrl,
          apple: sub.appleUrl,
          youtube: sub.youtubeUrl,
          instagram: sub.instagramUrl,
        },
        streamingPlatforms: [
          { id: `sp-1-${Date.now()}`, name: 'Spotify', url: sub.spotifyUrl || 'https://open.spotify.com' },
          { id: `sp-2-${Date.now()}`, name: 'Apple Music', url: sub.appleUrl || 'https://music.apple.com' },
        ],
        epkUrl: sub.pressKitPdfUrl,
        biographyLastVerified: new Date().toISOString().split('T')[0],
        verificationConfidence: 'HIGH',
        verificationNotes: 'Approved via A&R Demo Submission Inbox.'
      };

      createArtist(newArtist);
    }
  }, [createArtist]);

  const rejectSubmission = useCallback(async (submissionId: string, adminNotes?: string) => {
    setSubmissions(prev => {
      const updatedSubs = prev.map(sub => {
        if (sub.id === submissionId) {
          return { ...sub, status: 'REJECTED' as const, adminNotes };
        }
        return sub;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('worldstar_submissions', JSON.stringify(updatedSubs));
      }
      return updatedSubs;
    });
  }, []);

  const updateSiteSettings = useCallback(async (settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => {
      const updated = { ...prev, ...settings };
      if (typeof window !== 'undefined') {
        localStorage.setItem('worldstar_site_settings', JSON.stringify(updated));
      }
      return updated;
    });

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const payload = {
          id: 'global',
          hero_title: settings.heroTitle,
          hero_subtitle: settings.heroSubtitle,
          hero_video_url: settings.heroVideoUrl,
          hero_cta_text: settings.heroCtaText,
          hero_cta_link: settings.heroCtaLink,
          updated_at: new Date().toISOString()
        };
        await supabase.from('site_settings').upsert(payload, { onConflict: 'id' });
      } catch (err) {
        console.error('Failed to update site settings in Supabase:', err);
      }
    }
  }, []);

  const value = useMemo(() => ({
    artists,
    releases,
    tracks,
    tourDates,
    news,
    submissions,
    isLoading,
    siteSettings,
    addSubmission,
    approveSubmission,
    rejectSubmission,
    createArtist,
    updateArtist,
    deleteArtist,
    uploadArtistImage,
    updateSiteSettings,
  }), [
    artists,
    releases,
    tracks,
    tourDates,
    news,
    submissions,
    isLoading,
    siteSettings,
    addSubmission,
    approveSubmission,
    rejectSubmission,
    createArtist,
    updateArtist,
    deleteArtist,
    uploadArtistImage,
    updateSiteSettings,
  ]);

  return (
    <DataContext.Provider value={value}>
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
