'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function getAuthSupabase() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} }
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  
  return { supabase, user };
}

export async function toggleLikeAction(entityId: string, currentLikeStatus: boolean) {
  try {
    const { supabase, user } = await getAuthSupabase();

    if (currentLikeStatus) {
      // Remove Like
      await supabase.from('likes').delete().eq('user_id', user.id).eq('entity_id', entityId);
    } else {
      // Add Like
      await supabase.from('likes').insert({ user_id: user.id, entity_id: entityId });
    }

    revalidatePath('/'); // Revalidate feed
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleFollowAction(artistId: string, currentFollowStatus: boolean) {
  try {
    const { supabase, user } = await getAuthSupabase();

    if (currentFollowStatus) {
      // Unfollow
      await supabase.from('followers').delete().eq('follower_id', user.id).eq('following_id', artistId);
    } else {
      // Follow
      await supabase.from('followers').insert({ follower_id: user.id, following_id: artistId });
    }

    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function postCommentAction(entityId: string, content: string) {
  try {
    if (!content.trim()) throw new Error('Comment cannot be empty.');
    
    const { supabase, user } = await getAuthSupabase();

    const { error } = await supabase.from('comments').insert({
      user_id: user.id,
      entity_id: entityId,
      content: content.trim()
    });

    if (error) throw error;

    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
