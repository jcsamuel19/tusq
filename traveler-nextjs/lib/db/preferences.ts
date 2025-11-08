import { supabaseAdmin } from '../supabase/client';
import type { UserPreference } from '@/types/conversation';

export async function savePreference(
  userId: string,
  questionKey: string,
  answer: string
): Promise<UserPreference | null> {
  // Check if preference already exists
  const { data: existing } = await supabaseAdmin
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('question_key', questionKey)
    .single();

  if (existing) {
    // Update existing preference
    const { data, error } = await supabaseAdmin
      .from('user_preferences')
      .update({
        answer,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating preference:', error);
      return null;
    }

    return data;
  } else {
    // Create new preference
    const { data, error } = await supabaseAdmin
      .from('user_preferences')
      .insert({
        user_id: userId,
        question_key: questionKey,
        answer,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating preference:', error);
      return null;
    }

    return data;
  }
}

export async function getUserPreferences(
  userId: string
): Promise<UserPreference[]> {
  const { data, error } = await supabaseAdmin
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching preferences:', error);
    return [];
  }

  return data || [];
}

export async function getPreferenceByKey(
  userId: string,
  questionKey: string
): Promise<UserPreference | null> {
  const { data, error } = await supabaseAdmin
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('question_key', questionKey)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching preference:', error);
    return null;
  }

  return data;
}

