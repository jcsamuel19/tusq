import { NextRequest, NextResponse } from 'next/server';
import { getUserByPhone, getUserById, updateUserActivity } from '@/lib/db/users';
import {
  getConversationByUserId,
  createConversation,
} from '@/lib/db/conversations';
import { handleIncomingMessage } from '@/lib/conversation/engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, phoneNumber, message } = body;

    if (!userId || !phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, phoneNumber, message' },
        { status: 400 }
      );
    }

    // Get user
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user activity
    await updateUserActivity(userId);

    // Get or create conversation
    let conversation = await getConversationByUserId(userId);
    if (!conversation) {
      // First message - create conversation
      conversation = await createConversation(userId, 'welcome');
      if (!conversation) {
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        );
      }

      // Handle initialization message
      if (message === '__INIT__') {
        return NextResponse.json({
          response: '',
          completed: false,
          state: 'welcome',
        });
      }
    }

    // Handle initialization message for existing conversation
    if (message === '__INIT__') {
      return NextResponse.json({
        response: '',
        completed: conversation.conversation_state === 'completed',
        state: conversation.conversation_state,
      });
    }

    // Handle incoming message
    const result = await handleIncomingMessage(
      user.id,
      conversation.id,
      conversation.conversation_state,
      conversation.current_question_index,
      message.trim(),
      phoneNumber
    );

    return NextResponse.json({
      response: result.response,
      completed: result.newState === 'completed',
      state: result.newState,
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

