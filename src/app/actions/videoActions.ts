'use server';

import { safeAction, ActionState } from '@/lib/safeAction';
import { youtubeService } from '@/services/YoutubeService';
import { videoRepository } from '@/lib/repositories/VideoRepository';

/**
 * 🔒 Server Action: Manual Video Aggregation Trigger (Admin Control)
 * Wrapped in safeAction HOF pipeline.
 */
export const triggerManualVideoSync = safeAction<void, { videosFetched: number; insertedCount: number }>(
  async () => {
    console.log('[ServerAction:triggerManualVideoSync] Executing manual sync...');
    
    // 1. Fetch top trending Rap short videos (under 2 minutes)
    const videos = await youtubeService.fetchTrendingShortRapVideos(25);

    // 2. Validate with Zod and bulk upsert via VideoRepository
    const result = await videoRepository.bulkUpsertVideos(videos);

    return {
      videosFetched: videos.length,
      insertedCount: result.insertedCount,
    };
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
    if (!videoId) {
      throw new Error('Video ID is required.');
    }

    await videoRepository.toggleFeaturedVideo(videoId);
    return { videoId };
  }
);

/**
 * 🔒 Server Action: Delete Video Asset
 */
export const deleteVideoAction = safeAction<{ videoId: string }, { videoId: string }>(
  async (input) => {
    const videoId = input?.videoId;
    if (!videoId) {
      throw new Error('Video ID is required.');
    }

    await videoRepository.deleteVideo(videoId);
    return { videoId };
  }
);
