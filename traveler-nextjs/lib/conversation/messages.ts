export const MESSAGES = {
  welcome: `Welcome to the Weekend Event Finder! To personalize your digests, I need to ask a few quick questions. 

What are your main interests? (e.g., music, art, sports, food)`,

  error: "I'm not really sure what you're saying. Could you try again?",

  preferencesUpdate: `I can help you update your preferences! Let's start with the first question again.

What are your main interests? (e.g., music, art, sports, food)`,

  pauseMessage: `Hey! We've sent a few event digests, but it seems like we're not finding the right stuff for you. We'll pause your digests for now.

If you ever want to restart your personalized free event finder, just reply 'START'.`,

  surveyComplete: `Thanks for completing the survey! We'll start sending you personalized event digests soon. 🎉`,

  restartConfirmation: `Great! Let's update your preferences to make sure we find the perfect events for you.`,
};

export function getQuestionMessage(questionText: string): string {
  return questionText;
}

export function getConfirmationMessage(questionNumber: number, totalQuestions: number): string {
  if (questionNumber < totalQuestions) {
    return 'Got it! Next question:';
  }
  return '';
}

