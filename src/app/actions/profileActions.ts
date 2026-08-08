'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function getAuthSupabase() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {}
    }
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  
  return { supabase, user };
}

export interface ProfileSettingsPayload {
  full_name: string;
  bio?: string;
  instagram_url?: string;
  twitter_url?: string;
  country?: string;
  genre?: string;
}

/**
 * Fetch current user profile settings
 */
export async function getProfileSettingsAction() {
  try {
    const { supabase, user } = await getAuthSupabase();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, email, bio, instagram_url, twitter_url, country, genre')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;

    return {
      success: true,
      profile: {
        id: profile?.id || user.id,
        email: profile?.email || user.email || '',
        full_name: profile?.full_name || user.user_metadata?.full_name || 'ARTIST',
        avatar_url: profile?.avatar_url || null,
        bio: profile?.bio || '',
        country: profile?.country || 'USA',
        genre: profile?.genre || 'Hip-Hop',
        instagram_url: profile?.instagram_url || '',
        twitter_url: profile?.twitter_url || '',
      },
    };
  } catch (err: any) {
    console.error('[getProfileSettingsAction] Error:', err);
    return { success: false, error: err.message || 'Failed to load profile' };
  }
}

/**
 * Update user profile settings
 */
export async function updateProfileSettingsAction(payload: ProfileSettingsPayload) {
  try {
    const { supabase, user } = await getAuthSupabase();

    const fullName = payload.full_name.trim();
    if (!fullName) {
      return { success: false, error: 'Full name is required.' };
    }

    const updates = {
      id: user.id,
      full_name: fullName,
      bio: payload.bio?.trim() || null,
      instagram_url: payload.instagram_url?.trim() || null,
      twitter_url: payload.twitter_url?.trim() || null,
      country: payload.country?.trim() || 'USA',
      genre: payload.genre?.trim() || 'Hip-Hop',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(updates, { onConflict: 'id' });

    if (error) throw error;

    revalidatePath('/settings');
    revalidatePath('/roster');
    revalidatePath('/');

    return { success: true, message: 'Profile settings updated successfully!' };
  } catch (err: any) {
    console.error('[updateProfileSettingsAction] Error:', err);
    return { success: false, error: err.message || 'Failed to update profile settings.' };
  }
}
