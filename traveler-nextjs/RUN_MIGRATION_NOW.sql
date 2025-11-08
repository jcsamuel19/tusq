-- ============================================
-- MIGRATION: Add User Profile Fields
-- ============================================
-- Copy and paste this ENTIRE block into Supabase SQL Editor
-- Then click "Run" or press Cmd+Enter / Ctrl+Enter
-- ============================================

-- Step 1: Add the new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

-- Step 2: Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;

-- Step 3: Verify the columns were added (this will show the new columns)
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('first_name', 'last_name', 'email', 'auth_user_id')
ORDER BY column_name;

-- ============================================
-- Expected Result:
-- You should see 4 rows returned showing:
-- - auth_user_id (uuid, nullable)
-- - email (text, nullable)
-- - first_name (text, nullable)
-- - last_name (text, nullable)
-- ============================================

