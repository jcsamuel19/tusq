/**
 * Test script to diagnose schema issues
 * Run with: node scripts/test-schema.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSchema() {
  console.log('🔍 Testing Database Schema...\n');

  // Test 1: Check if we can connect to the database
  console.log('Test 1: Checking database connection...');
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return;
    }
    console.log('✅ Database connection successful\n');
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return;
  }

  // Test 2: Check if users table exists and get its structure
  console.log('Test 2: Checking users table structure...');
  try {
    const { data, error } = await supabase
      .rpc('exec_sql', {
        query: `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = 'users'
          ORDER BY ordinal_position;
        `
      });

    // Alternative: Try to query the table structure directly
    const { data: columns, error: columnError } = await supabase
      .from('users')
      .select('*')
      .limit(0);

    if (columnError) {
      console.error('❌ Error getting table structure:', columnError.message);
    } else {
      console.log('✅ Users table exists');
      // Try to get a sample row to see what columns are available
      const { data: sample, error: sampleError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (!sampleError && sample && sample.length > 0) {
        console.log('   Available columns:', Object.keys(sample[0]).join(', '));
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test 3: Try to query with the new columns
  console.log('\nTest 3: Testing column access...');
  const columnsToTest = ['first_name', 'last_name', 'email', 'auth_user_id'];
  
  for (const column of columnsToTest) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(column)
        .limit(1);
      
      if (error) {
        console.log(`❌ Column '${column}': ${error.message}`);
      } else {
        console.log(`✅ Column '${column}': exists and accessible`);
      }
    } catch (error) {
      console.log(`❌ Column '${column}': ${error.message}`);
    }
  }

  // Test 4: Try to insert a test user with all new fields
  console.log('\nTest 4: Testing insert with new fields...');
  const testPhone = `+1555${Date.now().toString().slice(-7)}`; // Unique test phone
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        phone_number: testPhone,
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        auth_user_id: null, // We'll test with null first
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Insert failed:', error);
      console.error('   Code:', error.code);
      console.error('   Message:', error.message);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
    } else {
      console.log('✅ Insert successful!');
      console.log('   Created user:', data.id);
      
      // Clean up test user
      await supabase.from('users').delete().eq('id', data.id);
      console.log('   Test user cleaned up');
    }
  } catch (error) {
    console.error('❌ Insert error:', error.message);
  }

  // Test 5: Check if we can query with auth_user_id
  console.log('\nTest 5: Testing auth_user_id column...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('auth_user_id')
      .limit(1);

    if (error) {
      console.error('❌ Query with auth_user_id failed:', error.message);
    } else {
      console.log('✅ auth_user_id column is accessible');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n📊 Schema Test Complete!');
}

testSchema().catch(console.error);

