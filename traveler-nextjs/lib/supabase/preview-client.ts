import { createClient } from '@supabase/supabase-js';

const previewUrl = process.env.NEXT_PUBLIC_TUSQ_PREVIEW_URL;
const previewAnonKey = process.env.NEXT_PUBLIC_TUSQ_PREVIEW_ANON_KEY;

if (!previewUrl || !previewAnonKey) {
  throw new Error(
    'Missing TUSQ_PREVIEW environment variables. Please set NEXT_PUBLIC_TUSQ_PREVIEW_URL and NEXT_PUBLIC_TUSQ_PREVIEW_ANON_KEY'
  );
}

export const previewSupabase = createClient(previewUrl, previewAnonKey);

