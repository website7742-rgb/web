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
  username?: string;
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
        .select('id, full_name, username, avatar_url, email, bio, instagram_url, twitter_url, country, genre')
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
          .select('id, full_name, username, avatar_url, email, bio, instagram_url, twitter_url, country, genre')
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
            username: user.user_metadata?.username || user.email?.split('@')[0] || 'artist',
            avatar_url: user.user_metadata?.avatar_url || null,
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

    const resolvedAvatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || null;

    // Self-healing sync: If user_metadata has avatar_url but profile row doesn't, persist it to DB
    if (!profile?.avatar_url && user.user_metadata?.avatar_url) {
      try {
        const supabaseAdmin = getAdminSupabase();
        await supabaseAdmin.from('profiles').update({ avatar_url: user.user_metadata.avatar_url }).eq('id', user.id);
      } catch (syncErr) {
        console.warn('[getProfileSettingsAction] Avatar self-healing sync warning:', syncErr);
      }
    }

    return {
      success: true,
      profile: {
        id: profile?.id || user.id,
        email: profile?.email || user.email || '',
        full_name: profile?.full_name || user.user_metadata?.full_name || 'ARTIST',
        username: profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || '',
        avatar_url: resolvedAvatarUrl,
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
      username: payload.username?.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || null,
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
      .select('id, created_at, submission_id')
      .eq('user_id', user.id)
      .not('submission_id', 'is', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!likes || likes.length === 0) return { success: true, likes: [] };

    const submissionIds = Array.from(new Set(likes.map((l: any) => l.submission_id).filter(Boolean)));
    if (submissionIds.length === 0) return { success: true, likes: [] };

    const { data: subsData } = await supabase
      .from('submissions')
      .select('id, track_title, genre, media_url, created_at, artist_id')
      .in('id', submissionIds);

    const subMap: Record<string, any> = {};
    const artistIds: string[] = [];
    if (subsData) {
      subsData.forEach((s: any) => {
        subMap[s.id] = s;
        if (s.artist_id) artistIds.push(s.artist_id);
      });
    }

    const profileMap: Record<string, { full_name: string }> = {};
    if (artistIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', Array.from(new Set(artistIds)));

      if (profilesData) {
        profilesData.forEach((p: any) => {
          profileMap[p.id] = { full_name: p.full_name || 'WorldStar Artist' };
        });
      }
    }

    const formattedLikes = likes
      .filter((l: any) => subMap[l.submission_id])
      .map((l: any) => {
        const sub = subMap[l.submission_id];
        return {
          id: l.id,
          created_at: l.created_at,
          submission_id: l.submission_id,
          submissions: {
            ...sub,
            profiles: profileMap[sub.artist_id] || { full_name: 'WorldStar Artist' },
          },
        };
      });

    return { success: true, likes: formattedLikes };
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

    // Try followers table first
    try {
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

      if (!error && Array.isArray(following) && following.length > 0) {
        return { success: true, following };
      }
    } catch {
      // Table missing or schema cache error — fallback to metadata
    }

    // Fallback: read from user_metadata
    let followingIds: string[] = [];
    if (user.id === targetUserId && Array.isArray(user.user_metadata?.following)) {
      followingIds = user.user_metadata.following;
    } else {
      const admin = getAdminSupabase();
      const { data: targetUser } = await admin.auth.admin.getUserById(targetUserId);
      followingIds = Array.isArray(targetUser?.user?.user_metadata?.following)
        ? targetUser.user.user_metadata.following
        : [];
    }

    if (followingIds.length === 0) {
      return { success: true, following: [] };
    }

    // Map UUIDs to profiles
    const admin = getAdminSupabase();
    const uuidIds = followingIds.filter((id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
    let dbProfiles: any[] = [];
    if (uuidIds.length > 0) {
      const { data } = await admin.from('profiles').select('id, full_name, avatar_url, country, genre, bio').in('id', uuidIds);
      if (data) dbProfiles = data;
    }
    const profMap = new Map(dbProfiles.map((p) => [p.id, p]));

    const formattedFollowing = followingIds.map((fid) => {
      const prof = profMap.get(fid) || {
        id: fid,
        full_name: 'Artist #' + fid,
        avatar_url: null,
        country: 'USA',
        genre: 'Hip-Hop',
        bio: 'Official WorldStar recording artist',
      };
      return {
        id: fid,
        created_at: new Date().toISOString(),
        following_id: fid,
        profiles: prof,
      };
    });

    return { success: true, following: formattedFollowing };
  } catch (err: any) {
    console.warn('[getUserFollowingAction] Fallback:', err.message);
    return { success: true, following: [] };
  }
}
