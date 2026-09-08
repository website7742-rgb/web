'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { safeAction } from '@/lib/safeAction';
import { youtubeService } from '@/services/YoutubeService';
import { videoRepository } from '@/lib/repositories/VideoRepository';
import { unifiedVideoService } from '@/services/UnifiedVideoService';

/**
 * Utility to extract 11-character YouTube Video ID from any YouTube URL format
 */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase admin environment variables are missing.');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }),
    },
  });
}

/**
 * 🎬 Server Action: Submit YouTube Video with Automatic Metadata Extraction
 */
export async function submitYouTubeVideoAction(
  youtubeUrl: string,
  artistName: string,
  options?: { title?: string; genre?: string; is_featured?: boolean; description?: string }
) {
  try {
    const trimmedUrl = youtubeUrl.trim();
    const trimmedArtist = artistName.trim();

    if (!trimmedUrl) return { success: false, error: 'YouTube URL is required.' };
    if (!trimmedArtist) return { success: false, error: 'Artist Name is required.' };

    const videoId = extractYouTubeId(trimmedUrl);
    if (!videoId) {
      return { success: false, error: 'Invalid YouTube URL. Please provide a valid YouTube video link.' };
    }

    // 1. Fetch official Video Title dynamically via YouTube oEmbed API if not explicitly provided
    let videoTitle = options?.title?.trim() || `${trimmedArtist} - WORLDSTAR EXCLUSIVE`;
    if (!options?.title?.trim()) {
      try {
        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(trimmedUrl)}&format=json`);
        if (oembedRes.ok) {
          const data = await oembedRes.json();
          if (data.title) {
            videoTitle = data.title;
          }
        }
      } catch (e) {
        console.warn('[submitYouTubeVideoAction] oEmbed fetch fallback triggered:', e);
      }
    }

    // 2. Construct thumbnail URL & clean YouTube URL
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const cleanVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // 3. Insert into public.videos table via Admin Supabase
    const supabaseAdmin = getSupabaseAdmin();

    // Check for duplicate video ID to avoid raw SQL constraint violation
    const { data: existing } = await supabaseAdmin
      .from('videos')
      .select('id, title')
      .eq('video_id', videoId)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: `This video is already in the showcase: "${existing.title}".`,
      };
    }

    const { data: inserted, error } = await supabaseAdmin
      .from('videos')
      .insert({
        video_id: videoId,
        title: videoTitle,
        artist_name: trimmedArtist,
        channel_name: trimmedArtist,
        video_url: cleanVideoUrl,
        embed_url: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`,
        thumbnail_url: thumbnailUrl,
        genre: options?.genre?.trim() || 'Hip-Hop',
        is_featured: options?.is_featured ?? false,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/videos');
    revalidatePath('/admin/videos');
    revalidatePath('/api/videos');
    revalidatePath('/');
    unifiedVideoService.invalidateCache();

    return {
      success: true,
      message: 'YouTube video curated and added to WorldStar Videos showcase!',
      video: inserted,
    };
  } catch (err: any) {
    console.error('[submitYouTubeVideoAction] Error:', err);
    return { success: false, error: err.message || 'Failed to add YouTube video.' };
  }
}

/**
 * ✏️ Update Curated Video Action for Admin
 */
export async function updateAdminVideoAction(id: string, updates: {
  title?: string;
  artist_name?: string;
  video_url?: string;
  thumbnail_url?: string;
  genre?: string;
  is_featured?: boolean;
}) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const payload: Record<string, any> = {};
    if (updates.title !== undefined) payload.title = updates.title.trim();
    if (updates.artist_name !== undefined) payload.artist_name = updates.artist_name.trim();
    if (updates.video_url !== undefined) payload.video_url = updates.video_url.trim();
    if (updates.thumbnail_url !== undefined) payload.thumbnail_url = updates.thumbnail_url.trim();
    if (updates.genre !== undefined) payload.genre = updates.genre.trim();
    if (updates.is_featured !== undefined) payload.is_featured = updates.is_featured;

    const { data: updated, error } = await supabaseAdmin
      .from('videos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/videos');
    revalidatePath('/admin/videos');
    revalidatePath('/api/videos');
    revalidatePath('/');
    unifiedVideoService.invalidateCache();

    return { success: true, message: 'Video updated successfully.', video: updated };
  } catch (err: any) {
    console.error('[updateAdminVideoAction] Error:', err);
    return { success: false, error: err.message || 'Failed to update video.' };
  }
}

/**
 * 🔒 Fetch all curated videos for Admin Panel
 */
export async function getAllAdminVideosAction() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data: videos, error } = await supabaseAdmin
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, videos: videos || [] };
  } catch (err: any) {
    console.error('[getAllAdminVideosAction] Error:', err);
    return { success: false, error: err.message || 'Failed to fetch videos', videos: [] };
  }
}

/**
 * 🗑️ Delete Video Action for Admin
 */
export async function deleteAdminVideoAction(id: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/videos');
    revalidatePath('/admin/videos');
    revalidatePath('/api/videos');
    revalidatePath('/');
    unifiedVideoService.invalidateCache();

    return { success: true, message: 'Video removed successfully.' };
  } catch (err: any) {
    console.error('[deleteAdminVideoAction] Error:', err);
    return { success: false, error: err.message || 'Failed to delete video.' };
  }
}

/**
 * 🔒 Server Action: Manual Video Aggregation Trigger (Legacy Admin Control)
 */
export const triggerManualVideoSync = safeAction<void, { videosFetched: number; insertedCount: number }>(
  async () => {
    const videos = await youtubeService.fetchTrendingShortRapVideos(25);
    const result = await videoRepository.bulkUpsertVideos(videos);
    return { videosFetched: videos.length, insertedCount: result.insertedCount };
  }
);

/**
 * 🔒 Server Action: Fetch Latest Aggregated Videos
 */
export const fetchLatestVideosAction = safeAction<void, any>(
  async () => {
    return await videoRepository.getLatestVideos(12);
  }
);

/**
 * 🔒 Server Action: Toggle Hero Highlight Video
 */
export const toggleFeaturedVideoAction = safeAction<{ videoId: string }, { videoId: string }>(
  async (input) => {
    const videoId = input?.videoId;
    if (!videoId) throw new Error('Video ID is required.');
    await videoRepository.toggleFeaturedVideo(videoId);
    return { videoId };
  }
);

/**
 * 🔒 Server Action: Delete Video Asset (Legacy)
 */
export const deleteVideoAction = safeAction<{ videoId: string }, { videoId: string }>(
  async (input) => {
    const videoId = input?.videoId;
    if (!videoId) throw new Error('Video ID is required.');
    await videoRepository.deleteVideo(videoId);
    return { videoId };
  }
);
