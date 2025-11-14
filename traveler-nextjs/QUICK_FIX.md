# 🚨 Quick Fix: Run Database Migration

## The Problem
The error shows: **"The auth_user_id column may not exist in the database"**

This means the migration hasn't been run in Supabase yet.

## ✅ Solution (5 minutes)

### Step 1: Check Current Status
Open this URL in your browser (while your dev server is running):
```
http://localhost:3000/api/debug/schema-check
```

This will show you which columns are missing.

### Step 2: Run the Migration in Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Sign in and select your project

2. **Open SQL Editor**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"** button

3. **Copy and Paste This SQL:**

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
```

4. **Run the SQL**
   - Click the **"Run"** button (or press `Cmd+Enter` / `Ctrl+Enter`)
   - You should see: "Success. No rows returned"

### Step 3: Verify It Worked

1. **Check the debug endpoint again:**
   ```
   http://localhost:3000/api/debug/schema-check
   ```
   You should see `"status": "ok"` and all columns marked as `exists: true`

2. **Or run the test script:**
   ```bash
   node scripts/test-raw-sql.js
   ```
   All columns should show ✅

### Step 4: Wait for Cache Refresh

- Wait **1-2 minutes** for Supabase's schema cache to refresh
- Or restart your dev server: `npm run dev`

### Step 5: Test Registration

Try registering a new user again. It should work now! 🎉

## Still Having Issues?

If you're still seeing errors after running the migration:

1. **Check if you're in the correct Supabase project**
   - Make sure your `.env.local` has the correct `NEXT_PUBLIC_SUPABASE_URL`

2. **Verify the migration ran successfully**
   - In Supabase Dashboard → SQL Editor → Check your query history
   - You should see the ALTER TABLE query

3. **Try reloading the schema cache manually**
   - In Supabase Dashboard → Settings → API
   - Look for "Reload Schema" button (if available)

4. **Run the diagnostic script:**
   ```bash
   node scripts/test-schema.js
   ```

## Need Help?

If none of this works, share:
- The output from `http://localhost:3000/api/debug/schema-check`
- The output from `node scripts/test-raw-sql.js`
- Any error messages you're seeing

