/**
 * Test script to test the signup API endpoint directly
 * Run with: node scripts/test-signup-api.js
 */

require('dotenv').config({ path: '.env.local' });

async function testSignupAPI() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/users/signup`;

  console.log('🧪 Testing Signup API...\n');
  console.log('API URL:', apiUrl);

  const testData = {
    firstName: 'Test',
    lastName: 'User',
    phone: '(555) 123-4567',
    password: 'testpassword123',
  };

  console.log('\nTest Data:', testData);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    console.log('\n📊 Response:');
    console.log('Status:', response.status);
    console.log('Body:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ Signup successful!');
    } else {
      console.log('\n❌ Signup failed');
      if (result.error) {
        console.log('Error:', result.error);
      }
    }
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
    console.error('Make sure your dev server is running: npm run dev');
  }
}

testSignupAPI();

