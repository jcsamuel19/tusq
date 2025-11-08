import type { ConversationState } from '@/types/conversation';
import {
  getQuestionByOrder,
  getTotalQuestions,
  SURVEY_QUESTIONS,
} from './questions';
import { MESSAGES } from './messages';
import { savePreference } from '../db/preferences';
import { updateConversationState, updateConversationActivity } from '../db/conversations';
import { markSurveyCompleted, markSurveyStarted } from '../db/users';
import { sendSMS } from '../twilio/messages';

const PREFERENCE_UPDATE_KEYWORDS = ['start', 'change preferences', 'update preferences', 'restart', 'change'];

export function isPreferenceUpdateRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase().trim();
  return PREFERENCE_UPDATE_KEYWORDS.some((keyword) =>
    lowerMessage.includes(keyword)
  );
}

export async function handleIncomingMessage(
  userId: string,
  conversationId: string,
  currentState: ConversationState,
  currentQuestionIndex: number,
  message: string,
  phoneNumber: string
): Promise<{ response: string; newState: ConversationState; newQuestionIndex: number }> {
  // Update conversation activity
  await updateConversationActivity(conversationId);

  // Check if user wants to update preferences
  if (isPreferenceUpdateRequest(message)) {
    if (currentState === 'completed') {
      // User wants to restart - send restart message and first question
      await updateConversationState(conversationId, 'question_1', 1);
      const firstQuestion = getQuestionByOrder(1);
      return {
        response: `${MESSAGES.restartConfirmation}\n\n${firstQuestion?.text || ''}`,
        newState: 'question_1',
        newQuestionIndex: 1,
      };
    }
    // Already in survey, just acknowledge
    const currentQuestion = getQuestionByOrder(currentQuestionIndex);
    return {
      response: currentQuestion?.text || MESSAGES.error,
      newState: currentState,
      newQuestionIndex: currentQuestionIndex,
    };
  }

  // Handle welcome state
  if (currentState === 'welcome') {
    // User responded to welcome - the welcome message already asked the first question
    // So this response is the answer to question 1
    await markSurveyStarted(userId);
    await savePreference(userId, SURVEY_QUESTIONS[0].key, message);
    await updateConversationState(conversationId, 'question_2', 2);
    
    const nextQuestion = getQuestionByOrder(2);
    return {
      response: nextQuestion?.text || MESSAGES.error,
      newState: 'question_2',
      newQuestionIndex: 2,
    };
  }

  // Handle question states
  if (currentState.startsWith('question_')) {
    const questionNum = currentQuestionIndex;
    const totalQuestions = getTotalQuestions();

    // Save the answer
    const currentQuestion = getQuestionByOrder(questionNum);
    if (currentQuestion) {
      await savePreference(userId, currentQuestion.key, message);
    }

    // Check if this is the last question
    if (questionNum >= totalQuestions) {
      // Survey complete
      await markSurveyCompleted(userId);
      await updateConversationState(conversationId, 'completed', questionNum);
      
      // Send completion message
      await sendSMS({
        to: phoneNumber,
        body: MESSAGES.surveyComplete,
      });

      return {
        response: MESSAGES.surveyComplete,
        newState: 'completed',
        newQuestionIndex: questionNum,
      };
    }

    // Move to next question
    const nextQuestionNum = questionNum + 1;
    const nextQuestion = getQuestionByOrder(nextQuestionNum);
    
    if (nextQuestion) {
      const nextState = `question_${nextQuestionNum}` as ConversationState;
      await updateConversationState(conversationId, nextState, nextQuestionNum);
      
      return {
        response: nextQuestion.text,
        newState: nextState,
        newQuestionIndex: nextQuestionNum,
      };
    }
  }

  // Completed state - user can restart or update preferences
  if (currentState === 'completed') {
    if (isPreferenceUpdateRequest(message)) {
      await updateConversationState(conversationId, 'question_1', 1);
      const firstQuestion = getQuestionByOrder(1);
      return {
        response: `${MESSAGES.restartConfirmation}\n\n${firstQuestion?.text || ''}`,
        newState: 'question_1',
        newQuestionIndex: 1,
      };
    }
    // User sent a message but survey is complete - just acknowledge
    return {
      response: `Thanks! If you want to update your preferences, just reply 'START'.`,
      newState: 'completed',
      newQuestionIndex: currentQuestionIndex,
    };
  }

  // Default: send error message
  return {
    response: MESSAGES.error,
    newState: currentState,
    newQuestionIndex: currentQuestionIndex,
  };
}

