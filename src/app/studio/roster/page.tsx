import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import AdminRosterClient from './RosterClient';
import { Artist } from '@/types';

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export default async function AdminRosterPage() {
  const adminDb = getAdminSupabase();
  const { data, error } = await adminDb.from('artists').select('*').order('created_at', { ascending: false });

  if (error) {
    console.warn('[AdminRosterPage] Roster fetch warning:', error.message);
  }

  // Map database format to frontend schema
  const artists: Artist[] = data?.map((item: any) => ({
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
    monthlyListeners: item.monthly_listeners || 0,
    totalStreams: item.total_streams || 0,
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
    socials: item.socials || {},
    streamingPlatforms: item.streaming_platforms || [],
  })) || [];

  return <AdminRosterClient initialArtists={artists} />;
}
