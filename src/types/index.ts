export type Genre =
  | 'Pop'
  | 'Hip-Hop'
  | 'R&B'
  | 'Rock'
  | 'Country'
  | 'Latin'
  | 'Electronic'
  | 'Alternative'
  | 'Afrobeats'
  | 'Cinematic'
  | 'Indie'
  | 'Jazz'
  | 'Soul'
  | 'Funk'
  | 'Latin Pop'
  | 'Reggaeton'
  | 'K-Pop'
  | 'Indie Pop'
  | 'Dream Pop'
  | 'Folk'
  | 'Disco'
  | 'Piano Rock'
  | 'Trap'
  | 'Neo-Soul'
  | 'Flamenco'
  | 'Rap'
  | 'Melodic Rap'
  | 'Emo Rap'
  | 'Alternative Rap'
  | 'Cloud Rap'
  | 'Psychedelic Rap'
  | 'Production'
  | 'Drill'
  | 'Southern Rap'
  | 'East Coast Rap'
  | 'West Coast Rap'
  | 'Gangsta Rap'
  | 'G-Funk'
  | 'Jazz Rap'
  | 'Gospel Rap'
  | 'Conscious Rap'
  | 'Hardcore Rap'
  | 'Pop Rap'
  | 'SoundCloud Rap'
  | 'Country Rap'
  | 'Golden Age Hip-Hop'
  | 'Experimental Rap';


export type ReleaseType = 'ALBUM' | 'EP' | 'SINGLE' | 'VINYL';

export type ChartCategory = 
  | 'HOT_100' 
  | 'GLOBAL_200' 
  | 'ALBUM_200' 
  | 'ARTIST_100' 
  | 'GENRE_HIPHOP' 
  | 'GENRE_POP' 
  | 'GENRE_LATIN';

export interface ChartEntry {
  id: string;
  chartCategory: ChartCategory;
  weekDate: string; // ISO date string e.g. "2026-07-21"
  rank: number;
  lastWeekRank: number | null; // null for NEW entries
  peakPosition: number;
  weeksOnChart: number;
  trend: 'UP' | 'DOWN' | 'STABLE' | 'NEW' | 'RE_ENTRY';
  
  // Track / Album metadata
  title: string;
  artistName: string;
  artistSlug: string;
  albumTitle?: string;
  coverUrl: string;
  audioPreviewUrl?: string;
  genre: Genre;
  countryFlag: string;
  weeklyStreams: number;
  weeklySales?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | { code: string; message: string; details?: unknown };
  meta?: Record<string, unknown>;
}

export interface StreamingPlatform {
  id: string;
  name: string;
  url: string;
}

export interface ArtistVideo {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl: string;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  imageUrl?: string;
  heroUrl: string;
  genres: Genre[];
  primaryGenre?: string;
  country: string;
  countryFlag?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  labelStatus?: 'EXCLUSIVE' | 'SIGNED' | 'ALUMNI' | 'VERIFIED' | 'OPEN';
  monthlyListeners: number;
  totalStreams: number;
  grammyWins: number;
  topSongs?: string[];
  riaaCertifications: {
    platinum: number;
    gold: number;
    diamond: number;
  };
  latestReleaseTitle?: string;
  latestReleaseDate?: string;
  epkUrl?: string;
  videos?: ArtistVideo[];
  socials: {
    website?: string;
    spotify?: string;
    apple?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    soundCloud?: string;
    tiktok?: string;
  };
  streamingPlatforms: StreamingPlatform[];
  biographyLastVerified?: string;
  verificationConfidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  verificationNotes?: string;
}

export interface Release {
  id: string;
  title: string;
  slug: string;
  artistId: string;
  artistName: string;
  type: ReleaseType;
  releaseDate: string;
  coverUrl: string;
  catalogNumber: string;
  upcCode: string;
  spotifyUrl?: string;
  appleUrl?: string;
  buyVinylUrl?: string;
  tracksCount: number;
  isFeatured?: boolean;
}

export interface Track {
  id: string;
  releaseId: string;
  releaseTitle: string;
  releaseCoverUrl: string;
  artistId: string;
  artistName: string;
  title: string;
  duration: number;
  isrcCode: string;
  trackNumber: number;
  playsCount: number;
  isExplicit?: boolean;
}

export interface TourDate {
  id: string;
  artistId: string;
  artistName: string;
  tourName: string;
  venue: string;
  city: string;
  country: string;
  eventDate: string;
  ticketStatus: 'AVAILABLE' | 'FEW_LEFT' | 'SOLD_OUT';
  ticketUrl: string;
}

export interface MerchItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: 'VINYL' | 'APPAREL' | 'ACCESSORIES' | 'COLLECTIBLE';
  imageUrl: string;
  isExclusive?: boolean;
  stock: number;
  sizes?: string[];
  description: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  summary: string;
  content: string;
  author: string;
  mentionedArtistSlugs?: string[];
}

export interface ExtendedSubmission {
  id: string;
  fullName: string;
  stageName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  age: number;
  genre: string;
  experience: string;
  biography: string;
  spotifyUrl: string;
  appleUrl?: string;
  youtubeUrl?: string;
  videoUrl?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  audioUrl: string;
  coverImageUrl?: string;
  pressKitPdfUrl?: string;
  message: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  submittedAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  imageUrl: string;
  videoLink: string;
  views: string;
  posted: string;
}

export interface AdItem {
  id: string;
  isAd: boolean;
  adText: string;
  cta: string;
}
