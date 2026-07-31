import { createClient } from '@/lib/supabase/server';
import { InternalServerError } from '@/lib/errors';
import { asyncContext } from '@/lib/logger';

export class ProfileRepository {
  static async updateProfile(userId: string, profileData: { display_name?: string; bio?: string; avatar_url?: string }) {
    const supabase = createClient();
    const traceId = asyncContext.getStore()?.get('traceId') || 'NO-TRACE-ID';

    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new InternalServerError(`Database Update Error: ${error.message}`, traceId);
    }
    
    return data;
  }
}
