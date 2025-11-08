# Database Migration Guide

## Problem
The `auth_user_id`, `first_name`, `last_name`, and `email` columns are missing from the `users` table.

## Solution: Run the Migration

### Step 1: Open Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Migration
Copy and paste this SQL into the SQL Editor:

```sql
-- Add first_name and last_name to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

-- Create index on auth_user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- Create index on email for fast lookups (if email is used)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;
```

3. Click **Run** (or press `Cmd+Enter` / `Ctrl+Enter`)
4. You should see "Success. No rows returned" or a similar success message

### Step 3: Verify the Migration
After running the migration, run this verification script:

```bash
node scripts/test-raw-sql.js
```

You should see all columns marked with ✅.

### Step 4: Wait for Schema Cache Refresh
- Wait 1-2 minutes for Supabase's schema cache to refresh automatically
- Or manually reload: Go to **Settings** → **API** → Click **Reload Schema** (if available)

### Step 5: Test the Signup
Try registering a new user through the UI or run:

```bash
node scripts/test-signup-api.js
```

## Troubleshooting

### If migration fails:
- Make sure you're connected to the correct project
- Check that the `users` table exists
- Verify you have the correct permissions

### If schema cache doesn't refresh:
1. Wait 2-3 minutes
2. Restart your Next.js dev server: `npm run dev`
3. Try the signup again

### If you still get errors:
Run the diagnostic script:
```bash
node scripts/test-schema.js
```

This will show you exactly which columns are missing and what errors are occurring.

