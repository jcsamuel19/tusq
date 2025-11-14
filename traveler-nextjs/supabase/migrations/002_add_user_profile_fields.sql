-- Add first_name, last_name, and auth_user_id to users table
-- Note: If you're creating a fresh database, these columns are already in 001_initial_schema.sql
-- This migration is for existing databases that were created before the schema update
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Create index on auth_user_id for fast lookups (if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
