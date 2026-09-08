import { NextRequest, NextResponse } from 'next/server';
import { unifiedVideoService } from '@/services/UnifiedVideoService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 🎥 Unified Video Hub API Route
 * Combines both sources into a single deduplicated feed:
 * 1. Official 100 Hip-Hop songs catalog
 * 2. Database-backed manually added & curated videos
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 200) : 150;
    const filterParam = searchParams.get('filter') as 'ALL' | 'TOP20' | 'FEATURED' | null;
    const forceRefresh = searchParams.get('refresh') === 'true';

    if (forceRefresh) {
      unifiedVideoService.invalidateCache();
    }

    const { videos, total, catalogCount, manualCount } = await unifiedVideoService.getFilteredUnifiedVideos(
      {
        query,
        limit,
        filter: filterParam || 'ALL',
      },
      forceRefresh
    );

    return NextResponse.json(
      {
        success: true,
        videos,
        total,
        catalogCount,
        manualCount,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': forceRefresh
            ? 'no-store, no-cache, must-revalidate, proxy-revalidate'
            : 'public, s-maxage=10, stale-while-revalidate=30',
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
