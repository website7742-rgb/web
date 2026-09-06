import { NextRequest, NextResponse } from 'next/server';
import { youtubeService } from '@/services/YoutubeService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 🎥 Production-Ready YouTube Videos API Route
 * Endpoint: GET /api/videos
 * Query Parameters:
 *   - q: string (search query)
 *   - limit: number (default 100, max 100)
 *   - order: 'date' | 'relevance' | 'viewCount' (default 'date')
 *   - refresh: boolean (bypass server cache)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'Hip Hop music video OR Rap music video';
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 100) : 100;
    const order = (searchParams.get('order') as 'date' | 'relevance' | 'viewCount') || 'date';
    const forceRefresh = searchParams.get('refresh') === 'true';

    const result = await youtubeService.fetchLatestHipHopVideos({
      query,
      limit,
      order,
      forceRefresh,
    });

    return NextResponse.json(
      {
        ...result,
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
