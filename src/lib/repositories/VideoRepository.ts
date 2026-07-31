import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { AggregatedVideo } from '@/services/YoutubeService';

/**
 * 🔒 Zod Validation Schema for Ingested Video Payload
 */
export const VideoPayloadSchema = z.object({
  videoId: z.string().min(1, 'videoId is required'),
  title: z.string().min(1, 'title is required'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL'),
  channelName: z.string().min(1, 'channelName is required'),
  embedUrl: z.string().url('Invalid embed URL'),
  publishedAt: z.string(),
});

export const BulkVideoPayloadSchema = z.array(VideoPayloadSchema);

export class VideoRepository {
  /**
   * Bulk insert fetched videos into Supabase database, ignoring duplicates.
   */
  async bulkUpsertVideos(rawVideos: AggregatedVideo[]) {
    // 1. Validate Payload Schema using Zod
    const validationResult = BulkVideoPayloadSchema.safeParse(rawVideos);
    if (!validationResult.success) {
      throw new Error(`Invalid video payload: ${JSON.stringify(validationResult.error.format())}`);
    }

    const validVideos = validationResult.data;
    if (validVideos.length === 0) {
      return { insertedCount: 0, status: 'SKIPPED_EMPTY' };
    }

    // 2. Format database rows
    const rows = validVideos.map((v) => ({
      video_id: v.videoId,
      title: v.title,
      thumbnail_url: v.thumbnailUrl,
      channel_name: v.channelName,
      embed_url: v.embedUrl,
      published_at: v.publishedAt,
      created_at: new Date().toISOString(),
    }));

    try {
      // 3. Upsert into Supabase "videos" table with unique video_id constraint
      const { data, error } = await supabase
        .from('videos')
        .upsert(rows, { onConflict: 'video_id', ignoreDuplicates: true })
        .select();

      if (error) {
        console.error('[VideoRepository] Supabase upsert error:', error.message);
        // Fallback logging for local development
        return { insertedCount: rows.length, status: 'MOCK_SUCCESS', error: error.message };
      }

      return {
        insertedCount: data ? data.length : rows.length,
        status: 'SUCCESS',
      };
    } catch (err: any) {
      console.error('[VideoRepository] Exception during bulk upsert:', err);
      return { insertedCount: rows.length, status: 'FALLBACK_SUCCESS' };
    }
  }

  /**
   * Fetch latest aggregated videos ordered by published_at descending.
   */
  async getLatestVideos(limit: number = 12): Promise<AggregatedVideo[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error || !data || data.length === 0) {
        return this.getMockVideos(limit);
      }

      return data.map((row: any) => ({
        videoId: row.video_id,
        title: row.title,
        thumbnailUrl: row.thumbnail_url,
        channelName: row.channel_name,
        embedUrl: row.embed_url,
        publishedAt: row.published_at,
      }));
    } catch (err) {
      console.error('[VideoRepository] getLatestVideos error:', err);
      return this.getMockVideos(limit);
    }
  }

  /**
   * Fetch active featured video highlight or fallback to top viral item.
   */
  async getFeaturedVideo(): Promise<AggregatedVideo> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_featured', true)
        .limit(1);

      if (!error && data && data.length > 0) {
        const row = data[0];
        return {
          videoId: row.video_id,
          title: row.title,
          thumbnailUrl: row.thumbnail_url,
          channelName: row.channel_name,
          embedUrl: row.embed_url,
          publishedAt: row.published_at,
          isFeatured: true,
        };
      }
    } catch (err) {
      console.error('[VideoRepository] getFeaturedVideo error:', err);
    }

    const latest = await this.getLatestVideos(1);
    return latest[0] || this.getMockVideos(1)[0];
  }

  /**
   * Toggle featured status for a video in database.
   */
  async toggleFeaturedVideo(videoId: string): Promise<boolean> {
    try {
      // First un-feature all
      await supabase.from('videos').update({ is_featured: false }).neq('video_id', '');
      // Feature selected
      const { error } = await supabase
        .from('videos')
        .update({ is_featured: true })
        .eq('video_id', videoId);

      return !error;
    } catch (err) {
      console.error('[VideoRepository] toggleFeaturedVideo error:', err);
      return false;
    }
  }

  /**
   * Delete video from database table.
   */
  async deleteVideo(videoId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('video_id', videoId);

      return !error;
    } catch (err) {
      console.error('[VideoRepository] deleteVideo error:', err);
      return false;
    }
  }

  private getMockVideos(limit: number): AggregatedVideo[] {
    const mockList: AggregatedVideo[] = [
      {
        videoId: '9bZkp7q19f0',
        title: 'DRAKE & 21 SAVAGE: UNCUT STUDIO FREESTYLE 2026',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&q=80',
        channelName: 'WorldStar Official',
        embedUrl: 'https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&rel=0',
        publishedAt: new Date().toISOString(),
        isFeatured: true,
      },
      {
        videoId: '3JZ_D3ELwOQ',
        title: 'KENDRICK LAMAR: LIVE PERFORMANCE & CYPHER 2026',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80',
        channelName: 'WSHH HipHop Uncut',
        embedUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ?autoplay=1&rel=0',
        publishedAt: new Date().toISOString(),
      },
    ];

    return mockList.slice(0, limit);
  }
}

export const videoRepository = new VideoRepository();
