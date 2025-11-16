export interface QuestionConfig {
  key: string;
  text: string;
  order: number;
}

export const SURVEY_QUESTIONS: QuestionConfig[] = [
  {
    key: 'location',
    text: "What city are you in? (e.g. city or zip)", // Text is in welcome message, but kept for reference
    order: 1,
  },
  {
    key: 'interests',
    text: "Hmmm what type of events are you looking for? (Music, Comedy, etc.)",
    order: 2,
  },
  {
    key: 'activity_level',
    text: "Are we thinking less than 100 people or more?",
    order: 3,
  },
  {
    key: 'groupsize',
    text: "Who's rolling with you? Just solo missions, a date night, or a full squad (4+ people)?",
    order: 4,
  },
  {
    key: 'exclusion_keywords',
    text: "Any hard passes? Tell me what you ABSOLUTELY do NOT want to see, if not, just type 'nah'",
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
