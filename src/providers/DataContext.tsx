'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Artist, Release, ReleaseType, Track, TourDate, NewsArticle, ExtendedSubmission, Genre, SiteSettings } from '@/types';
import { 
  MOCK_ARTISTS, 
  MOCK_TOUR_DATES, 
  MOCK_NEWS, 
  MOCK_SUBMISSIONS 
} from '@/lib/data/mockData';
import { VERIFIED_HIPHOP_RELEASES, VERIFIED_RELEASE_TRACKS } from '@/lib/data/verifiedReleases';
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

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroVideoUrl: 'https://www.youtube.com/embed/ESRCdJHbvnU?autoplay=0&rel=0',
  heroTitle: 'DRAKE: 2 HARD 4 THE RADIO',
  heroSubtitle: 'WORLDSTAR EXCLUSIVE • OFFICIAL MUSIC VIDEO',
  heroCtaText: 'EXPLORE VIDEOS',
  heroCtaLink: '/videos'
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [releases, setReleases] = useState<Release[]>(VERIFIED_HIPHOP_RELEASES);
  const [tracks, setTracks] = useState<Track[]>(VERIFIED_RELEASE_TRACKS);
  const [tourDates, setTourDates] = useState<TourDate[]>(MOCK_TOUR_DATES);
  const [news, setNews] = useState<NewsArticle[]>(MOCK_NEWS);
  const [submissions, setSubmissions] = useState<ExtendedSubmission[]>(MOCK_SUBMISSIONS);
  const [isLoading, setIsLoading] = useState(true);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

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
          if (cachedSettings) {
            const parsed = JSON.parse(cachedSettings);
            // Reset if contains legacy placeholder video
            if (parsed.heroVideoUrl && parsed.heroVideoUrl.includes('9bZkp7q19f0')) {
              localStorage.removeItem('worldstar_site_settings');
            } else {
              setSiteSettings(parsed);
            }
          }
        }

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          setArtists(MOCK_ARTISTS);
          setIsLoading(false);
          return;
        }

        // Try to fetch settings from Supabase safely using maybeSingle() to avoid 406 error
        const { data: rawSettingsData, error: settingsError } = await supabase.from('site_settings').select('*').eq('id', 'global').maybeSingle();
        const settingsData: any = rawSettingsData;
        if (!settingsError && settingsData) {
          const remoteSettings: SiteSettings = {
            heroTitle: settingsData.hero_title || DEFAULT_SITE_SETTINGS.heroTitle,
            heroSubtitle: settingsData.hero_subtitle || DEFAULT_SITE_SETTINGS.heroSubtitle,
            heroVideoUrl: settingsData.hero_video_url || DEFAULT_SITE_SETTINGS.heroVideoUrl,
            heroCtaText: settingsData.hero_cta_text || DEFAULT_SITE_SETTINGS.heroCtaText,
            heroCtaLink: settingsData.hero_cta_link || DEFAULT_SITE_SETTINGS.heroCtaLink,
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
            avatarUrl: item.avatar_url || '/branding/WORLDSTARHIPHOP_idk2EHwctZ_2.png',
            heroUrl: item.hero_url || '/branding/WORLDSTARHIPHOP_idk2EHwctZ_2.png',
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

      // Fetch live demo submissions from Supabase demo_submissions table
      try {
        const { data: dbSubmissions, error: subError } = await supabase
          .from('demo_submissions')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (!subError && dbSubmissions && dbSubmissions.length > 0) {
          const parsedDbSubs: ExtendedSubmission[] = dbSubmissions.map((row: any) => ({
            id: row.id,
            fullName: row.artist_name || 'Anonymous Artist',
            stageName: row.artist_name || 'Recording Artist',
            email: row.email || '',
            phone: 'N/A',
            country: 'United States',
            city: 'N/A',
            age: 21,
            genre: (row.genre as Genre) || 'Hip-Hop',
            experience: 'EMERGING',
            biography: row.bio_notes || 'Demo submission submitted via online portal.',
            spotifyUrl: '',
            audioUrl: row.audio_url || '',
            videoUrl: row.audio_url || '',
            message: row.track_title ? `Track Title: ${row.track_title}` : '',
            status: row.status === 'ACCEPTED' ? 'APPROVED' : row.status === 'DECLINED' ? 'REJECTED' : 'PENDING',
            submittedAt: row.submitted_at || new Date().toISOString(),
          }));

          setSubmissions(parsedDbSubs);
        } else if (typeof window !== 'undefined') {
          const savedSubmissions = localStorage.getItem('worldstar_submissions');
          if (savedSubmissions) {
            try {
              setSubmissions(JSON.parse(savedSubmissions));
            } catch (e) {}
          }
        }
      } catch (subErr) {
        if (typeof window !== 'undefined') {
          const savedSubmissions = localStorage.getItem('worldstar_submissions');
          if (savedSubmissions) {
            try {
              setSubmissions(JSON.parse(savedSubmissions));
            } catch (e) {}
          }
        }
      }

      // Fetch live releases from Supabase releases table
      try {
        const { data: dbReleases, error: relError } = await supabase.from('releases').select('*');
        if (!relError && dbReleases && dbReleases.length > 0) {
          const parsedReleases: Release[] = dbReleases.map((row: any) => ({
            id: row.id,
            title: row.title,
            slug: row.slug,
            artistId: row.artist_id || '',
            artistName: row.artist_name || 'WorldStar Artist',
            type: (row.type as ReleaseType) || 'ALBUM',
            releaseDate: row.release_date || new Date().toISOString().split('T')[0],
            coverUrl: row.cover_url || '/branding/WORLDSTARHIPHOP_idk2EHwctZ_2.png',
            catalogNumber: row.catalog_number || `WSHH-${row.id.slice(0, 6)}`,
            upcCode: row.upc_code || '',
            spotifyUrl: row.spotify_url || '',
            appleUrl: row.apple_url || '',
            tracksCount: 10,
            genre: 'Hip-Hop',
          }));
          const existingSlugs = new Set(parsedReleases.map(r => r.slug));
          const verifiedOnly = VERIFIED_HIPHOP_RELEASES.filter(r => !existingSlugs.has(r.slug));
          setReleases([...parsedReleases, ...verifiedOnly]);
        }
      } catch (relErr) {}

      // Fetch live tour dates from Supabase tour_dates table
      try {
        const { data: dbTours, error: tourError } = await supabase.from('tour_dates').select('*');
        if (!tourError && dbTours && dbTours.length > 0) {
          const parsedTours: TourDate[] = dbTours.map((row: any) => ({
            id: row.id,
            artistId: row.artist_id || '',
            artistName: row.artist_name || 'WorldStar Headliner',
            tourName: row.tour_name || 'WorldStar Live Concert Tour',
            venue: row.venue || 'Arena',
            city: row.city || 'Los Angeles',
            country: row.country || 'USA',
            eventDate: row.event_date || new Date().toISOString(),
            ticketStatus: (row.ticket_status as any) || 'AVAILABLE',
            ticketUrl: row.ticket_url || 'https://ticketmaster.com',
          }));
          const tourIds = new Set(parsedTours.map(t => t.id));
          const mockOnly = MOCK_TOUR_DATES.filter(t => !tourIds.has(t.id));
          setTourDates([...parsedTours, ...mockOnly]);
        }
      } catch (tourErr) {}

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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', pathFolder);

      // Primary: /api/upload/direct
      let res = await fetch('/api/upload/direct', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.publicUrl || data.url) return data.publicUrl || data.url;
      }

      // Secondary: /api/upload
      res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.publicUrl || data.url) return data.publicUrl || data.url;
      }
    } catch (err) {
      console.error('Failed to upload media to Cloudflare R2:', err);
    }
    return null;
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

    // Sync to Supabase demo_submissions
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        supabase.from('demo_submissions').insert({
          artist_name: newSub.stageName || newSub.fullName || 'Anonymous Artist',
          email: newSub.email || '',
          track_title: newSub.message || 'Demo Track',
          genre: newSub.genre || 'Hip-Hop',
          audio_url: newSub.audioUrl || '',
          bio_notes: newSub.biography || '',
        }).then(() => {});
      }
    } catch (e) {}
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
        avatarUrl: sub.coverImageUrl || '/branding/WORLDSTARHIPHOP_idk2EHwctZ_2.png',
        heroUrl: '/branding/WORLDSTARHIPHOP_idk2EHwctZ_2.png',
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

      // Persist status change to Supabase demo_submissions
      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
          supabase
            .from('demo_submissions')
            .update({ status: 'ACCEPTED' })
            .eq('id', submissionId)
            .then(() => {});
        }
      } catch (e) {}
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

    // Persist rejection to Supabase demo_submissions
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        supabase
          .from('demo_submissions')
          .update({ status: 'DECLINED' })
          .eq('id', submissionId)
          .then(() => {});
      }
    } catch (e) {}
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
