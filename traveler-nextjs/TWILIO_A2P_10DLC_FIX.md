# Fixing Twilio A2P 10DLC Error (30034)

## The Problem

Error 30034 means your US phone number needs to be registered for **A2P 10DLC** (Application-to-Person 10-Digit Long Code). This is a requirement for sending SMS from US numbers to comply with carrier regulations.

## Solutions

### Option 1: Register for A2P 10DLC (Required for Production)

**Steps:**
1. Go to Twilio Console: https://console.twilio.com
2. Navigate to **Messaging** → **Regulatory Compliance** → **US A2P 10DLC**
3. Register your Brand:
   - Provide business information
   - May require business verification documents
   - This can take a few days to approve
4. Register a Campaign:
   - Link your phone number to the campaign
   - Describe your use case (event notifications, alerts, etc.)

**Time:** 1-3 days for approval
**Cost:** Usually free for small volumes, but there are fees for some campaigns

### Option 2: Use Trial Mode (Quick Testing Solution)

If you're still in Twilio trial mode:

1. **Verify your recipient phone number:**
   - Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
   - Add and verify your personal phone number
   - Trial numbers can ONLY send to verified numbers

2. **Test with verified numbers only:**
   - You can send SMS to any number you verify
   - This works immediately, no registration needed

### Option 3: Use a Non-US Number (Alternative)

If you want to test without A2P registration:

1. Purchase a phone number from a different country (e.g., Canada, UK)
2. Update your `.env.local`:
   ```env
   TWILIO_PHONE_NUMBER=+1CANADIAN_NUMBER
   ```
3. These numbers don't require A2P 10DLC registration

**Note:** Make sure your use case allows international numbers

## Recommended Action

**For Testing Now:**
- **Option 2** (Trial Mode + Verify Numbers) - Works immediately

**For Production:**
- **Option 1** (Register A2P 10DLC) - Required for US numbers

## Quick Fix for Testing

1. Verify your phone number in Twilio:
   - https://console.twilio.com/us1/develop/phone-numbers/manage/verified
   - Click "Add a new number"
   - Enter your phone number and verify it via SMS/call

2. Test again with your verified number

3. For production, register for A2P 10DLC when ready

