-- Verify that the migration columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('first_name', 'last_name', 'email', 'auth_user_id')
ORDER BY column_name;

-- If the query above returns 4 rows, the migration was successful
-- If it returns fewer rows, run the migration: 002_add_user_profile_fields.sql

