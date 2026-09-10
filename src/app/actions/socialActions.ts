'use server';

import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export type EntityType = 'TRACK' | 'VIDEO';

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

/**
 * Toggle Like status for a submission or video (Polymorphic support)
 */
export async function toggleLikeAction(entityId: string, entityType: EntityType = 'TRACK') {
  try {
    const { supabase, user } = await getAuthSupabase();
    const column = entityType === 'VIDEO' ? 'video_id' : 'submission_id';

    // Query existing like
    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq(column, entityId)
      .maybeSingle();

    if (existing) {
      // Remove Like
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq(column, entityId);

      if (error) throw error;
      revalidatePath('/');
      return { success: true, liked: false };
    } else {
      // Add Like
      const insertData = {
        user_id: user.id,
        [column]: entityId,
      };

      const { error } = await supabase
        .from('likes')
        .insert(insertData);

      if (error) {
        // PG Unique Constraint Violation (Code 23505) - User already liked in a race condition
        if (error.code === '23505' || error.message?.includes('duplicate key')) {
          console.info('[toggleLikeAction] Race condition handled: Unique constraint 23505 caught.');
          revalidatePath('/');
          return { success: true, liked: true };
        }
        throw error;
      }

      revalidatePath('/');
      return { success: true, liked: true };
    }
  } catch (err: any) {
    console.error('[toggleLikeAction] Error:', err);
    return { success: false, error: err.message || 'Failed to update like status' };
  }
}

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Toggle Follow status for an artist
 */
export async function toggleFollowAction(artistId: string) {
  try {
    const { supabase, user } = await getAuthSupabase();

    if (user.id === artistId) {
      return { success: false, error: 'You cannot follow yourself.' };
    }

    // Attempt table-based follow first
    try {
      const { data: existing, error: queryErr } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', artistId)
        .maybeSingle();

      if (queryErr) throw queryErr;

      if (existing) {
        // Unfollow
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', artistId);

        if (error) throw error;
        revalidatePath('/roster');
        revalidatePath('/profile');
        revalidatePath('/');
        return { success: true, following: false };
      } else {
        // Follow
        const { error } = await supabase
          .from('followers')
          .insert({ follower_id: user.id, following_id: artistId });

        if (error) {
          if (error.code === '23505' || error.message?.includes('duplicate key')) {
            revalidatePath('/roster');
            revalidatePath('/profile');
            revalidatePath('/');
            return { success: true, following: true };
          }
          throw error;
        }

        revalidatePath('/roster');
        revalidatePath('/profile');
        revalidatePath('/');
        return { success: true, following: true };
      }
    } catch {
      // Followers table not available or schema cache issue — fallback to user_metadata persistence
      const admin = getAdminSupabase();
      const { data: userData } = await admin.auth.admin.getUserById(user.id);
      const followingList: string[] = Array.isArray(userData?.user?.user_metadata?.following)
        ? userData.user.user_metadata.following
        : [];

      const isAlreadyFollowing = followingList.includes(artistId);
      let updatedList: string[];
      let nextState: boolean;

      if (isAlreadyFollowing) {
        updatedList = followingList.filter((id) => id !== artistId);
        nextState = false;
      } else {
        updatedList = [...followingList, artistId];
        nextState = true;
      }

      await admin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...(userData?.user?.user_metadata || {}),
          following: updatedList,
        },
      });

      revalidatePath('/roster');
      revalidatePath('/profile');
      revalidatePath('/');
      return { success: true, following: nextState };
    }
  } catch (err: any) {
    console.error('[toggleFollowAction] Error:', err);
    return { success: false, error: err.message || 'Failed to update follow status' };
  }
}

/**
 * Fetch followed artist IDs for the current authenticated user
 */
export async function getUserFollowingIdsAction(): Promise<string[]> {
  try {
    const { supabase, user } = await getAuthSupabase();
    if (!user) return [];

    // Check table first
    try {
      const { data: rows, error: qErr } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', user.id);
      if (qErr) throw qErr;
      if (rows && rows.length > 0) {
        return rows.map((r: any) => r.following_id);
      }
    } catch {
      // Ignore table error, fallback to user_metadata
    }

    // Fallback: user_metadata
    const following = user.user_metadata?.following;
    if (Array.isArray(following)) return following;

    const admin = getAdminSupabase();
    const { data: userData } = await admin.auth.admin.getUserById(user.id);
    return Array.isArray(userData?.user?.user_metadata?.following) ? userData.user.user_metadata.following : [];
  } catch {
    return [];
  }
}

/**
 * Post a new comment on a submission or video (Polymorphic support)
 */
export async function postCommentAction(entityId: string, content: string, entityType: EntityType = 'TRACK') {
  try {
    if (!entityId || typeof entityId !== 'string' || entityId.trim().length === 0 || entityId.length > 128) {
      return { success: false, error: 'Invalid entity identifier.' };
    }

    const trimmed = (content || '').trim();
    if (!trimmed) return { success: false, error: 'Comment cannot be empty.' };
    if (trimmed.length > 1000) {
      return { success: false, error: 'Comment is too long (maximum 1000 characters allowed).' };
    }

    const { supabase, user } = await getAuthSupabase();
    const column = entityType === 'VIDEO' ? 'video_id' : 'submission_id';

    const insertData = {
      user_id: user.id,
      [column]: entityId,
      content: trimmed,
    };

    const { error } = await supabase
      .from('comments')
      .insert(insertData);

    if (error) throw error;

    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('[postCommentAction] Error:', err);
    return { success: false, error: err.message || 'Failed to post comment' };
  }
}

/**
 * Fetch comments for a specific submission or video (Polymorphic support)
 */
export async function getSubmissionCommentsAction(entityId: string, entityType: EntityType = 'TRACK') {
  try {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} }
    });

    const column = entityType === 'VIDEO' ? 'video_id' : 'submission_id';

    const { data: comments, error } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id, profiles(full_name, avatar_url)')
      .eq(column, entityId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, comments: comments || [] };
  } catch (err: any) {
    console.error('[getSubmissionCommentsAction] Error:', err);
    return { success: false, error: err.message || 'Failed to fetch comments', comments: [] };
  }
}

export const getCommentsAction = getSubmissionCommentsAction;
