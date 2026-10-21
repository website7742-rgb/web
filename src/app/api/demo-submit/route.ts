import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import rateLimit from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60000, // 60 seconds
  uniqueTokenPerInterval: 500, 
});
import { z } from 'zod';
import { ApiResponse } from '@/types';

const FlexibleSubmissionSchema = z.object({
  fullName: z.string().optional(),
  stageName: z.string().optional(),
  artistName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  age: z.number().optional(),
  genre: z.enum(['Hip-Hop', 'R&B', 'Electronic', 'Alternative', 'Afrobeats', 'Pop', 'Cinematic']).default('Hip-Hop'),
  experience: z.enum(['EMERGING', 'MID_CAREER', 'ESTABLISHED']).optional(),
  trackTitle: z.string().optional(),
  biography: z.string().optional(),
  bioNotes: z.string().optional(),
  message: z.string().optional(),
  spotifyUrl: z.string().optional().or(z.literal('')),
  appleUrl: z.string().optional().or(z.literal('')),
  youtubeUrl: z.string().optional().or(z.literal('')),
  instagramUrl: z.string().optional().or(z.literal('')),
  tiktokUrl: z.string().optional().or(z.literal('')),
  soundcloudUrl: z.string().optional().or(z.literal('')),
  websiteUrl: z.string().optional().or(z.literal('')),
  audioUrl: z.string().optional().or(z.literal('')),
  videoUrl: z.string().optional().or(z.literal('')).transform(val => {
    if (!val) return '';
    if (val.startsWith('http://') || val.startsWith('https://')) return val;
    const r2Url = (process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-5949778404be4a59a2f903c5cae6278a.r2.dev').replace(/\/$/, '');
    return `${r2Url}/user_submissions/${val}`;
  }),
  coverImageUrl: z.string().optional().or(z.literal('')),
  pressKitPdfUrl: z.string().optional().or(z.literal('')),
  additionalFilesUrl: z.string().optional().or(z.literal('')),
}).refine(data => {
  return !!(data.stageName || data.artistName || data.fullName);
}, {
  message: "Artist name or stage name is required",
  path: ["stageName"],
}).refine(data => {
  return !!(data.audioUrl || data.videoUrl);
}, {
  message: "Valid demo audio link or stream URL is required",
  path: ["audioUrl"],
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    try {
      await limiter.check(5, ip); // 5 requests per minute per IP
    } catch {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many submissions from this IP. Please wait 1 minute before trying again.',
        },
      };
      return NextResponse.json(response, { status: 429 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: {
          code: 'INVALID_JSON',
          message: 'Invalid payload or missing JSON body',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const validatedData = FlexibleSubmissionSchema.parse(body);

    const artistName = validatedData.stageName || validatedData.artistName || validatedData.fullName || 'Recording Artist';
    const trackTitle = validatedData.trackTitle || 'Demo Submission';
    const bioNotes = validatedData.biography || validatedData.bioNotes || validatedData.message || '';
    const audioUrl = validatedData.audioUrl || validatedData.videoUrl || '';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error: dbError } = await supabase
      .from('demo_submissions')
      .insert([
        {
          artist_name: artistName,
          email: validatedData.email,
          track_title: trackTitle,
          genre: validatedData.genre,
          audio_url: audioUrl,
          bio_notes: bioNotes,
          ip_address: ip,
        }
      ]);

    if (dbError) throw dbError;

    const response: ApiResponse<typeof validatedData> = {
      success: true,
      data: validatedData,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.errors[0]?.message || 'Invalid form payload',
          details: error.errors,
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to process submission.',
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
