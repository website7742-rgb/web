'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(formData: FormData) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} }
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Unauthorized');

    const fullName = formData.get('fullName') as string;
    const bio = formData.get('bio') as string;
    const instagramUrl = formData.get('instagramUrl') as string;
    const twitterUrl = formData.get('twitterUrl') as string;

    // 1. Update the Profiles table (which has full_name)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      throw new Error('Failed to update public profile name.');
    }

    // 2. Update user_metadata for extended fields since they might not be in the profiles table schema yet
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        bio: bio || null,
        instagram_url: instagramUrl || null,
        twitter_url: twitterUrl || null,
      }
    });

    if (authError) {
      console.error('Auth metadata update error:', authError);
      throw new Error('Failed to update extended profile information.');
    }

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error occurred.' };
  }
}
