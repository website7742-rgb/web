import { z } from 'zod';

export const StreamingPlatformSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL")
});

export const ArtistSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  slug: z.string().min(1, "Slug is required"),
  tagline: z.string().max(100).optional().or(z.literal('')),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  avatarUrl: z.string().url("Must be a valid URL"),
  heroUrl: z.string().url("Must be a valid URL"),
  genres: z.array(z.string()).min(1, "At least one genre is required"),
  country: z.string().min(1, "Country is required"),
  countryFlag: z.string().optional(),
  isVerified: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  labelStatus: z.string().optional(),
  monthlyListeners: z.number().min(0).default(0),
  totalStreams: z.number().min(0).default(0),
  grammyWins: z.number().min(0).default(0),
  riaaCertifications: z.object({
    platinum: z.number().min(0),
    gold: z.number().min(0),
    diamond: z.number().min(0),
  }).optional(),
  topSongs: z.array(z.string()).optional(),
  streamingPlatforms: z.array(StreamingPlatformSchema).optional(),
  epkUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  biographyLastVerified: z.string().optional(),
  verificationConfidence: z.string().optional(),
  verificationNotes: z.string().optional(),
  socials: z.object({
    website: z.string().optional().or(z.literal('')),
    spotify: z.string().optional().or(z.literal('')),
    apple: z.string().optional().or(z.literal('')),
    youtube: z.string().optional().or(z.literal('')),
    instagram: z.string().optional().or(z.literal('')),
    twitter: z.string().optional().or(z.literal('')),
    facebook: z.string().optional().or(z.literal('')),
    soundCloud: z.string().optional().or(z.literal('')),
    tiktok: z.string().optional().or(z.literal(''))
  }).optional()
});

export const VideoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(150, "Title must be under 150 characters"),
  imageUrl: z.string().url("Must be a valid image URL").max(500, "URL is too long"),
  videoLink: z.string().url("Must be a valid video link").max(500, "URL is too long"),
  views: z.string().max(20, "Views string is too long"), // Could be "2.4M"
  posted: z.string().max(20, "Posted string is too long"), // Could be "2 days ago"
});
