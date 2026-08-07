import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ok2RbNf7CZn-raMzL0Qtuw_U7qRB5M0';

  // Safeguard against invalid or missing env configurations during SSR
  if (!supabaseUrl.startsWith('http')) {
    supabaseUrl = 'https://krnsfelxtkpsiueuovwp.supabase.co';
  }
  if (!supabaseAnonKey || supabaseAnonKey.length < 10) {
    supabaseAnonKey = 'sb_publishable_ok2RbNf7CZn-raMzL0Qtuw_U7qRB5M0';
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
