import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import rateLimit from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60000, // 60 seconds
  uniqueTokenPerInterval: 500, 
});
import { z } from 'zod';
import { ApiResponse } from '@/types';

const ComprehensiveSubmissionSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  stageName: z.string().min(2, "Stage name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  age: z.number().min(16, "Must be at least 16 years old").max(100),
  genre: z.enum(['Hip-Hop', 'R&B', 'Electronic', 'Alternative', 'Afrobeats', 'Pop', 'Cinematic']),
  experience: z.enum(['EMERGING', 'MID_CAREER', 'ESTABLISHED']),
  biography: z.string().min(10, "Please provide a brief biography (min 10 characters)"),
  spotifyUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  appleUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  youtubeUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  instagramUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  tiktokUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  soundcloudUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  audioUrl: z.string().url("Valid demo audio link or stream URL is required"),
  coverImageUrl: z.string().url("Invalid image URL").optional().or(z.literal('')),
  pressKitPdfUrl: z.string().url("Invalid PDF URL").optional().or(z.literal('')),
  additionalFilesUrl: z.string().url("Invalid link").optional().or(z.literal('')),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    try {
      await limiter.check(3, ip); // 3 requests per minute per IP
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

    const body = await request.json();
    const validatedData = ComprehensiveSubmissionSchema.parse(body);

    const supabase = createClient();
    const { error: dbError } = await supabase
      .from('demo_submissions')
      .insert([
        {
          artist_name: validatedData.stageName,
          email: validatedData.email,
          track_title: "Submission",
          genre: validatedData.genre,
          audio_url: validatedData.audioUrl,
          bio_notes: validatedData.biography,
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
