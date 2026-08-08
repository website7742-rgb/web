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

/**
 * Toggle Like status for a submission (Hardened against PG unique constraint race conditions)
 */
export async function toggleLikeAction(submissionId: string) {
  try {
    const { supabase, user } = await getAuthSupabase();

    // Query existing like
    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('submission_id', submissionId)
      .maybeSingle();

    if (existing) {
      // Remove Like
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('submission_id', submissionId);

      if (error) throw error;
      revalidatePath('/');
      return { success: true, liked: false };
    } else {
      // Add Like
      const { error } = await supabase
        .from('likes')
        .insert({ user_id: user.id, submission_id: submissionId });

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

/**
 * Toggle Follow status for an artist (Hardened against PG unique constraint race conditions)
 */
export async function toggleFollowAction(artistId: string) {
  try {
    const { supabase, user } = await getAuthSupabase();

    if (user.id === artistId) {
      return { success: false, error: 'You cannot follow yourself.' };
    }

    // Query existing follow
    const { data: existing } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', artistId)
      .maybeSingle();

    if (existing) {
      // Unfollow
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', artistId);

      if (error) throw error;
      revalidatePath('/');
      return { success: true, following: false };
    } else {
      // Follow
      const { error } = await supabase
        .from('followers')
        .insert({ follower_id: user.id, following_id: artistId });

      if (error) {
        // PG Unique Constraint Violation (Code 23505) - User already followed in a race condition
        if (error.code === '23505' || error.message?.includes('duplicate key')) {
          console.info('[toggleFollowAction] Race condition handled: Unique constraint 23505 caught.');
          revalidatePath('/');
          return { success: true, following: true };
        }
        throw error;
      }

      revalidatePath('/');
      return { success: true, following: true };
    }
  } catch (err: any) {
    console.error('[toggleFollowAction] Error:', err);
    return { success: false, error: err.message || 'Failed to update follow status' };
  }
}

/**
 * Post a new comment on a submission
 */
export async function postCommentAction(submissionId: string, content: string) {
  try {
    const trimmed = content.trim();
    if (!trimmed) return { success: false, error: 'Comment cannot be empty.' };

    const { supabase, user } = await getAuthSupabase();

    const { error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        submission_id: submissionId,
        content: trimmed,
      });

    if (error) throw error;

    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('[postCommentAction] Error:', err);
    return { success: false, error: err.message || 'Failed to post comment' };
  }
}
