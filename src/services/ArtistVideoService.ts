import { OFFICIAL_100_VIDEOS } from '@/data/official100Videos';
import { VERIFIED_ARTIST_VIDEOS, VerifiedArtistVideo } from '@/data/verifiedArtistVideos';
import { MOCK_ARTISTS } from '@/lib/data/mockData';
import { artistVideoOverrideRepository } from '@/lib/repositories/ArtistVideoOverrideRepository';

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
  publishedAt?: string | null;
  source: 'manual_studio' | 'youtube_api_channel' | 'youtube_api_search' | 'verified_catalog' | 'official_100' | 'existing_video' | 'fallback_none';
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

    // Auto-resolve official YouTube channel URL from verified roster data if not supplied
    let resolvedChannelUrl = youtubeChannelUrl;
    if (!resolvedChannelUrl) {
      const matched = MOCK_ARTISTS.find(
        (a) => a.slug === safeSlug || normalizeArtistName(a.name) === normalizeArtistName(artistName)
      );
      if (matched?.socials?.youtube) {
        resolvedChannelUrl = matched.socials.youtube;
      }
    }

    // 1. STUDIO MANUAL OVERRIDE (PRIORITY 1)
    // Manually verified & assigned videos by Studio Administrators take highest precedence
    try {
      const studioOverride = await artistVideoOverrideRepository.getOverride(safeSlug);
      if (studioOverride && studioOverride.is_active && studioOverride.youtube_video_id) {
        const oembed = await validateVideoWithOembed(studioOverride.youtube_video_id);
        if (oembed && oembed.valid) {
          const manualResult: ArtistVideoResult = {
            status: 'MATCHED',
            videoId: studioOverride.youtube_video_id,
            embedUrl: `https://www.youtube.com/embed/${studioOverride.youtube_video_id}?rel=0`,
            title: studioOverride.title || oembed.title || `${artistName} Official Visual`,
            channelName: studioOverride.channel_name || oembed.authorName || artistName,
            thumbnailUrl: studioOverride.thumbnail_url || `https://i.ytimg.com/vi/${studioOverride.youtube_video_id}/hqdefault.jpg`,
            publishedAt: studioOverride.published_at || null,
            source: 'manual_studio',
          };
          this.cacheResult(cacheKey, manualResult);
          return manualResult;
        }
      }
    } catch (overrideErr) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[ArtistVideoService] Studio override lookup failed for ${artistName}:`, overrideErr);
      }
    }

    // 2. In-memory server cache check (for automatic YouTube API & Fallback results)
    if (this.cache.has(cacheKey)) {
      const entry = this.cache.get(cacheKey)!;
      if (Date.now() - entry.timestamp < this.CACHE_TTL_MS) {
        return { ...entry.result, cached: true };
      }
    }

    const apiKey = this.getApiKey();

    // 3. LIVE YOUTUBE DATA API v3 (If API Key is available)
    if (apiKey) {
      try {
        // PRIORITY 1: Query channel directly if channel ID or handle exists
        const channelResult = await this.searchArtistChannel(artistName, resolvedChannelUrl, apiKey);
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
      searchEndpoint.searchParams.set('maxResults', '10');
      searchEndpoint.searchParams.set('key', apiKey);

      const res = await fetch(searchEndpoint.toString(), {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      });

      if (!res.ok) return null;
      const data = await res.json();
      const items = data.items || [];
      const videoIds = items.map((it: any) => it.id?.videoId).filter(Boolean);

      // Call videos.list to check status.embeddable and publishedAt
      const videoDetails = await this.validateVideosList(videoIds, apiKey);

      // Sort candidate items by publishedAt descending to guarantee newest video first
      const sortedItems = [...items].sort((a: any, b: any) => {
        const dateA = new Date(videoDetails.get(a.id?.videoId)?.publishedAt || a.snippet?.publishedAt || 0).getTime();
        const dateB = new Date(videoDetails.get(b.id?.videoId)?.publishedAt || b.snippet?.publishedAt || 0).getTime();
        return dateB - dateA;
      });

      // Test candidates from newest to oldest
      for (const item of sortedItems) {
        const videoId = item.id?.videoId;
        if (!videoId) continue;

        const details = videoDetails.get(videoId);
        if (details && !details.embeddable) continue;

        const oembed = await validateVideoWithOembed(videoId);
        if (oembed && oembed.valid) {
          const rawTitle = decodeHtmlEntities(details?.title || item.snippet?.title || oembed.title || `${artistName} Official Video`);
          const channelName = decodeHtmlEntities(details?.channelTitle || item.snippet?.channelTitle || oembed.authorName || artistName);
          const thumbs = item.snippet?.thumbnails || {};
          const thumbnailUrl = thumbs.maxres?.url || thumbs.high?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
          const publishedAt = details?.publishedAt || item.snippet?.publishedAt || null;

          return {
            status: 'MATCHED',
            videoId,
            embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
            title: rawTitle,
            channelName,
            thumbnailUrl,
            publishedAt,
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
        endpoint.searchParams.set('maxResults', '10');
        endpoint.searchParams.set('key', apiKey);

        const res = await fetch(endpoint.toString(), {
          headers: { Accept: 'application/json' },
          next: { revalidate: 3600 },
        });

        if (!res.ok) continue;
        const data = await res.json();
        const items = data.items || [];
        const videoIds = items.map((it: any) => it.id?.videoId).filter(Boolean);

        // Call videos.list to check status.embeddable and publishedAt
        const videoDetails = await this.validateVideosList(videoIds, apiKey);

        // Sort candidate items by publishedAt descending
        const sortedItems = [...items].sort((a: any, b: any) => {
          const dateA = new Date(videoDetails.get(a.id?.videoId)?.publishedAt || a.snippet?.publishedAt || 0).getTime();
          const dateB = new Date(videoDetails.get(b.id?.videoId)?.publishedAt || b.snippet?.publishedAt || 0).getTime();
          return dateB - dateA;
        });

        for (const item of sortedItems) {
          const videoId = item.id?.videoId;
          if (!videoId) continue;

          const details = videoDetails.get(videoId);
          if (details && !details.embeddable) continue;

          const rawTitle = decodeHtmlEntities(details?.title || item.snippet?.title || '');
          const channelTitle = decodeHtmlEntities(details?.channelTitle || item.snippet?.channelTitle || '');
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
            const publishedAt = details?.publishedAt || item.snippet?.publishedAt || null;

            return {
              status: 'MATCHED',
              videoId,
              embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
              title: rawTitle || oembed.title || `${artistName} Official Visual`,
              channelName: channelTitle || oembed.authorName || artistName,
              thumbnailUrl,
              publishedAt,
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
   * Helper: Call videos.list to fetch embeddable status and publishedAt timestamps.
   */
  private async validateVideosList(
    videoIds: string[],
    apiKey: string
  ): Promise<Map<string, { embeddable: boolean; publishedAt: string; title: string; channelTitle: string }>> {
    const map = new Map<string, { embeddable: boolean; publishedAt: string; title: string; channelTitle: string }>();
    if (!videoIds || videoIds.length === 0) return map;

    try {
      const endpoint = new URL('https://www.googleapis.com/youtube/v3/videos');
      endpoint.searchParams.set('part', 'snippet,status');
      endpoint.searchParams.set('id', videoIds.join(','));
      endpoint.searchParams.set('key', apiKey);

      const res = await fetch(endpoint.toString(), {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        for (const item of (data.items || [])) {
          const embeddable = item.status?.embeddable !== false && item.status?.privacyStatus === 'public';
          map.set(item.id, {
            embeddable,
            publishedAt: item.snippet?.publishedAt || '',
            title: decodeHtmlEntities(item.snippet?.title || ''),
            channelTitle: decodeHtmlEntities(item.snippet?.channelTitle || ''),
          });
        }
      }
    } catch {
      // Fall through
    }

    return map;
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
              publishedAt: null,
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
          publishedAt: verified.publishedAt || null,
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
          publishedAt: null,
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
      publishedAt: null,
      source,
    };
  }

  private cacheResult(key: string, result: ArtistVideoResult) {
    this.cache.set(key, {
      timestamp: Date.now(),
      result,
    });
  }

  /**
   * Invalidate server cache for a specific artist (used upon Studio publish/replace/unpublish)
   */
  public invalidateCache(slugOrName: string) {
    if (!slugOrName) return;
    const safeSlug = slugOrName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').trim();
    this.cache.delete(safeSlug);
    this.cache.delete(slugOrName.toLowerCase().trim());
  }
}

export const artistVideoService = new ArtistVideoService();
