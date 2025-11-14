# Database Migration Instructions

## Which Migrations to Run

### Scenario 1: Fresh Database (No existing data)
**Run only:** `001_initial_schema.sql`

This migration now includes all columns in the correct order:
- Creates all tables (users, conversations, user_preferences, survey_questions)
- Includes auth_user_id, first_name, last_name from the start
- Sets up indexes and RLS policies

**Steps:**
1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `001_initial_schema.sql`
3. Click "Run"
4. Done! ✅

---

### Scenario 2: Existing Database (You already have data)
**Run in order:** `001`, `002`, `003` (and optionally `004`)

#### Step 1: Run 001_initial_schema.sql
- Creates tables if they don't exist
- Safe to run multiple times (uses `IF NOT EXISTS`)

#### Step 2: Run 002_add_user_profile_fields.sql
- Adds: `auth_user_id`, `first_name`, `last_name`
- Safe to run multiple times (uses `IF NOT EXISTS`)
- If columns already exist, it will skip them

#### Step 3: Run 003_remove_email_column.sql
- Removes email column if it exists
- Safe to run multiple times
- Only needed if you had email column before

#### Step 4: (Optional) Run 004_reorder_users_columns.sql
- Reorders columns for better organization
- **Warning:** This drops and recreates the users table
- Only run if you want the columns in a specific order
- **Backup your data first!**

---

## Quick Decision Guide

**Question: Do you have an existing database with users table?**

- **No** → Run `001_initial_schema.sql` only
- **Yes** → Run `001`, `002`, `003` in order

**Question: Do you want to reorder columns in existing database?**

- **No** → Skip `004_reorder_users_columns.sql`
- **Yes** → Run `004_reorder_users_columns.sql` after the others (backup first!)

---

## How to Run Migrations in Supabase

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste SQL**
   - Open the migration file
   - Copy the entire contents
   - Paste into SQL Editor

4. **Run the Migration**
   - Click "Run" button (or press `Cmd+Enter` / `Ctrl+Enter`)
   - Wait for "Success" message

5. **Verify**
   - Check the Table Editor to see if columns exist
   - Or run: `SELECT * FROM users LIMIT 1;`

---

## Migration File Summary

| File | Purpose | When to Run |
|------|---------|-------------|
| `001_initial_schema.sql` | Creates all tables with complete schema | **Always run first** |
| `002_add_user_profile_fields.sql` | Adds profile fields to existing tables | Only if database existed before |
| `003_remove_email_column.sql` | Removes email column | Only if you had email before |
| `004_reorder_users_columns.sql` | Reorders columns | Optional, for existing databases only |

---

## Current Database State Check

To check what columns you currently have, run this in SQL Editor:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

This will show you:
- Which columns exist
- Their current order
- Whether you need to run migrations 002, 003, or 004

---

## Troubleshooting

### "Column already exists" error
- This is fine! The migrations use `IF NOT EXISTS` so they'll skip existing columns
- Just continue with the next migration

### "Table doesn't exist" error
- Make sure you ran `001_initial_schema.sql` first
- Check that you're in the correct database/project

### Foreign key constraint errors
- Usually means you're running migrations out of order
- Make sure to run `001` before `002`, `003`, or `004`

---

## Recommended Approach

**For most users:**
1. Run `001_initial_schema.sql` ✅
2. Done!

**If you have an existing database:**
1. Run `001_initial_schema.sql`
2. Run `002_add_user_profile_fields.sql`
3. Run `003_remove_email_column.sql`
4. (Optional) Run `004_reorder_users_columns.sql` if you want reordered columns

