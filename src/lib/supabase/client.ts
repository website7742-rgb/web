import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ok2RbNf7CZn-raMzL0Qtuw_U7qRB5M0';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
