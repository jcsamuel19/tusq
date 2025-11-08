export function getWelcomeMessage(firstName: string): string {
  return `Welcome to the party, ${firstName}! To find your ultimate side quest, I need a few details. First, what's your primary location? (City or Zip Code)`;
}

export const MESSAGES = {
  error: "I'm not really sure what you're saying. Could you try again?",

  preferencesUpdate: `I can help you update your preferences! Let's start with the first question again.`,

  pauseMessage: `Hey! We've sent a few event digests, but it seems like we're not finding the right stuff for you. We'll pause your digests for now.

If you ever want to restart your personalized free event finder, just reply 'START'.`,

  surveyComplete: `Perfect, you're all set! Keep an eye on your texts—we'll send your first personalized quest digest.`,

  restartConfirmation: `Great! Let's update your preferences to make sure we find the perfect events for you.`,
};

export function getQuestionMessage(questionText: string): string {
  return questionText;
}

export function getConfirmationMessage(questionNumber: number, totalQuestions: number): string {
  // Custom confirmation messages for each question
  switch (questionNumber) {
    case 1:
      return 'Got it.';
    case 2:
      return 'Nice.';
    case 3:
      return 'Noted.';
    case 4:
      return ''; // Last question doesn't need confirmation before the question
    default:
      return '';
  }
}
