import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { getUserByPhone, createUser, updateUserActivity } from '@/lib/db/users';
import {
  getConversationByUserId,
  createConversation,
} from '@/lib/db/conversations';
import { handleIncomingMessage } from '@/lib/conversation/engine';
import { sendSMS } from '@/lib/twilio/messages';
import { MESSAGES } from '@/lib/conversation/messages';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;

    if (!from || !body) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Normalize phone number to E.164 format
    // Twilio sends numbers in E.164 format, but we'll ensure it's correct
    let normalizedPhone = from.trim();
    if (!normalizedPhone.startsWith('+')) {
      // If it doesn't start with +, assume US number and add +1
      normalizedPhone = `+1${normalizedPhone.replace(/^1/, '')}`;
    }

    // Get or create user
    let user = await getUserByPhone(normalizedPhone);
    if (!user) {
      user = await createUser(normalizedPhone);
      if (!user) {
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }
    } else {
      await updateUserActivity(user.id);
    }

    // Get or create conversation
    let conversation = await getConversationByUserId(user.id);
    if (!conversation) {
      // First message - create conversation and send welcome
      conversation = await createConversation(user.id, 'welcome');
      if (!conversation) {
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        );
      }

      // Send welcome message
      await sendSMS({
        to: normalizedPhone,
        body: MESSAGES.welcome,
      });

      return NextResponse.json({ status: 'ok' });
    }

    // Handle incoming message
    const result = await handleIncomingMessage(
      user.id,
      conversation.id,
      conversation.conversation_state,
      conversation.current_question_index,
      body.trim(),
      normalizedPhone
    );

    // Send response
    await sendSMS({
      to: normalizedPhone,
      body: result.response,
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing SMS webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

