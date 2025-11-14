export interface QuestionConfig {
  key: string;
  text: string;
  order: number;
}

export const SURVEY_QUESTIONS: QuestionConfig[] = [
  {
    key: 'location',
    text: "What city are you in?", // Text is in welcome message, but kept for reference
    order: 1,
  },
  {
    key: 'interests',
    text: "Hmmm what type of events are you looking for? (e.g., Music, Comedy, etc.)",
    order: 2,
  },
  {
    key: 'keywords',
    text: "Anything specific I should look for that this event would have? If not, just type 'nah'",
    order: 3,
  },
  {
    key: 'social_vibe',
    text: "Last one whats the environment look like? (e.g.Upscale, Casual)",
    order: 4,
  },
];

export function getQuestionByKey(key: string): QuestionConfig | undefined {
  return SURVEY_QUESTIONS.find((q) => q.key === key);
}

export function getQuestionByOrder(order: number): QuestionConfig | undefined {
  return SURVEY_QUESTIONS.find((q) => q.order === order);
}

export function getTotalQuestions(): number {
  return SURVEY_QUESTIONS.length;
}
