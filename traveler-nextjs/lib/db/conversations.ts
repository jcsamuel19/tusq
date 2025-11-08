import { supabaseAdmin } from '../supabase/client';
import type { Conversation, ConversationState } from '@/types/conversation';

export async function createConversation(
  userId: string,
  initialState: ConversationState = 'welcome'
): Promise<Conversation | null> {
  const { data, error } = await supabaseAdmin
    .from('conversations')
    .insert({
      user_id: userId,
      conversation_state: initialState,
      current_question_index: 0,
      last_message_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    return null;
  }

  return data;
}

export async function getConversationByUserId(
  userId: string
): Promise<Conversation | null> {
  const { data, error } = await supabaseAdmin
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching conversation:', error);
    return null;
  }

  return data;
}

export async function updateConversationState(
  conversationId: string,
  state: ConversationState,
  questionIndex: number
): Promise<void> {
  await supabaseAdmin
    .from('conversations')
    .update({
      conversation_state: state,
      current_question_index: questionIndex,
      last_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId);
}

export async function updateConversationActivity(
  conversationId: string
): Promise<void> {
  await supabaseAdmin
    .from('conversations')
    .update({
      last_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId);
}

