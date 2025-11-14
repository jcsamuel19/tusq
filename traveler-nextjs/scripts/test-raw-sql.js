/**
 * Test script to run raw SQL queries against Supabase
 * This helps verify if the migration actually ran
 * Run with: node scripts/test-raw-sql.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkColumns() {
  console.log('🔍 Checking users table columns...\n');

  // Query to check if columns exist
  const query = `
    SELECT 
      column_name, 
      data_type, 
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_name = 'users'
    AND table_schema = 'public'
    ORDER BY ordinal_position;
  `;

  try {
    // Use RPC if available, otherwise we'll use a direct query approach
    const { data, error } = await supabase.rpc('exec_sql', { query });

    if (error) {
      console.log('⚠️  RPC method not available, trying alternative...');
      
      // Alternative: Check by trying to select each column
      const columns = ['id', 'phone_number', 'first_name', 'last_name', 'auth_user_id', 'created_at'];
      console.log('\nTesting column existence by attempting selects:\n');
      
      for (const col of columns) {
        const { error: colError } = await supabase
          .from('users')
          .select(col)
          .limit(0);
        
        if (colError) {
          console.log(`❌ ${col}: ${colError.message}`);
        } else {
          console.log(`✅ ${col}: exists`);
        }
      }
    } else {
      console.log('Columns in users table:');
      data.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testMigration() {
  console.log('\n🧪 Testing migration application...\n');
  
  // Check if migration columns exist
  const requiredColumns = ['first_name', 'last_name', 'auth_user_id'];
  const missingColumns = [];

  for (const col of requiredColumns) {
    const { error } = await supabase
      .from('users')
      .select(col)
      .limit(0);
    
    if (error) {
      missingColumns.push(col);
      console.log(`❌ Missing column: ${col}`);
      console.log(`   Error: ${error.message}`);
    } else {
      console.log(`✅ Column exists: ${col}`);
    }
  }

  if (missingColumns.length > 0) {
    console.log(`\n⚠️  Missing columns: ${missingColumns.join(', ')}`);
    console.log('\n📝 To fix, run this SQL in Supabase SQL Editor:');
    console.log(`
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
    `);
  } else {
    console.log('\n✅ All migration columns exist!');
  }
}

async function runTests() {
  await checkColumns();
  await testMigration();
}

runTests().catch(console.error);

