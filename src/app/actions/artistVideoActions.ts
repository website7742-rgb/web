'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { checkIsUserAdminAction } from '@/app/actions/authActions';
import { getYouTubeId } from '@/lib/utils';
import { validateVideoWithOembed, artistVideoService } from '@/services/ArtistVideoService';
import { artistVideoOverrideRepository, ArtistVideoOverride } from '@/lib/repositories/ArtistVideoOverrideRepository';

/**
 * 🔒 Internal Security Guard: Verify Studio Admin Privileges
 */
async function verifyStudioAdminCaller() {
  const cookieStore = cookies();
  const adminCookie = cookieStore.get('wshh_admin_session');
  const adminEmailCookie = cookieStore.get('wshh_admin_email')?.value;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabaseUserClient = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {}
    }
  });

  const { data: { user } } = await supabaseUserClient.auth.getUser();

  if (adminCookie?.value === 'authenticated') {
    if (adminEmailCookie && await checkIsUserAdminAction(undefined, adminEmailCookie)) {
      return { id: user?.id || 'studio-admin', email: adminEmailCookie };
    }
  }

  if (!user) {
    throw new Error('Unauthorized: Sign in required to manage artist visuals.');
  }

  const isAdmin = await checkIsUserAdminAction(user.id, user.email);
  if (!isAdmin) {
    throw new Error('Forbidden: Studio Administrator privileges required.');
  }

  return user;
}

function normalizeStr(text: string): string {
  return (text || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * 🎬 Server Action: Validate YouTube Video for Artist Spotlight
 * Checks live embeddability via oEmbed and evaluates match confidence against artist identity.
 */
export async function validateArtistVideoAction(inputUrlOrId: string, artistName: string) {
  try {
    await verifyStudioAdminCaller();

    if (!inputUrlOrId || typeof inputUrlOrId !== 'string') {
      return { success: false, error: 'Please enter a valid YouTube URL or Video ID.' };
    }

    const videoId = getYouTubeId(inputUrlOrId.trim());
    if (!videoId) {
      return {
        success: false,
        error: 'Invalid YouTube URL or ID. Must be a valid 11-character YouTube video identifier.',
      };
    }

    const oembed = await validateVideoWithOembed(videoId);
    if (!oembed || !oembed.valid) {
      return {
        success: false,
        error: 'Video cannot be embedded. It may be private, age-restricted, removed, or embedding is disabled by the creator.',
      };
    }

    const videoTitle = oembed.title || 'Official Music Video';
    const channelName = oembed.authorName || 'Official Channel';
    const normArtist = normalizeStr(artistName);
    const normTitle = normalizeStr(videoTitle);
    const normChannel = normalizeStr(channelName);

    // Compute match confidence
    let matchConfidence: 'EXACT' | 'WARNING' = 'EXACT';
    let warningMessage: string | null = null;

    const matchesTitle = normTitle.includes(normArtist) || normArtist.includes(normTitle);
    const matchesChannel = normChannel.includes(normArtist) || normArtist.includes(normChannel);

    if (!matchesTitle && !matchesChannel) {
      matchConfidence = 'WARNING';
      warningMessage = `Artist name "${artistName}" was not found in the video title ("${videoTitle}") or channel name ("${channelName}"). Please confirm this is the intended visual before publishing.`;
    }

    return {
      success: true,
      videoId,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      title: videoTitle,
      channelName,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      matchConfidence,
      warningMessage,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Validation failed.' };
  }
}

export interface PublishArtistVideoPayload {
  artistSlug: string;
  artistName: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  title: string;
  channelName: string;
  thumbnailUrl?: string;
  adminNote?: string;
  matchConfidence?: 'EXACT' | 'WARNING';
  publishedAt?: string;
}

/**
 * ⚡ Server Action: Publish or Replace Artist Spotlight Video Override
 */
export async function publishArtistVideoAction(payload: PublishArtistVideoPayload) {
  try {
    const user = await verifyStudioAdminCaller();

    if (!payload.artistSlug || !payload.youtubeVideoId) {
      return { success: false, error: 'Artist slug and YouTube video ID are required.' };
    }

    const videoId = getYouTubeId(payload.youtubeVideoId) || payload.youtubeVideoId;
    if (!videoId || videoId.length !== 11) {
      return { success: false, error: 'Invalid 11-character YouTube video ID.' };
    }

    // Persist override to repository
    const override = await artistVideoOverrideRepository.upsertOverride({
      artist_slug: payload.artistSlug,
      artist_name: payload.artistName,
      youtube_video_id: videoId,
      youtube_url: payload.youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`,
      title: payload.title,
      channel_name: payload.channelName,
      thumbnail_url: payload.thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      published_at: payload.publishedAt || new Date().toISOString(),
      is_active: true,
      admin_note: payload.adminNote,
      match_confidence: payload.matchConfidence || 'EXACT',
      created_by: user.id,
    });

    // Invalidate runtime server cache so public profile immediately loads manual visual
    artistVideoService.invalidateCache(payload.artistSlug);
    artistVideoService.invalidateCache(payload.artistName);

    // Revalidate Next.js static & ISR pages
    try {
      revalidatePath(`/roster/${payload.artistSlug}`);
      revalidatePath('/roster');
      revalidatePath('/studio/videos');
    } catch {
      // Revalidation best effort
    }

    return {
      success: true,
      message: `Official visual successfully assigned to ${payload.artistName}!`,
      override,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to publish video override.' };
  }
}

/**
 * ⚡ Server Action: Unpublish Artist Spotlight Video Override (reverts to automatic pipeline)
 */
export async function unpublishArtistVideoAction(artistSlug: string) {
  try {
    await verifyStudioAdminCaller();

    if (!artistSlug) {
      return { success: false, error: 'Artist slug is required.' };
    }

    await artistVideoOverrideRepository.unpublishOverride(artistSlug);

    // Invalidate cache so automatic resolution pipeline takes over immediately
    artistVideoService.invalidateCache(artistSlug);

    try {
      revalidatePath(`/roster/${artistSlug}`);
      revalidatePath('/roster');
      revalidatePath('/studio/videos');
    } catch {
      // Revalidation best effort
    }

    return {
      success: true,
      message: 'Spotlight override unpublished. Artist profile restored to automatic pipeline.',
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to unpublish override.' };
  }
}

/**
 * ⚡ Server Action: Remove Artist Spotlight Video Override
 */
export async function removeArtistVideoAction(artistSlug: string) {
  try {
    await verifyStudioAdminCaller();

    if (!artistSlug) {
      return { success: false, error: 'Artist slug is required.' };
    }

    await artistVideoOverrideRepository.deleteOverride(artistSlug);

    artistVideoService.invalidateCache(artistSlug);

    try {
      revalidatePath(`/roster/${artistSlug}`);
      revalidatePath('/roster');
      revalidatePath('/studio/videos');
    } catch {
      // Revalidation best effort
    }

    return {
      success: true,
      message: 'Spotlight override deleted permanently.',
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to remove override.' };
  }
}

/**
 * ⚡ Server Action: Fetch All Artist Video Overrides
 */
export async function getArtistVideoOverridesListAction(): Promise<{
  success: boolean;
  overrides?: ArtistVideoOverride[];
  error?: string;
}> {
  try {
    await verifyStudioAdminCaller();
    const overrides = await artistVideoOverrideRepository.getAllOverrides();
    return { success: true, overrides };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch overrides list.' };
  }
}
