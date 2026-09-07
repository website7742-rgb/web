import { NextRequest, NextResponse } from 'next/server';
import { OFFICIAL_100_VIDEOS } from '@/data/official100Videos';
import { youtubeService, AggregatedVideo } from '@/services/YoutubeService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 🎥 Official 100 Hip-Hop Songs & Videos API Route
 * Endpoint: GET /api/videos
 * Primary Source: Verified Official 100 Hip-Hop Tracks
 * Fallback / Search: YouTube Data API v3 (Server-side key protected)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 100) : 100;
    const forceRefresh = searchParams.get('refresh') === 'true';
    const statusFilter = searchParams.get('status'); // 'MATCHED' | 'UNRESOLVED'

    // If a custom external search query is explicitly provided AND user has YouTube API key configured
    const isCustomQuery = query &&
      query !== 'Hip Hop music video OR Rap music video' &&
      query !== 'ALL' &&
      !query.toLowerCase().includes('official');

    if (isCustomQuery && process.env.YOUTUBE_API_KEY) {
      const liveResult = await youtubeService.fetchLatestHipHopVideos({
        query,
        limit,
        forceRefresh,
      });
      if (liveResult.success && liveResult.videos.length > 0) {
        return NextResponse.json(
          {
            ...liveResult,
            timestamp: new Date().toISOString(),
          },
          {
            status: 200,
            headers: {
              'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
            },
          }
        );
      }
    }

    // Canonical Official 100 Hip-Hop Songs Dataset (Primary Source)
    const officialVideos: AggregatedVideo[] = OFFICIAL_100_VIDEOS.map((track) => ({
      videoId: track.videoId !== 'NONE' ? track.videoId : `unresolved-${track.rank}`,
      title: `${track.requestedSong} — ${track.requestedArtist}`,
      thumbnailUrl: track.thumbnailUrl || (track.videoId !== 'NONE' ? `https://img.youtube.com/vi/${track.videoId}/hqdefault.jpg` : '/images/placeholders/video-placeholder.jpg'),
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

    let filtered = officialVideos;

    // Filter by status if requested
    if (statusFilter === 'MATCHED' || statusFilter === 'UNRESOLVED') {
      filtered = filtered.filter(v => v.status === statusFilter);
    }

    // Filter by search query within canonical catalog
    if (query && query !== 'Hip Hop music video OR Rap music video' && query !== 'ALL') {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.channelName.toLowerCase().includes(q) ||
          (v.artistName && v.artistName.toLowerCase().includes(q)) ||
          (v.requestedSong && v.requestedSong.toLowerCase().includes(q)) ||
          `#${v.rank}` === q ||
          `${v.rank}` === q
      );
    }

    const sliced = filtered.slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        videos: sliced,
        total: sliced.length,
        catalogTotal: OFFICIAL_100_VIDEOS.length,
        matchedCount: OFFICIAL_100_VIDEOS.filter(v => v.status === 'MATCHED').length,
        unresolvedCount: OFFICIAL_100_VIDEOS.filter(v => v.status === 'UNRESOLVED').length,
        cached: true,
        source: 'official_100_catalog',
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error: any) {
    console.error('[API:videos] Handler exception:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Internal server error while fetching videos',
        videos: [],
        total: 0,
        cached: false,
        source: 'fallback',
      },
      { status: 500 }
    );
  }
}
