import { createClient } from '@/lib/supabase/server';
import { InternalServerError } from '@/lib/errors';
import { asyncContext } from '@/lib/logger';

export class VideoRepository {
  static async insert(videoData: any) {
    const supabase = createClient();
    const traceId = asyncContext.getStore()?.get('traceId') || 'NO-TRACE-ID';

    const { data, error } = await supabase
      .from('videos')
      .insert([videoData])
      .select()
      .single();

    if (error) {
      throw new InternalServerError(`Database Insert Error: ${error.message}`, traceId);
    }
    return data;
  }
}
