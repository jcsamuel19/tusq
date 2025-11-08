/**
 * Test script to check if your phone number is verified in Twilio
 * Run with: node test-verified-number.js YOUR_PHONE_NUMBER
 */

require('dotenv').config({ path: '.env.local' });

const twilio = require('twilio');

async function checkVerifiedNumber() {
  const phoneNumber = process.argv[2];

  if (!phoneNumber) {
    console.error('❌ Please provide a phone number to check');
    console.log('Usage: node test-verified-number.js +15551234567');
    process.exit(1);
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.error('❌ Missing Twilio credentials in .env.local');
    process.exit(1);
  }

  console.log('🔍 Checking verified numbers in your Twilio account...\n');

  try {
    const client = twilio(accountSid, authToken);

    // Get all verified numbers
    const verifiedNumbers = await client.outgoingCallerIds.list();
    
    console.log(`📋 Found ${verifiedNumbers.length} verified number(s):\n`);
    
    if (verifiedNumbers.length === 0) {
      console.log('❌ No verified numbers found!');
      console.log('\n📝 To verify your number:');
      console.log('   1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
      console.log('   2. Click "Add a new number"');
      console.log('   3. Enter your phone number and verify it\n');
    } else {
      verifiedNumbers.forEach((number, index) => {
        console.log(`   ${index + 1}. ${number.phoneNumber}`);
        if (number.friendlyName) {
          console.log(`      Name: ${number.friendlyName}`);
        }
        console.log(`      Status: ${number.status}`);
        console.log('');
      });

      // Check if the provided number is verified
      const normalizedInput = phoneNumber.trim();
      const isVerified = verifiedNumbers.some(
        (num) => num.phoneNumber === normalizedInput || num.phoneNumber.replace(/\s/g, '') === normalizedInput.replace(/\s/g, '')
      );

      if (isVerified) {
        console.log(`✅ ${phoneNumber} is verified! You can send SMS to this number.\n`);
      } else {
        console.log(`❌ ${phoneNumber} is NOT verified.`);
        console.log('\n📝 To verify this number:');
        console.log('   1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
        console.log('   2. Click "Add a new number"');
        console.log('   3. Enter your phone number and verify it\n');
      }
    }

  } catch (error) {
    console.error('❌ Error checking verified numbers:', error.message);
    process.exit(1);
  }
}

checkVerifiedNumber();

