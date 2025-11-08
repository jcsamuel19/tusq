import { supabaseAdmin } from '../supabase/client';
import type { User } from '@/types/conversation';

export async function createUser(
  phoneNumber: string,
  options?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    authUserId?: string;
  }
): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      phone_number: phoneNumber,
      first_name: options?.firstName || null,
      last_name: options?.lastName || null,
      email: options?.email || null,
      auth_user_id: options?.authUserId || null,
      last_activity_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return data;
}

export async function getUserByAuthId(authUserId: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching user by auth ID:', error);
    return null;
  }

  return data;
}


export async function getUserByPhone(phoneNumber: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('phone_number', phoneNumber)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

export async function updateUserActivity(userId: string): Promise<void> {
  await supabaseAdmin
    .from('users')
    .update({
      last_activity_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}

export async function markSurveyCompleted(userId: string): Promise<void> {
  await supabaseAdmin
    .from('users')
    .update({
      survey_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}

export async function markSurveyStarted(userId: string): Promise<void> {
  await supabaseAdmin
    .from('users')
    .update({
      survey_started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}

export async function pauseUserDigests(userId: string): Promise<void> {
  await supabaseAdmin
    .from('users')
    .update({
      digest_paused: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}

export async function resumeUserDigests(userId: string): Promise<void> {
  await supabaseAdmin
    .from('users')
    .update({
      digest_paused: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}

export async function getIncompleteSurveys(daysAgo: number): Promise<User[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .is('survey_completed_at', null)
    .not('survey_started_at', 'is', null)
    .lt('survey_started_at', cutoffDate.toISOString())
    .eq('digest_paused', false)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching incomplete surveys:', error);
    return [];
  }

  return data || [];
}

