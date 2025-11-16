export function getWelcomeMessage(firstName: string): string[] {
  return [
    `I heard you want a side quests ${firstName}??`,
    `I dont think your ready 😂`,
    `What city are you in? (e.g. city or zip)`
  ];
}

export const MESSAGES = {
  error: "I'm not really sure what you're saying. Could you try again?",

  invalidLocation: "Nah like what city are you in lol",

  preferencesUpdate: `Want a new event! Let's start with the first question again.`,

  pauseMessage: `Hey! We've sent a few event digests, but it seems like we're not finding the right stuff for you. We'll pause your digests for now.

If you ever want to restart your personalized free event finder, just reply 'START'`,

  surveyComplete: `Aight finding something rn, give me 6-7min, ill send you a text when I find something`,

  restartConfirmation: `Great! Let's update your preferences to make sure we find the perfect events for you.`,
};

export function getQuestionMessage(questionText: string): string {
  return questionText;
}
