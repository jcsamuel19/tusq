# In-App Messaging Feature

## Overview

This feature provides an in-app chat interface that simulates the SMS conversation flow, allowing you to test the survey without needing Twilio SMS setup or A2P 10DLC registration.

## How It Works

1. **User signs up** with their phone number on the landing page
2. **Chat window opens** automatically after signup
3. **Conversation flows** exactly like SMS - same questions, same logic
4. **Data is saved** to Supabase database (users, conversations, preferences)
5. **No SMS costs** - perfect for testing and development

## Features

- ✅ Full conversation flow (5 survey questions)
- ✅ Same logic as SMS version
- ✅ Data saved to database
- ✅ Preference updates ("START" command)
- ✅ Error handling
- ✅ Loading states
- ✅ Auto-scrolling messages
- ✅ Responsive chat interface

## Usage

1. Start your dev server: `npm run dev`
2. Go to http://localhost:3000
3. Click "Get Started"
4. Enter a phone number (any format - it's just for display)
5. Check age confirmation
6. Click "Continue"
7. Chat window opens automatically
8. Answer the 5 survey questions
9. Complete the survey!

## API Endpoints

### `/api/conversation/message`
Handles in-app messages (same logic as SMS webhook)

**Request:**
```json
{
  "userId": "user-uuid",
  "phoneNumber": "+15551234567",
  "message": "user response"
}
```

**Response:**
```json
{
  "response": "next question or response",
  "completed": false,
  "state": "question_2"
}
```

## Switching Between Modes

The system automatically detects if Twilio is configured:

- **Twilio configured**: Sends SMS via Twilio
- **Twilio not configured**: Uses in-app messaging mode

No code changes needed - it works seamlessly!

## Branch Information

This feature is on the `feature/in-app-messaging` branch. The main branch still has the full Twilio SMS implementation.

## Future Enhancement

When ready to use SMS:
1. Switch back to `main` branch
2. Set up Twilio A2P 10DLC registration
3. Configure Twilio credentials
4. System will automatically use SMS instead of in-app chat

