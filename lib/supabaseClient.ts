import { createClient } from '@supabase/supabase-js';

/**
 * Returns a Supabase client instance configured for either the browser
 * (with the anon key) or the server (with the service role key).  On
 * the server side you can pass in a Service Role key via the
 * `SUPABASE_SERVICE_ROLE_KEY` environment variable which allows you to
 * bypass RLS for background jobs.  Never expose the service role key
 * to the browser.
 */
export function getSupabaseClient(isServer = false) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
  const key = isServer && serviceRoleKey ? serviceRoleKey : anonKey;
  if (!key) {
    throw new Error('Missing Supabase API key');
  }
  return createClient(supabaseUrl, key);
}

export const supabase = getSupabaseClient(false);
