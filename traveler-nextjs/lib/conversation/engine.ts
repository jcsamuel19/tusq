import type { ConversationState } from '@/types/conversation';
import {
  getQuestionByOrder,
  getTotalQuestions,
  SURVEY_QUESTIONS,
} from './questions';
import { MESSAGES, getWelcomeMessage, getConfirmationMessage } from './messages';
import { savePreference } from '../db/preferences';
import { updateConversationState, updateConversationActivity } from '../db/conversations';
import { markSurveyCompleted, markSurveyStarted } from '../db/users';
// SMS sending is optional - only used if Twilio is configured
let sendSMS: ((options: { to: string; body: string }) => Promise<{ success: boolean; messageSid?: string; error?: string }>) | null = null;

try {
  const twilioMessages = require('../twilio/messages');
  sendSMS = twilioMessages.sendSMS;
} catch (error) {
  // Twilio not configured, that's okay for in-app mode
  console.log('Twilio not configured - using in-app messaging mode');
}

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
  phoneNumber: string,
  firstName?: string
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
    // User responded to welcome - the welcome message already asked the first question (location)
    // So this response is the answer to question 1
    await markSurveyStarted(userId);
    await savePreference(userId, SURVEY_QUESTIONS[0].key, message);
    await updateConversationState(conversationId, 'question_2', 2);
    
    const nextQuestion = getQuestionByOrder(2);
    const confirmation = getConfirmationMessage(1, getTotalQuestions());
    return {
      response: confirmation ? `${confirmation} ${nextQuestion?.text || ''}` : (nextQuestion?.text || MESSAGES.error),
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
      // Normalize event_type answers (A, B, C)
      let answer = message.trim();
      if (currentQuestion.key === 'event_type') {
        const normalized = answer.toUpperCase();
        if (normalized === 'A' || normalized.includes('IN-PERSON')) {
          answer = 'In-person events';
        } else if (normalized === 'B' || normalized.includes('ONLINE')) {
          answer = 'Online events';
        } else if (normalized === 'C' || normalized.includes('BOTH')) {
          answer = 'Both';
        }
      }
      await savePreference(userId, currentQuestion.key, answer);
    }

    // Check if this is the last question
    if (questionNum >= totalQuestions) {
      // Survey complete
      await markSurveyCompleted(userId);
      await updateConversationState(conversationId, 'completed', questionNum);
      
      // Send completion message (only if SMS is configured)
      if (sendSMS) {
        await sendSMS({
          to: phoneNumber,
          body: MESSAGES.surveyComplete,
        });
      }

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
      
      // Add confirmation message for previous answers
      const confirmation = getConfirmationMessage(questionNum, totalQuestions);
      
      // For question 5 (social_vibe), add "Last question: " prefix
      let responseText = nextQuestion.text;
      if (nextQuestionNum === 5) {
        responseText = `Last question: ${responseText}`;
      }
      
      return {
        response: confirmation ? `${confirmation} ${responseText}` : responseText,
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

