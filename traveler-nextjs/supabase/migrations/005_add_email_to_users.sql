-- Add email column to users table for onboarding
-- Email is optional and can be collected during onboarding flow
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index on email for lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;

-- Add unique constraint on email to prevent duplicates (only for non-null emails)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email) WHERE email IS NOT NULL;


