-- This script reloads the PostgREST schema cache
-- Run this after applying migrations if you get schema cache errors

-- Method 1: Use NOTIFY (if you have permission)
NOTIFY pgrst, 'reload schema';

-- Method 2: If NOTIFY doesn't work, you can reload via Supabase Dashboard:
-- 1. Go to Settings > API
-- 2. Scroll down and click "Reload Schema" button
-- Or wait 1-2 minutes for automatic reload

-- Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('first_name', 'last_name', 'auth_user_id');

