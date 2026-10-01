import { OFFICIAL_100_VIDEOS } from '@/data/official100Videos';
import { VERIFIED_ARTIST_VIDEOS, VerifiedArtistVideo } from '@/data/verifiedArtistVideos';

export interface ArtistVideoQuery {
  artistName: string;
  artistSlug?: string;
  artistId?: string;
  youtubeChannelUrl?: string;
  existingVideos?: Array<{ youtubeId: string; title?: string }>;
}

export interface ArtistVideoResult {
  status: 'MATCHED' | 'UNAVAILABLE';
  videoId: string | null;
  embedUrl: string | null;
  title: string | null;
  channelName: string | null;
  thumbnailUrl: string | null;
  source: 'youtube_api_channel' | 'youtube_api_search' | 'verified_catalog' | 'official_100' | 'existing_video' | 'fallback_none';
  cached?: boolean;
}

interface CacheEntry {
  timestamp: number;
  result: ArtistVideoResult;
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

function normalizeArtistName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Live validation via YouTube oEmbed.
 * Returns valid: true and metadata if video is publicly available and embeddable.
 * Returns null if video is private, deleted, restricted, or embedding disabled.
 * Zero YouTube Data API quota cost.
 */
export async function validateVideoWithOembed(videoId: string): Promise<{ valid: boolean; title?: string; authorName?: string } | null> {
  if (!videoId || videoId.length < 5 || videoId.startsWith('unresolved') || videoId === 'NONE') {
    return null;
  }

  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`, {
      next: { revalidate: 86400 }, // 24-hour cache
    });

    if (res.ok) {
      const data = await res.json();
      return {
        valid: true,
        title: decodeHtmlEntities(data.title || ''),
        authorName: decodeHtmlEntities(data.author_name || ''),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export class ArtistVideoService {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24-hour server cache

  private getApiKey(): string {
    return process.env.YOUTUBE_API_KEY || '';
  }

  /**
   * Resolve the latest official, embeddable YouTube video for an artist.
   */
  async resolveArtistVideo(query: ArtistVideoQuery): Promise<ArtistVideoResult> {
    const { artistName, artistSlug, youtubeChannelUrl, existingVideos } = query;
    if (!artistName) {
      return this.buildUnavailableResult('fallback_none');
    }

    const safeSlug = (artistSlug || artistName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).toLowerCase().trim();
    const cacheKey = safeSlug || artistName.toLowerCase().trim();

    // 1. In-memory server cache check
    if (this.cache.has(cacheKey)) {
      const entry = this.cache.get(cacheKey)!;
      if (Date.now() - entry.timestamp < this.CACHE_TTL_MS) {
        return { ...entry.result, cached: true };
      }
    }

    const apiKey = this.getApiKey();

    // 2. LIVE YOUTUBE DATA API v3 (If API Key is available)
    if (apiKey) {
      try {
        // PRIORITY 1: Query channel directly if channel ID or handle exists
        const channelResult = await this.searchArtistChannel(artistName, youtubeChannelUrl, apiKey);
        if (channelResult) {
          this.cacheResult(cacheKey, channelResult);
          return channelResult;
        }

        // PRIORITY 2: Search YouTube using exact artist name + relevant terms
        const searchResult = await this.searchArtistByKeyword(artistName, apiKey);
        if (searchResult) {
          this.cacheResult(cacheKey, searchResult);
          return searchResult;
        }
      } catch (err: any) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[ArtistVideoService] YouTube API error for ${artistName}:`, err.message);
        }
      }
    }

    // 3. FALLBACK LAYER: Verified Curated Catalog & Canonical Sources
    // (Used when API key is unconfigured, hits quota, or returns no valid videos)
    const fallbackResult = await this.resolveCuratedFallback(artistName, safeSlug, existingVideos);
    if (fallbackResult) {
      this.cacheResult(cacheKey, fallbackResult);
      return fallbackResult;
    }

    // 4. UNAVAILABLE: Return clean unavailable state (Zero broken iframes, zero fabricated content)
    const unavailable = this.buildUnavailableResult('fallback_none');
    this.cacheResult(cacheKey, unavailable);
    return unavailable;
  }

  /**
   * Priority 1: Search the artist's verified channel directly.
   */
  private async searchArtistChannel(
    artistName: string,
    channelUrl: string | undefined,
    apiKey: string
  ): Promise<ArtistVideoResult | null> {
    if (!channelUrl) return null;

    let channelId: string | null = null;

    // A) Extract channel ID directly from URL (e.g. /channel/UC...)
    const channelIdMatch = channelUrl.match(/\/channel\/(UC[a-zA-Z0-9_-]{20,24})/i);
    if (channelIdMatch) {
      channelId = channelIdMatch[1];
    }

    // B) Extract handle from URL (e.g. /@JColeOfficial or user/...)
    if (!channelId) {
      const handleMatch = channelUrl.match(/@([a-zA-Z0-9_.-]+)/i);
      if (handleMatch) {
        const handle = handleMatch[1];
        try {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=id,contentDetails&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`,
            { next: { revalidate: 86400 } }
          );
          if (res.ok) {
            const data = await res.json();
            if (data.items && data.items.length > 0) {
              channelId = data.items[0].id;
            }
          }
        } catch {
          // Fall through
        }
      }
    }

    if (!channelId) return null;

    // Query channel's latest videos ordered by date
    try {
      const searchEndpoint = new URL('https://www.googleapis.com/youtube/v3/search');
      searchEndpoint.searchParams.set('part', 'snippet');
      searchEndpoint.searchParams.set('channelId', channelId);
      searchEndpoint.searchParams.set('type', 'video');
      searchEndpoint.searchParams.set('videoEmbeddable', 'true');
      searchEndpoint.searchParams.set('order', 'date');
      searchEndpoint.searchParams.set('maxResults', '5');
      searchEndpoint.searchParams.set('key', apiKey);

      const res = await fetch(searchEndpoint.toString(), {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      });

      if (!res.ok) return null;
      const data = await res.json();
      const items = data.items || [];

      // Test candidates from newest to oldest
      for (const item of items) {
        const videoId = item.id?.videoId;
        if (!videoId) continue;

        const oembed = await validateVideoWithOembed(videoId);
        if (oembed && oembed.valid) {
          const rawTitle = decodeHtmlEntities(item.snippet?.title || oembed.title || `${artistName} Official Video`);
          const channelName = decodeHtmlEntities(item.snippet?.channelTitle || oembed.authorName || artistName);
          const thumbs = item.snippet?.thumbnails || {};
          const thumbnailUrl = thumbs.maxres?.url || thumbs.high?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

          return {
            status: 'MATCHED',
            videoId,
            embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
            title: rawTitle,
            channelName,
            thumbnailUrl,
            source: 'youtube_api_channel',
          };
        }
      }
    } catch {
      // Fall through
    }

    return null;
  }

  /**
   * Priority 2: Search YouTube using exact artist name + relevant terms.
   */
  private async searchArtistByKeyword(
    artistName: string,
    apiKey: string
  ): Promise<ArtistVideoResult | null> {
    const queryVariants = [
      `"${artistName}" official video`,
      `"${artistName}" official music video`,
      `"${artistName}" music`,
      `"${artistName}"`,
    ];

    const normArtist = normalizeArtistName(artistName);

    for (const query of queryVariants) {
      try {
        const endpoint = new URL('https://www.googleapis.com/youtube/v3/search');
        endpoint.searchParams.set('part', 'snippet');
        endpoint.searchParams.set('q', query);
        endpoint.searchParams.set('type', 'video');
        endpoint.searchParams.set('videoEmbeddable', 'true');
        endpoint.searchParams.set('order', 'date');
        endpoint.searchParams.set('maxResults', '6');
        endpoint.searchParams.set('key', apiKey);

        const res = await fetch(endpoint.toString(), {
          headers: { Accept: 'application/json' },
          next: { revalidate: 3600 },
        });

        if (!res.ok) continue;
        const data = await res.json();
        const items = data.items || [];

        for (const item of items) {
          const videoId = item.id?.videoId;
          if (!videoId) continue;

          const rawTitle = decodeHtmlEntities(item.snippet?.title || '');
          const channelTitle = decodeHtmlEntities(item.snippet?.channelTitle || '');
          const normTitle = normalizeArtistName(rawTitle);
          const normChannel = normalizeArtistName(channelTitle);

          // Verification rule: video or channel MUST legitimately feature the artist
          const matchesArtist = normTitle.includes(normArtist) || normChannel.includes(normArtist);
          if (!matchesArtist) continue;

          // Reject fan reactions, parody, type beat, karaoke, tutorials
          const lowerTitle = rawTitle.toLowerCase();
          if (
            lowerTitle.includes('reaction') ||
            lowerTitle.includes('parody') ||
            lowerTitle.includes('type beat') ||
            lowerTitle.includes('karaoke') ||
            lowerTitle.includes('guitar cover') ||
            lowerTitle.includes('drum cover')
          ) {
            continue;
          }

          // Validate embeddability and availability via live oEmbed
          const oembed = await validateVideoWithOembed(videoId);
          if (oembed && oembed.valid) {
            const thumbs = item.snippet?.thumbnails || {};
            const thumbnailUrl = thumbs.maxres?.url || thumbs.high?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

            return {
              status: 'MATCHED',
              videoId,
              embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
              title: rawTitle || oembed.title || `${artistName} Official Visual`,
              channelName: channelTitle || oembed.authorName || artistName,
              thumbnailUrl,
              source: 'youtube_api_search',
            };
          }
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  /**
   * Curated Fallback Layer: Verified local registry & OFFICIAL_100_VIDEOS dataset.
   */
  private async resolveCuratedFallback(
    artistName: string,
    safeSlug: string,
    existingVideos?: Array<{ youtubeId: string; title?: string }>
  ): Promise<ArtistVideoResult | null> {
    // A) Check existing verified videos on artist object
    if (existingVideos && existingVideos.length > 0) {
      for (const ev of existingVideos) {
        if (ev.youtubeId) {
          const oembed = await validateVideoWithOembed(ev.youtubeId);
          if (oembed && oembed.valid) {
            return {
              status: 'MATCHED',
              videoId: ev.youtubeId,
              embedUrl: `https://www.youtube.com/embed/${ev.youtubeId}?rel=0`,
              title: ev.title || oembed.title || `${artistName} Official Visual`,
              channelName: oembed.authorName || artistName,
              thumbnailUrl: `https://i.ytimg.com/vi/${ev.youtubeId}/hqdefault.jpg`,
              source: 'existing_video',
            };
          }
        }
      }
    }

    // B) Check VERIFIED_ARTIST_VIDEOS curated registry
    const verified = VERIFIED_ARTIST_VIDEOS[safeSlug];
    if (verified && verified.videoId) {
      const oembed = await validateVideoWithOembed(verified.videoId);
      if (oembed && oembed.valid) {
        return {
          status: 'MATCHED',
          videoId: verified.videoId,
          embedUrl: `https://www.youtube.com/embed/${verified.videoId}?rel=0`,
          title: verified.title || oembed.title || `${artistName} Official Visual`,
          channelName: verified.channelName || oembed.authorName || artistName,
          thumbnailUrl: `https://i.ytimg.com/vi/${verified.videoId}/hqdefault.jpg`,
          source: 'verified_catalog',
        };
      }
    }

    // C) Check OFFICIAL_100_VIDEOS dataset
    const normArtist = normalizeArtistName(artistName);
    const matchedTrack = OFFICIAL_100_VIDEOS.find((track) => {
      if (track.status !== 'MATCHED' || !track.videoId || track.videoId === 'NONE') return false;
      const trackArtistNorm = normalizeArtistName(track.requestedArtist);
      return trackArtistNorm === normArtist || trackArtistNorm.startsWith(normArtist) || normArtist.startsWith(trackArtistNorm);
    });

    if (matchedTrack && matchedTrack.videoId) {
      const oembed = await validateVideoWithOembed(matchedTrack.videoId);
      if (oembed && oembed.valid) {
        return {
          status: 'MATCHED',
          videoId: matchedTrack.videoId,
          embedUrl: `https://www.youtube.com/embed/${matchedTrack.videoId}?rel=0`,
          title: matchedTrack.actualTitle || `${matchedTrack.requestedSong} — ${matchedTrack.requestedArtist}`,
          channelName: matchedTrack.channel || artistName,
          thumbnailUrl: matchedTrack.thumbnailUrl || `https://i.ytimg.com/vi/${matchedTrack.videoId}/hqdefault.jpg`,
          source: 'official_100',
        };
      }
    }

    return null;
  }

  private buildUnavailableResult(source: ArtistVideoResult['source']): ArtistVideoResult {
    return {
      status: 'UNAVAILABLE',
      videoId: null,
      embedUrl: null,
      title: null,
      channelName: null,
      thumbnailUrl: null,
      source,
    };
  }

  private cacheResult(key: string, result: ArtistVideoResult) {
    this.cache.set(key, {
      timestamp: Date.now(),
      result,
    });
  }
}

export const artistVideoService = new ArtistVideoService();
