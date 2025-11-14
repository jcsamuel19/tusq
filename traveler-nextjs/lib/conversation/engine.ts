import type { ConversationState } from '@/types/conversation';
import {
  getQuestionByOrder,
  getTotalQuestions,
  SURVEY_QUESTIONS,
} from './questions';
import { MESSAGES, getWelcomeMessage } from './messages';
import { savePreference } from '../db/preferences';
import { updateConversationState, updateConversationActivity } from '../db/conversations';
import { markSurveyCompleted, markSurveyStarted } from '../db/users';
import { isValidLocation } from '../utils/locationValidation';
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
      // User wants to restart - go back to welcome state
      await updateConversationState(conversationId, 'welcome', 0);
      // Return just the restart confirmation - welcome messages will be sent separately
      return {
        response: MESSAGES.restartConfirmation,
        newState: 'welcome',
        newQuestionIndex: 0,
      };
    }
    // Already in survey, just acknowledge with current question
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
    // Validate location input
    const trimmedMessage = message.trim();
    
    if (!isValidLocation(trimmedMessage)) {
      // Invalid location - stay in welcome state and show error
      return {
        response: MESSAGES.invalidLocation,
        newState: 'welcome',
        newQuestionIndex: 0,
      };
    }
    
    // Valid location - save and proceed to question 2 (interests)
    await markSurveyStarted(userId);
    await savePreference(userId, SURVEY_QUESTIONS[0].key, trimmedMessage);
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
      const answer = message.trim();
      await savePreference(userId, currentQuestion.key, answer);
    }

    // Check if this is the last question (now question 4, social_vibe)
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
      
      // No confirmation messages in new flow - just show next question
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
      // Restart survey - go back to welcome state
      await updateConversationState(conversationId, 'welcome', 0);
      // Return just the restart confirmation - welcome messages will be sent separately
      return {
        response: MESSAGES.restartConfirmation,
        newState: 'welcome',
        newQuestionIndex: 0,
      };
    }
    // User sent a message but survey is complete - just acknowledge
    return {
      response: `I'm still finding events give me a sec... Update your preferences, reply 'START'.`,
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

