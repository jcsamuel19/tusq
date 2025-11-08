export interface QuestionConfig {
  key: string;
  text: string;
  order: number;
}

export const SURVEY_QUESTIONS: QuestionConfig[] = [
  {
    key: 'location',
    text: "What's your primary location? (City or Zip Code)",
    order: 1,
  },
  {
    key: 'event_type',
    text: 'Are you looking for (A) In-person events, (B) Online events, or (C) Both?',
    order: 2,
  },
  {
    key: 'interests',
    text: "What kind of events interest you most? (e.g., 'Live Music,' 'Art,' 'Tech,' 'Food,' 'Outdoors')",
    order: 3,
  },
  {
    key: 'keywords',
    text: "Any specific keywords we should look out for? (e.g., 'jazz,' 'hackathon,' 'yoga'—or just say 'no')",
    order: 4,
  },
  {
    key: 'social_vibe',
    text: "What's your preferred social vibe? (e.g., 'Lively and social,' 'Relaxed and chill,' 'Networking,' 'Family-friendly')",
    order: 5,
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
