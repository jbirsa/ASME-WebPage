// supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let cachedServerClient: SupabaseClient | null = null;

// Cliente de servidor con cache
export function getSupabaseServerClient(): SupabaseClient {
  if (cachedServerClient) return cachedServerClient;

  cachedServerClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  return cachedServerClient;
}


