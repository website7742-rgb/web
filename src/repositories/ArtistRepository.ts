import { createClient } from '@/lib/supabase/server';
import { InternalServerError } from '@/lib/errors';
import { asyncContext } from '@/lib/logger';

export class ArtistRepository {
  static async upsert(artistData: any) {
    const supabase = createClient();
    const traceId = asyncContext.getStore()?.get('traceId') || 'NO-TRACE-ID';

    const { data, error } = await supabase
      .from('artists')
      .upsert(artistData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      throw new InternalServerError(`Database Upsert Error: ${error.message}`, traceId);
    }
    return data;
  }

  static async delete(artistId: string) {
    const supabase = createClient();
    const traceId = asyncContext.getStore()?.get('traceId') || 'NO-TRACE-ID';

    const { error } = await supabase.from('artists').delete().eq('id', artistId);
    if (error) {
      throw new InternalServerError(`Database Delete Error: ${error.message}`, traceId);
    }
  }
}
