import { NextRequest, NextResponse } from 'next/server';
import { getUserByPhone, createUser } from '@/lib/db/users';
import { createConversation } from '@/lib/db/conversations';
import { sendSMS } from '@/lib/twilio/messages';
import { MESSAGES } from '@/lib/conversation/messages';
import { toE164US } from '@/lib/utils/phoneValidation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Convert to E.164 format
    const e164Phone = toE164US(phone);
    if (!e164Phone) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await getUserByPhone(e164Phone);
    
    if (user) {
      // User already exists - check if they have an active conversation
      return NextResponse.json({
        success: true,
        message: 'User already exists',
        userId: user.id,
      });
    }

    // Create new user
    user = await createUser(e164Phone);
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create conversation
    const conversation = await createConversation(user.id, 'welcome');
    if (!conversation) {
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      );
    }

    // Send welcome SMS
    console.log(`📤 Attempting to send welcome SMS to: ${e164Phone}`);
    const smsResult = await sendSMS({
      to: e164Phone,
      body: MESSAGES.welcome,
    });

    if (!smsResult.success) {
      console.error('❌ Failed to send welcome SMS:', smsResult.error);
      // Still return success since user was created
    } else {
      console.log(`✅ Welcome SMS sent successfully! Message SID: ${smsResult.messageSid}`);
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error('Error in signup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

