import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL2;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY2;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL2 and NEXT_PUBLIC_SUPABASE_ANON_KEY2'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (requires service role key)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY2;

export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

