/**
 * Quick test script to verify Twilio setup
 * Run with: node test-twilio.js
 */

require('dotenv').config({ path: '.env.local' });

const twilio = require('twilio');

async function testTwilio() {
  console.log('🧪 Testing Twilio Configuration...\n');

  // Check environment variables
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid) {
    console.error('❌ TWILIO_ACCOUNT_SID is not set in .env.local');
    process.exit(1);
  }

  if (!authToken) {
    console.error('❌ TWILIO_AUTH_TOKEN is not set in .env.local');
    process.exit(1);
  }

  if (!phoneNumber) {
    console.error('❌ TWILIO_PHONE_NUMBER is not set in .env.local');
    process.exit(1);
  }

  console.log('✅ Environment variables found');
  console.log(`   Account SID: ${accountSid.substring(0, 10)}...`);
  console.log(`   Phone Number: ${phoneNumber}\n`);

  // Test Twilio client
  try {
    const client = twilio(accountSid, authToken);
    
    // Test: Get account info
    console.log('📡 Testing Twilio connection...');
    const account = await client.api.accounts(accountSid).fetch();
    console.log(`✅ Connected to Twilio account: ${account.friendlyName || 'Default'}\n`);

    // Test: Verify phone number
    console.log('📱 Verifying phone number...');
    const incomingNumbers = await client.incomingPhoneNumbers.list({ phoneNumber });
    
    if (incomingNumbers.length > 0) {
      console.log(`✅ Phone number verified: ${phoneNumber}`);
      console.log(`   Status: ${incomingNumbers[0].status}\n`);
    } else {
      console.log(`⚠️  Warning: Phone number ${phoneNumber} not found in your account`);
      console.log('   Make sure you\'ve purchased/verified this number in Twilio Console\n');
    }

    console.log('✅ Twilio setup looks good!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start your dev server: npm run dev');
    console.log('   2. Go to http://localhost:3000');
    console.log('   3. Enter your phone number in the signup form');
    console.log('   4. You should receive a welcome SMS!\n');

  } catch (error) {
    console.error('❌ Error testing Twilio:', error.message);
    if (error.code === 20003) {
      console.error('   This usually means your Account SID or Auth Token is incorrect');
    }
    process.exit(1);
  }
}

testTwilio();

