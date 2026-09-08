import { OFFICIAL_100_VIDEOS, OfficialHipHopTrack } from '@/data/official100Videos';
import { createClient } from '@supabase/supabase-js';

export interface UnifiedVideo {
  id: string;
  videoId: string;
  title: string;
  artistName: string;
  channelName: string;
  thumbnailUrl: string;
  embedUrl: string;
  videoUrl: string;
  publishedAt: string;
  genre: string;
  rank?: number;
  requestedSong?: string;
  requestedArtist?: string;
  channelType?: string;
  source: 'youtube' | 'manual';
  status: 'MATCHED' | 'UNRESOLVED';
  isFeatured?: boolean;
  description?: string;
}

export interface GetUnifiedVideosOptions {
  limit?: number;
  query?: string;
  filter?: 'ALL' | 'TOP20' | 'FEATURED';
}

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export class UnifiedVideoService {
  private memoryCache: UnifiedVideo[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_TTL_MS = 5 * 1000; // 5 seconds high-concurrency buffer

  /**
   * Normalize 100-song canonical dataset into UnifiedVideo format
   */
  public getCanonicalCatalogVideos(): UnifiedVideo[] {
    return OFFICIAL_100_VIDEOS.map((track) => {
      const vId = track.videoId !== 'NONE' ? track.videoId : `unresolved-${track.rank}`;
      return {
        id: `canonical-${track.rank}-${vId}`,
        videoId: vId,
        title: `${track.requestedSong} — ${track.requestedArtist}`,
        artistName: track.requestedArtist,
        channelName: track.channel !== 'NONE' ? track.channel : track.requestedArtist,
        thumbnailUrl: track.thumbnailUrl || (track.videoId !== 'NONE' ? `https://img.youtube.com/vi/${track.videoId}/hqdefault.jpg` : '/images/placeholders/video-placeholder.jpg'),
        embedUrl: track.embedUrl || (track.videoId !== 'NONE' ? `https://www.youtube.com/embed/${track.videoId}?autoplay=1&rel=0` : ''),
        videoUrl: track.youtubeUrl || (track.videoId !== 'NONE' ? `https://www.youtube.com/watch?v=${track.videoId}` : ''),
        publishedAt: '2026-01-01T00:00:00Z',
        genre: 'Hip-Hop',
        rank: track.rank,
        requestedSong: track.requestedSong,
        requestedArtist: track.requestedArtist,
        channelType: track.channelType,
        source: 'youtube',
        status: track.status,
        isFeatured: track.rank <= 10,
      };
    });
  }

  /**
   * Fetch manual and curated videos stored in Supabase database
   */
  public async getDatabaseVideos(): Promise<UnifiedVideo[]> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('[UnifiedVideoService] Supabase videos fetch notice:', error?.message);
        return [];
      }

      return data.map((row: any, idx: number) => {
        let vId = row.video_id || extractYouTubeId(row.video_url) || `manual-${row.id || idx}`;
        let embed = row.embed_url;
        if (!embed && vId && vId.length === 11) {
          embed = `https://www.youtube.com/embed/${vId}?autoplay=1&rel=0`;
        } else if (!embed) {
          embed = row.video_url || '';
        }

        let thumb = row.thumbnail_url;
        if (!thumb && vId && vId.length === 11) {
          thumb = `https://img.youtube.com/vi/${vId}/hqdefault.jpg`;
        }

        return {
          id: row.id || `manual-${idx}`,
          videoId: vId,
          title: row.title || 'WorldStar Hip Hop Premiere',
          artistName: row.artist_name || 'WorldStar Artist',
          channelName: row.channel_name || row.artist_name || 'WorldStar Official',
          thumbnailUrl: thumb || '/images/placeholders/video-placeholder.jpg',
          embedUrl: embed,
          videoUrl: row.video_url || '',
          publishedAt: row.published_at || row.created_at || new Date().toISOString(),
          genre: row.genre || 'Hip-Hop',
          source: 'manual',
          status: 'MATCHED' as const,
          isFeatured: Boolean(row.is_featured),
          description: row.description,
        };
      });
    } catch (err: any) {
      console.warn('[UnifiedVideoService] Exception fetching database videos:', err.message);
      return [];
    }
  }

  public invalidateCache(): void {
    this.memoryCache = null;
    this.cacheTimestamp = 0;
  }

  /**
   * Load and merge both sources with intelligent deduplication
   */
  public async getAllUnifiedVideos(forceRefresh: boolean = false): Promise<UnifiedVideo[]> {
    const now = Date.now();
    if (!forceRefresh && this.memoryCache && (now - this.cacheTimestamp) < this.CACHE_TTL_MS) {
      return this.memoryCache;
    }

    const [canonicalList, dbList] = await Promise.all([
      Promise.resolve(this.getCanonicalCatalogVideos()),
      this.getDatabaseVideos(),
    ]);

    // Deduplication Map: key = videoId (lowercase)
    const mergedMap = new Map<string, UnifiedVideo>();

    // 1. First register all canonical tracks (preserving 1-100 ranks)
    for (const track of canonicalList) {
      const key = track.videoId.toLowerCase();
      mergedMap.set(key, track);
    }

    // 2. Merge manual/database videos
    for (const dbVideo of dbList) {
      const key = dbVideo.videoId.toLowerCase();
      if (mergedMap.has(key)) {
        // Video exists in both canonical catalog & manual database:
        // Merge using strongest metadata without losing the catalog rank
        const existing = mergedMap.get(key)!;
        mergedMap.set(key, {
          ...existing,
          title: dbVideo.title && dbVideo.title.length > existing.title.length ? dbVideo.title : existing.title,
          thumbnailUrl: dbVideo.thumbnailUrl || existing.thumbnailUrl,
          channelName: dbVideo.channelName || existing.channelName,
          embedUrl: dbVideo.embedUrl || existing.embedUrl,
          videoUrl: dbVideo.videoUrl || existing.videoUrl,
          genre: dbVideo.genre || existing.genre,
          isFeatured: existing.isFeatured || dbVideo.isFeatured,
        });
      } else {
        // Distinct manual video: add to unified map
        mergedMap.set(key, dbVideo);
      }
    }

    // Separate canonical tracks and distinct manual/curated videos
    const canonicalTracks = Array.from(mergedMap.values())
      .filter((v) => v.rank !== undefined)
      .sort((a, b) => (a.rank || 0) - (b.rank || 0));

    const distinctManual = Array.from(mergedMap.values())
      .filter((v) => v.rank === undefined);

    // Sort manual: featured first, then newest published
    distinctManual.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    // Interleave seamlessly into a natural, unified hip-hop feed:
    // Insert 1 curated manual drop every 3 catalog tracks so both sources are represented together from page 1!
    const allUnified: UnifiedVideo[] = [];
    let manualIdx = 0;
    for (let i = 0; i < canonicalTracks.length; i++) {
      allUnified.push(canonicalTracks[i]);
      if ((i + 1) % 3 === 0 && manualIdx < distinctManual.length) {
        allUnified.push(distinctManual[manualIdx++]);
      }
    }
    // Append any remaining manual tracks
    while (manualIdx < distinctManual.length) {
      allUnified.push(distinctManual[manualIdx++]);
    }

    this.memoryCache = allUnified;
    this.cacheTimestamp = now;
    return allUnified;
  }

  /**
   * Filter unified videos by search query and category
   */
  public async getFilteredUnifiedVideos(options: GetUnifiedVideosOptions = {}, forceRefresh: boolean = false): Promise<{
    videos: UnifiedVideo[];
    total: number;
    catalogCount: number;
    manualCount: number;
  }> {
    const all = await this.getAllUnifiedVideos(forceRefresh);
    let result = [...all];

    // Search filter across BOTH sources
    if (options.query && options.query.trim()) {
      const q = options.query.toLowerCase().trim();
      result = result.filter((v) =>
        v.title.toLowerCase().includes(q) ||
        v.artistName.toLowerCase().includes(q) ||
        v.channelName.toLowerCase().includes(q) ||
        (v.requestedSong && v.requestedSong.toLowerCase().includes(q)) ||
        (v.requestedArtist && v.requestedArtist.toLowerCase().includes(q)) ||
        (v.genre && v.genre.toLowerCase().includes(q)) ||
        (v.rank && (`#${v.rank}` === q || `${v.rank}` === q))
      );
    }

    // Category filter
    if (options.filter === 'TOP20') {
      result = result.filter((v) => (v.rank && v.rank <= 20) || v.isFeatured);
    } else if (options.filter === 'FEATURED') {
      result = result.filter((v) => v.isFeatured || (v.rank && v.rank <= 40 && v.rank % 2 === 1));
    }

    const limit = options.limit ? Math.min(options.limit, result.length) : result.length;
    const sliced = result.slice(0, limit);

    const catalogCount = all.filter((v) => v.source === 'youtube').length;
    const manualCount = all.filter((v) => v.source === 'manual').length;

    return {
      videos: sliced,
      total: result.length,
      catalogCount,
      manualCount,
    };
  }
}

export const unifiedVideoService = new UnifiedVideoService();
