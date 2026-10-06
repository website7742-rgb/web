import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export interface ArtistVideoOverride {
  id?: string;
  artist_slug: string;
  artist_name: string;
  youtube_video_id: string;
  youtube_url: string;
  title: string;
  channel_name: string;
  thumbnail_url?: string | null;
  published_at?: string | null;
  source: 'MANUAL_STUDIO';
  is_active: boolean;
  admin_note?: string | null;
  match_confidence?: 'EXACT' | 'WARNING' | 'MISMATCH';
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

export class ArtistVideoOverrideRepository {
  private inMemoryStore: Map<string, ArtistVideoOverride> = new Map();
  private hasLoadedDevStore = false;

  private isProduction(): boolean {
    return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  }

  private getSupabaseAdmin(): SupabaseClient | null {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !serviceRoleKey) return null;

    return createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  private getDevFallbackFilePath(): string {
    return path.join(process.cwd(), 'src', 'lib', 'data', 'artist_video_overrides.json');
  }

  private ensureDevStoreLoaded() {
    if (this.isProduction()) return; // Never load or use local JSON in production
    if (this.hasLoadedDevStore) return;
    this.hasLoadedDevStore = true;

    try {
      const filePath = this.getDevFallbackFilePath();
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const list: ArtistVideoOverride[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          for (const item of list) {
            if (item && item.artist_slug) {
              this.inMemoryStore.set(item.artist_slug.toLowerCase(), item);
            }
          }
        }
      }
    } catch {
      // In-memory fallback remains active in dev
    }
  }

  private persistDevStore() {
    if (this.isProduction()) return; // Never persist to local JSON in production
    try {
      const filePath = this.getDevFallbackFilePath();
      const list = Array.from(this.inMemoryStore.values());
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch {
      // Ignore write errors in read-only environments
    }
  }

  /**
   * Fetch active video override for a specific artist slug.
   * Production rule: public.artist_video_overrides is the SOLE authoritative store.
   */
  async getOverride(slug: string): Promise<ArtistVideoOverride | null> {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();

    const supabase = this.getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('artist_video_overrides')
          .select('*')
          .eq('artist_slug', cleanSlug)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          if (this.isProduction()) {
            console.error(`[ArtistVideoOverrideRepository] Supabase query error for '${cleanSlug}':`, error.message);
            return null;
          }
        } else if (data) {
          return {
            id: data.id,
            artist_slug: data.artist_slug,
            artist_name: data.artist_name,
            youtube_video_id: data.youtube_video_id,
            youtube_url: data.youtube_url,
            title: data.title,
            channel_name: data.channel_name,
            thumbnail_url: data.thumbnail_url,
            published_at: data.published_at,
            source: 'MANUAL_STUDIO',
            is_active: data.is_active,
            admin_note: data.admin_note,
            match_confidence: data.match_confidence || 'EXACT',
            created_by: data.created_by,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
        }
      } catch (err: any) {
        if (this.isProduction()) {
          console.error(`[ArtistVideoOverrideRepository] Supabase connection error:`, err?.message);
          return null;
        }
      }
    }

    // In production, do NOT fall back to local JSON or alternative tables
    if (this.isProduction()) {
      return null;
    }

    // Development only fallback
    this.ensureDevStoreLoaded();
    const local = this.inMemoryStore.get(cleanSlug);
    if (local && local.is_active) {
      return local;
    }

    return null;
  }

  /**
   * Fetch all overrides (for Studio management panel)
   * Production rule: public.artist_video_overrides is the SOLE authoritative store.
   */
  async getAllOverrides(): Promise<ArtistVideoOverride[]> {
    const supabase = this.getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('artist_video_overrides')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('[ArtistVideoOverrideRepository] Supabase getAllOverrides error:', error.message);
          if (this.isProduction()) {
            throw new Error(`Database error: Could not query public.artist_video_overrides (${error.message}).`);
          }
        } else if (Array.isArray(data)) {
          return data.map((item) => ({
            id: item.id,
            artist_slug: item.artist_slug,
            artist_name: item.artist_name,
            youtube_video_id: item.youtube_video_id,
            youtube_url: item.youtube_url,
            title: item.title,
            channel_name: item.channel_name,
            thumbnail_url: item.thumbnail_url,
            published_at: item.published_at,
            source: 'MANUAL_STUDIO',
            is_active: item.is_active,
            admin_note: item.admin_note,
            match_confidence: item.match_confidence || 'EXACT',
            created_by: item.created_by,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }));
        }
      } catch (err: any) {
        console.error('[ArtistVideoOverrideRepository] Supabase query error:', err?.message);
        if (this.isProduction()) {
          throw err;
        }
      }
    }

    if (this.isProduction()) {
      return [];
    }

    this.ensureDevStoreLoaded();
    return Array.from(this.inMemoryStore.values()).sort((a, b) => {
      const timeA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const timeB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return timeB - timeA;
    });
  }

  /**
   * Upsert a manual video override.
   * Production rule: Persists strictly to public.artist_video_overrides.
   */
  async upsertOverride(override: Partial<ArtistVideoOverride> & {
    artist_slug: string;
    artist_name: string;
    youtube_video_id: string;
    youtube_url: string;
    title: string;
    channel_name: string;
  }): Promise<ArtistVideoOverride> {
    const cleanSlug = override.artist_slug.toLowerCase().trim();
    const now = new Date().toISOString();

    const record: ArtistVideoOverride = {
      id: override.id,
      artist_slug: cleanSlug,
      artist_name: override.artist_name.trim(),
      youtube_video_id: override.youtube_video_id.trim(),
      youtube_url: override.youtube_url.trim(),
      title: override.title.trim(),
      channel_name: override.channel_name.trim(),
      thumbnail_url: override.thumbnail_url || `https://i.ytimg.com/vi/${override.youtube_video_id.trim()}/hqdefault.jpg`,
      published_at: override.published_at || now,
      source: 'MANUAL_STUDIO',
      is_active: override.is_active !== undefined ? override.is_active : true,
      admin_note: override.admin_note?.trim() || null,
      match_confidence: override.match_confidence || 'EXACT',
      created_by: isValidUuid(override.created_by) ? override.created_by : null,
      created_at: override.created_at || now,
      updated_at: now,
    };

    const supabase = this.getSupabaseAdmin();
    if (!supabase) {
      throw new Error('Supabase admin client unconfigured (missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
    }

    const { data, error } = await supabase
      .from('artist_video_overrides')
      .upsert(
        {
          artist_slug: record.artist_slug,
          artist_name: record.artist_name,
          youtube_video_id: record.youtube_video_id,
          youtube_url: record.youtube_url,
          title: record.title,
          channel_name: record.channel_name,
          thumbnail_url: record.thumbnail_url,
          published_at: record.published_at,
          source: 'MANUAL_STUDIO',
          is_active: record.is_active,
          admin_note: record.admin_note,
          match_confidence: record.match_confidence,
          created_by: record.created_by,
          updated_at: now,
        },
        { onConflict: 'artist_slug' }
      )
      .select()
      .single();

    if (error) {
      console.error('[ArtistVideoOverrideRepository] Supabase upsert error on public.artist_video_overrides:', error.message);
      if (this.isProduction()) {
        throw new Error(`Database error: Could not persist override to public.artist_video_overrides (${error.message}). Please ensure migration is applied.`);
      }
      // Dev mode fallback
      this.ensureDevStoreLoaded();
      this.inMemoryStore.set(cleanSlug, record);
      this.persistDevStore();
      return record;
    }

    if (data) {
      record.id = data.id;
      record.created_at = data.created_at;
      record.updated_at = data.updated_at;
    }

    return record;
  }

  /**
   * Set is_active = false (Unpublish)
   * Production rule: Updates strictly public.artist_video_overrides.
   */
  async unpublishOverride(slug: string): Promise<boolean> {
    if (!slug) return false;
    const cleanSlug = slug.toLowerCase().trim();

    const supabase = this.getSupabaseAdmin();
    if (!supabase) {
      throw new Error('Supabase admin client unconfigured.');
    }

    const { error } = await supabase
      .from('artist_video_overrides')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('artist_slug', cleanSlug);

    if (error) {
      console.error('[ArtistVideoOverrideRepository] Supabase unpublish error on public.artist_video_overrides:', error.message);
      if (this.isProduction()) {
        throw new Error(`Database error: Could not unpublish in public.artist_video_overrides (${error.message}).`);
      }
      // Dev mode fallback
      this.ensureDevStoreLoaded();
      const existing = this.inMemoryStore.get(cleanSlug);
      if (existing) {
        existing.is_active = false;
        existing.updated_at = new Date().toISOString();
        this.inMemoryStore.set(cleanSlug, existing);
        this.persistDevStore();
      }
      return true;
    }

    return true;
  }

  /**
   * Remove / Delete override completely
   * Production rule: Deletes strictly from public.artist_video_overrides.
   */
  async deleteOverride(slug: string): Promise<boolean> {
    if (!slug) return false;
    const cleanSlug = slug.toLowerCase().trim();

    const supabase = this.getSupabaseAdmin();
    if (!supabase) {
      throw new Error('Supabase admin client unconfigured.');
    }

    const { error } = await supabase
      .from('artist_video_overrides')
      .delete()
      .eq('artist_slug', cleanSlug);

    if (error) {
      console.error('[ArtistVideoOverrideRepository] Supabase delete error on public.artist_video_overrides:', error.message);
      if (this.isProduction()) {
        throw new Error(`Database error: Could not delete override from public.artist_video_overrides (${error.message}).`);
      }
    }

    // Dev cleanup
    if (!this.isProduction()) {
      this.ensureDevStoreLoaded();
      this.inMemoryStore.delete(cleanSlug);
      this.persistDevStore();
    }

    return true;
  }
}

export const artistVideoOverrideRepository = new ArtistVideoOverrideRepository();
