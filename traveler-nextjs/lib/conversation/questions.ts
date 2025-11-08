export interface QuestionConfig {
  key: string;
  text: string;
  order: number;
}

export const SURVEY_QUESTIONS: QuestionConfig[] = [
  {
    key: 'interests',
    text: 'What are your main interests? (e.g., music, art, sports, food)',
    order: 1,
  },
  {
    key: 'location',
    text: 'What city or area are you located in?',
    order: 2,
  },
  {
    key: 'activity_type',
    text: 'What types of activities do you prefer? (e.g., outdoor, indoor, social, solo)',
    order: 3,
  },
  {
    key: 'time_preference',
    text: 'When do you typically have free time? (e.g., weekends, evenings, weekday afternoons)',
    order: 4,
  },
  {
    key: 'budget',
    text: 'What is your typical budget for weekend activities? (e.g., free, $10-20, $20-50)',
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

