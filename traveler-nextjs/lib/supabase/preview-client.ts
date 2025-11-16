import { createClient, SupabaseClient } from '@supabase/supabase-js';

const previewUrl = process.env.NEXT_PUBLIC_TUSQ_PREVIEW_URL;
const previewAnonKey = process.env.NEXT_PUBLIC_TUSQ_PREVIEW_ANON_KEY;

// Only create preview client if environment variables are provided
// This allows the app to work without the preview database configured
export const previewSupabase: SupabaseClient | null = 
  previewUrl && previewAnonKey
    ? createClient(previewUrl, previewAnonKey)
    : null;

