export type ConversationState =
  | 'welcome'
  | 'question_1'
  | 'question_2'
  | 'question_3'
  | 'question_4'
  | 'question_5'
  | 'completed'
  | 'updating_preferences';

export interface User {
  id: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  survey_completed_at: string | null;
  survey_started_at: string | null;
  last_activity_at: string;
  is_active: boolean;
  digest_paused: boolean;
}

export interface Conversation {
  id: string;
  user_id: string;
  conversation_state: ConversationState;
  current_question_index: number;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  question_key: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface SurveyQuestion {
  id: string;
  question_key: string;
  question_text: string;
  question_order: number;
  is_active: boolean;
}

