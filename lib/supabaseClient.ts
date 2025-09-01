import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedServerClient: SupabaseClient | null = null;

// Cliente de servidor con cache
export function getSupabaseServerClient(): SupabaseClient {
  if (cachedServerClient) return cachedServerClient;

  
  const SUPABASE_URL = process.env.SUPABASE_URL!;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if(!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)
    throw new Error('Missing Supabase credentials');

  cachedServerClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  return cachedServerClient;
}