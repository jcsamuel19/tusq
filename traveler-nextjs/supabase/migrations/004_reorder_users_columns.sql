-- Reorder users table columns for better organization
-- This migration recreates the table with a more logical column order
-- 
-- New order:
-- 1. id (primary key)
-- 2. auth_user_id (authentication reference)
-- 3. first_name (user profile)
-- 4. last_name (user profile)
-- 5. phone_number (contact info)
-- 6. is_active (status flags)
-- 7. digest_paused (status flags)
-- 8. survey_started_at (survey tracking)
-- 9. survey_completed_at (survey tracking)
-- 10. last_activity_at (activity tracking)
-- 11. created_at (system metadata)
-- 12. updated_at (system metadata)

BEGIN;

-- Step 1: Create new table with desired column order
CREATE TABLE IF NOT EXISTS users_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  digest_paused BOOLEAN DEFAULT FALSE,
  survey_started_at TIMESTAMP WITH TIME ZONE,
  survey_completed_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Copy all data from old table to new table
INSERT INTO users_new (
  id,
  auth_user_id,
  first_name,
  last_name,
  phone_number,
  is_active,
  digest_paused,
  survey_started_at,
  survey_completed_at,
  last_activity_at,
  created_at,
  updated_at
)
SELECT 
  id,
  auth_user_id,
  first_name,
  last_name,
  phone_number,
  is_active,
  digest_paused,
  survey_started_at,
  survey_completed_at,
  last_activity_at,
  created_at,
  updated_at
FROM users;

-- Step 3: Drop old table (this will cascade delete foreign key constraints)
DROP TABLE IF EXISTS users CASCADE;

-- Step 4: Rename new table to original name
ALTER TABLE users_new RENAME TO users;

-- Step 5: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- Step 6: Recreate foreign key constraints
-- Note: This will recreate the foreign keys from conversations and user_preferences tables
ALTER TABLE conversations 
  ADD CONSTRAINT conversations_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_preferences 
  ADD CONSTRAINT user_preferences_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Step 7: Re-enable RLS and recreate policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role');

COMMIT;

