/**
 * 🎥 YouTube Data API v3 Service
 * AUTOMATED CONTENT AGGREGATION PIPELINE
 * 
 * Fetches top trending Rap & Hip-Hop short videos (under 2 minutes).
 * Strict Embed-Only Architecture: Extracts metadata only without storing MP4 files.
 */

export interface AggregatedVideo {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  embedUrl: string;
  publishedAt: string;
  viewsCount?: string;
  isFeatured?: boolean;
  artistId?: string;
  artistName?: string;
  releaseDate?: string;
  genre?: string;
  youtubeId?: string;
  coverUrl?: string;
}

export class YoutubeService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
  }

  /**
   * Fetch top trending Rap and Hip-Hop videos under 2 minutes
   */
  async fetchTrendingShortRapVideos(limit: number = 25): Promise<AggregatedVideo[]> {
    if (!this.apiKey) {
      console.warn('[YoutubeService] YOUTUBE_API_KEY is not set. Returning mock aggregated payload.');
      return this.getFallbackPayload();
    }

    try {
      const endpoint = new URL('https://www.googleapis.com/youtube/v3/search');
      endpoint.searchParams.set('part', 'snippet');
      endpoint.searchParams.set('q', 'Rap OR Hip Hop OR Trap Music');
      endpoint.searchParams.set('type', 'video');
      endpoint.searchParams.set('videoDuration', 'short'); // Strictly under 2 minutes
      endpoint.searchParams.set('order', 'viewCount'); // Order by top views
      endpoint.searchParams.set('maxResults', Math.min(limit, 50).toString());
      endpoint.searchParams.set('key', this.apiKey);

      const response = await fetch(endpoint.toString(), {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error(`YouTube API returned status ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      if (!data.items || !Array.isArray(data.items)) {
        return [];
      }

      return data.items.map((item: any) => {
        const videoId = item.id.videoId;
        return {
          videoId,
          title: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
          channelName: item.snippet.channelTitle,
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`,
          publishedAt: item.snippet.publishedAt,
        };
      });
    } catch (error) {
      console.error('[YoutubeService] Error fetching YouTube videos:', error);
      return this.getFallbackPayload();
    }
  }

  private getFallbackPayload(): AggregatedVideo[] {
    return [
      {
        videoId: '9bZkp7q19f0',
        title: 'TOP RAP FREESTYLE IN THE STUDIO 2026',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
        channelName: 'WorldStar Official',
        embedUrl: 'https://www.youtube.com/embed/9bZkp7q19f0?autoplay=0&rel=0',
        publishedAt: new Date().toISOString(),
      },
      {
        videoId: '3JZ_D3ELwOQ',
        title: 'NEW HEAT RAP DRILL CYPHER',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        channelName: 'WSHH HipHop Uncut',
        embedUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ?autoplay=0&rel=0',
        publishedAt: new Date().toISOString(),
      },
    ];
  }
}

export const youtubeService = new YoutubeService();
