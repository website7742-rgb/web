/**
 * 🎥 YouTube Data API v3 Service
 * PRODUCTION-READY RAP & HIP-HOP AGGREGATION ENGINE
 * 
 * Features:
 * - Direct YouTube Data API v3 integration
 * - Paginated fetching (retrieves up to 100 videos via batched API requests)
 * - De-duplication of video IDs
 * - Server-side in-memory caching (1-hour TTL) to strictly protect YouTube quota
 * - Official YouTube embed URL generation (No re-hosting on R2/Supabase)
 * - Safe HTML entity decoding for song titles & channel names
 * - Graceful fallback handling when YOUTUBE_API_KEY is missing or quota is exhausted
 */

export interface AggregatedVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  embedUrl: string;
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
    return [
      {
        videoId: 'JqFQkAeCBgA',
        title: 'Kendrick Lamar — HUMBLE. (Official Music Video)',
        thumbnailUrl: 'https://img.youtube.com/vi/JqFQkAeCBgA/maxresdefault.jpg',
        channelName: 'Kendrick Lamar',
        embedUrl: 'https://www.youtube.com/embed/JqFQkAeCBgA?autoplay=1&rel=0',
        youtubeUrl: 'https://www.youtube.com/watch?v=JqFQkAeCBgA',
        publishedAt: '2024-01-01T00:00:00Z',
        genre: 'Hip-Hop',
      },
      {
        videoId: 'uelHwf8o7_U',
        title: "Drake — God's Plan (Official Music Video)",
        thumbnailUrl: 'https://img.youtube.com/vi/uelHwf8o7_U/maxresdefault.jpg',
        channelName: 'Drake',
        embedUrl: 'https://www.youtube.com/embed/uelHwf8o7_U?autoplay=1&rel=0',
        youtubeUrl: 'https://www.youtube.com/watch?v=uelHwf8o7_U',
        publishedAt: '2024-01-01T00:00:00Z',
        genre: 'Hip-Hop',
      },
      {
        videoId: 'KUmZp8pR1uc',
        title: 'Travis Scott ft. Drake — SICKO MODE (Official Music Video)',
        thumbnailUrl: 'https://img.youtube.com/vi/KUmZp8pR1uc/maxresdefault.jpg',
        channelName: 'Travis Scott',
        embedUrl: 'https://www.youtube.com/embed/KUmZp8pR1uc?autoplay=1&rel=0',
        youtubeUrl: 'https://www.youtube.com/watch?v=KUmZp8pR1uc',
        publishedAt: '2024-01-01T00:00:00Z',
        genre: 'Trap',
      },
      {
        videoId: '4L48n0iZom0',
        title: 'J. Cole — Middle Child (Official Music Video)',
        thumbnailUrl: 'https://img.youtube.com/vi/4L48n0iZom0/maxresdefault.jpg',
        channelName: 'J. Cole',
        embedUrl: 'https://www.youtube.com/embed/4L48n0iZom0?autoplay=1&rel=0',
        youtubeUrl: 'https://www.youtube.com/watch?v=4L48n0iZom0',
        publishedAt: '2024-01-01T00:00:00Z',
        genre: 'Hip-Hop',
      },
    ];
  }
}

export const youtubeService = new YoutubeService();

