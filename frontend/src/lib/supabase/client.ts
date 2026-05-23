import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Modern Supabase Browser client for Next.js 16.
 * Uses @supabase/ssr for cookie synchronization.
 */
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);
