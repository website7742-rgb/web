import { OFFICIAL_100_VIDEOS } from '@/data/official100Videos';


export interface AggregatedVideo {
  id?: string;
  videoId: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  embedUrl: string;
  videoUrl?: string;
  youtubeUrl?: string;
  publishedAt: string;
  description?: string;
  viewsCount?: string;
  isFeatured?: boolean;
  artistId?: string;
  artistName?: string;
  releaseDate?: string;
  genre?: string;
  youtubeId?: string;
  coverUrl?: string;
  rank?: number;
  requestedSong?: string;
  requestedArtist?: string;
  channelType?: string;
  status?: 'MATCHED' | 'UNRESOLVED';
}

export interface FetchVideosOptions {
  limit?: number; // Supports up to 100 videos
  query?: string;
  order?: 'date' | 'relevance' | 'viewCount';
  forceRefresh?: boolean;
}

export interface FetchVideosResult {
  success: boolean;
  videos: AggregatedVideo[];
  total: number;
  cached: boolean;
  source: 'live_youtube_api' | 'cache' | 'fallback';
  error?: string;
  message?: string;
  nextPageToken?: string;
}

interface CacheEntry {
  timestamp: number;
  videos: AggregatedVideo[];
  query: string;
}

function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export class YoutubeService {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL to preserve API quota

  private getApiKey(): string {
    return process.env.YOUTUBE_API_KEY || '';
  }

  /**
   * Fetch the latest Hip-Hop videos with automatic pagination up to 100 results.
   */
  async fetchLatestHipHopVideos(options: FetchVideosOptions = {}): Promise<FetchVideosResult> {
    const {
      limit = 100,
      query = 'Hip Hop music video OR Rap music video',
      order = 'date',
      forceRefresh = false,
    } = options;

    const cacheKey = `${query}_${order}_${limit}`;
    const apiKey = this.getApiKey();

    // 1. Check in-memory server cache (Unless forceRefresh is true)
    if (!forceRefresh && this.cache.has(cacheKey)) {
      const entry = this.cache.get(cacheKey)!;
      const age = Date.now() - entry.timestamp;
      if (age < this.CACHE_TTL_MS && entry.videos.length > 0) {
        return {
          success: true,
          videos: entry.videos,
          total: entry.videos.length,
          cached: true,
          source: 'cache',
        };
      }
    }

    // 2. Check for missing API key
    if (!apiKey) {
      console.warn('[YoutubeService] YOUTUBE_API_KEY environment variable is not configured.');
      const fallback = this.getCuratedFallbackVideos();
      return {
        success: false,
        videos: fallback,
        total: fallback.length,
        cached: false,
        source: 'fallback',
        error: 'MISSING_API_KEY',
        message: 'Server configuration required: Please add YOUTUBE_API_KEY to your environment variables to enable live YouTube Data API fetching.',
      };
    }

    // 3. Paginated Fetching Loop (YouTube Data API v3 search.list maxResults=50 per call)
    try {
      const allVideos: AggregatedVideo[] = [];
      const seenIds = new Set<string>();
      let pageToken: string | undefined = undefined;
      const targetCount = Math.min(Math.max(limit, 1), 100); // Cap between 1 and 100
      let lastPageToken: string | undefined = undefined;

      while (allVideos.length < targetCount) {
        const batchSize = Math.min(targetCount - allVideos.length, 50);
        const endpoint = new URL('https://www.googleapis.com/youtube/v3/search');
        endpoint.searchParams.set('part', 'snippet');
        endpoint.searchParams.set('q', query);
        endpoint.searchParams.set('type', 'video');
        endpoint.searchParams.set('videoEmbeddable', 'true');
        endpoint.searchParams.set('order', order);
        endpoint.searchParams.set('maxResults', batchSize.toString());
        endpoint.searchParams.set('key', apiKey);

        if (pageToken) {
          endpoint.searchParams.set('pageToken', pageToken);
        }

        const res = await fetch(endpoint.toString(), {
          headers: { Accept: 'application/json' },
          next: { revalidate: 3600 },
        });

        if (!res.ok) {
          const errorBody = await res.text();
          let parsedError = errorBody;
          try {
            const parsed = JSON.parse(errorBody);
            parsedError = parsed.error?.message || errorBody;
          } catch {}

          console.error(`[YoutubeService] YouTube API responded with HTTP ${res.status}:`, parsedError);

          if (res.status === 403) {
            // Quota exceeded or permission error
            const fallback = this.getCuratedFallbackVideos();
            return {
              success: false,
              videos: fallback,
              total: fallback.length,
              cached: false,
              source: 'fallback',
              error: 'QUOTA_EXCEEDED_OR_FORBIDDEN',
              message: `YouTube Data API quota exceeded or access forbidden: ${parsedError}`,
            };
          }

          throw new Error(`YouTube API HTTP ${res.status}: ${parsedError}`);
        }

        const data = await res.json();
        const items = data.items || [];
        if (!Array.isArray(items) || items.length === 0) {
          break; // No more items returned
        }

        for (const item of items) {
          const videoId = item.id?.videoId;
          if (!videoId || seenIds.has(videoId)) continue;

          seenIds.add(videoId);

          const title = decodeHtmlEntities(item.snippet?.title || 'Hip-Hop Premiere');
          const channelName = decodeHtmlEntities(item.snippet?.channelTitle || 'Hip-Hop Channel');
          const description = decodeHtmlEntities(item.snippet?.description || '');
          const publishedAt = item.snippet?.publishedAt || new Date().toISOString();

          // Select best resolution thumbnail available
          const thumbs = item.snippet?.thumbnails || {};
          const thumbnailUrl =
            thumbs.maxres?.url ||
            thumbs.high?.url ||
            thumbs.medium?.url ||
            thumbs.default?.url ||
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

          allVideos.push({
            videoId,
            title,
            channelName,
            publishedAt,
            description,
            thumbnailUrl,
            youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
            embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
            genre: 'Hip-Hop',
          });
        }

        lastPageToken = data.nextPageToken;
        pageToken = data.nextPageToken;

        // If no next page token exists, we've reached the end of YouTube's search results
        if (!pageToken) {
          break;
        }
      }

      // 4. Update in-memory cache
      if (allVideos.length > 0) {
        this.cache.set(cacheKey, {
          timestamp: Date.now(),
          videos: allVideos,
          query,
        });
      }

      return {
        success: true,
        videos: allVideos,
        total: allVideos.length,
        cached: false,
        source: 'live_youtube_api',
        nextPageToken: lastPageToken,
      };
    } catch (err: any) {
      console.error('[YoutubeService] Exception fetching YouTube videos:', err.message);
      const fallback = this.getCuratedFallbackVideos();
      return {
        success: false,
        videos: fallback,
        total: fallback.length,
        cached: false,
        source: 'fallback',
        error: 'NETWORK_OR_API_EXCEPTION',
        message: err.message || 'Error communicating with YouTube Data API',
      };
    }
  }

  /**
   * Backward-compatible helper for legacy cron & manual sync triggers
   */
  async fetchTrendingShortRapVideos(limit: number = 25): Promise<AggregatedVideo[]> {
    const res = await this.fetchLatestHipHopVideos({
      limit,
      query: 'Rap OR Hip Hop Music Video',
      order: 'date',
    });
    return res.videos;
  }

  /**
   * High-quality curated fallback videos with verified, embeddable YouTube IDs
   * strictly used when the API key is not yet set or quota is exhausted.
   */
  private getCuratedFallbackVideos(): AggregatedVideo[] {
    return OFFICIAL_100_VIDEOS.map((track) => ({
      videoId: track.videoId !== 'NONE' ? track.videoId : `unresolved-${track.rank}`,
      title: `${track.requestedSong} — ${track.requestedArtist}`,
      thumbnailUrl: track.thumbnailUrl || (track.videoId !== 'NONE' ? `https://i.ytimg.com/vi/${track.videoId}/hqdefault.jpg` : '/images/placeholders/video-placeholder.svg'),
      channelName: track.channel !== 'NONE' ? track.channel : track.requestedArtist,
      artistName: track.requestedArtist,
      embedUrl: track.embedUrl || (track.videoId !== 'NONE' ? `https://www.youtube.com/embed/${track.videoId}?autoplay=1&rel=0` : ''),
      youtubeUrl: track.youtubeUrl || (track.videoId !== 'NONE' ? `https://www.youtube.com/watch?v=${track.videoId}` : ''),
      publishedAt: '2026-01-01T00:00:00Z',
      genre: 'Hip-Hop',
      rank: track.rank,
      requestedSong: track.requestedSong,
      requestedArtist: track.requestedArtist,
      channelType: track.channelType,
      status: track.status,
    }));
  }
}

export const youtubeService = new YoutubeService();

