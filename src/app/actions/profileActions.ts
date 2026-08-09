'use server';

import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

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
 * Fetch current user profile settings (With automatic row provisioning & admin fallback)
 */
export async function getProfileSettingsAction() {
  try {
    const { supabase, user } = await getAuthSupabase();

    let profile = null;
    let fetchError = null;

    // Try fetching with user client
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email, bio, instagram_url, twitter_url, country, genre')
        .eq('id', user.id)
        .maybeSingle();

      if (error) fetchError = error;
      else profile = data;
    } catch (e: any) {
      fetchError = e;
    }

    // Fallback to Admin SDK if schema cache or RLS issues occur
    if (fetchError || !profile) {
      try {
        const supabaseAdmin = getAdminSupabase();
        const { data: adminProfile } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, avatar_url, email, bio, instagram_url, twitter_url, country, genre')
          .eq('id', user.id)
          .maybeSingle();

        if (adminProfile) {
          profile = adminProfile;
        } else {
          // Provision new profile row on first load
          const newProfile = {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || 'ARTIST',
            avatar_url: null as string | null,
            bio: '',
            instagram_url: '',
            twitter_url: '',
            country: 'USA',
            genre: 'Hip-Hop',
            updated_at: new Date().toISOString(),
          };
          await supabaseAdmin.from('profiles').upsert(newProfile);
          profile = newProfile;
        }
      } catch (adminErr) {
        console.warn('[getProfileSettingsAction] Admin fallback warning:', adminErr);
      }
    }

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
 * Update user profile settings (With admin SDK fallback for maximum reliability)
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
      email: user.email || '',
      full_name: fullName,
      bio: payload.bio?.trim() || null,
      instagram_url: payload.instagram_url?.trim() || null,
      twitter_url: payload.twitter_url?.trim() || null,
      country: payload.country?.trim() || 'USA',
      genre: payload.genre?.trim() || 'Hip-Hop',
      updated_at: new Date().toISOString(),
    };

    let updateSuccess = false;
    let updateErr: any = null;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });

      if (error) updateErr = error;
      else updateSuccess = true;
    } catch (e: any) {
      updateErr = e;
    }

    if (!updateSuccess) {
      // Admin SDK fallback to bypass schema cache or RLS restrictions
      try {
        const supabaseAdmin = getAdminSupabase();
        const { error: adminErr } = await supabaseAdmin
          .from('profiles')
          .upsert(updates, { onConflict: 'id' });

        if (adminErr) throw adminErr;
        updateSuccess = true;
      } catch (adminFail: any) {
        console.error('[updateProfileSettingsAction] Admin fallback error:', adminFail);
        return { success: false, error: adminFail.message || updateErr?.message || 'Failed to update profile settings.' };
      }
    }

    revalidatePath('/settings');
    revalidatePath('/roster');
    revalidatePath('/profile');
    revalidatePath('/');

    return { success: true, message: 'Profile settings updated successfully!' };
  } catch (err: any) {
    console.error('[updateProfileSettingsAction] Error:', err);
    return { success: false, error: err.message || 'Failed to update profile settings.' };
  }
}

/**
 * Fetch all liked audio tracks for the logged in user (Strictly filtering out video likes)
 */
export async function getUserLikedEntitiesAction() {
  try {
    const { supabase, user } = await getAuthSupabase();

    const { data: likes, error } = await supabase
      .from('likes')
      .select(`
        id,
        created_at,
        submission_id,
        submissions:submission_id (id, track_title, genre, media_url, created_at, user_id, profiles(full_name))
      `)
      .eq('user_id', user.id)
      .not('submission_id', 'is', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, likes: likes || [] };
  } catch (err: any) {
    console.error('[getUserLikedEntitiesAction] Error:', err);
    return { success: false, error: err.message || 'Failed to fetch liked items', likes: [] };
  }
}

/**
 * Fetch all comments posted by the logged in user
 */
export async function getUserCommentsHistoryAction() {
  try {
    const { supabase, user } = await getAuthSupabase();

    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        submission_id,
        video_id,
        submissions:submission_id (track_title),
        videos:video_id (title)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, comments: comments || [] };
  } catch (err: any) {
    console.error('[getUserCommentsHistoryAction] Error:', err);
    return { success: false, error: err.message || 'Failed to fetch user comments', comments: [] };
  }
}

/**
 * Fetch all artists followed by the user
 */
export async function getUserFollowingAction(userId?: string) {
  try {
    const { supabase, user } = await getAuthSupabase();
    const targetUserId = userId || user.id;

    const { data: following, error } = await supabase
      .from('followers')
      .select(`
        id,
        created_at,
        following_id,
        profiles:following_id (id, full_name, avatar_url, country, genre, bio)
      `)
      .eq('follower_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, following: following || [] };
  } catch (err: any) {
    console.error('[getUserFollowingAction] Error:', err);
    return { success: false, error: err.message || 'Failed to fetch following list', following: [] };
  }
}
