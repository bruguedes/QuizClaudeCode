export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Lang = 'pt' | 'en';

export interface Question {
  id: string;
  level: Level;
  statement: Record<Lang, string>;
  answer: boolean;
  explanation: Record<Lang, string>;
  docLink?: string;
}

export interface AnswerRecord {
  questionId: string;
  level: Level;
  correct: boolean;
  timedOut: boolean;
}

export interface QuizState {
  currentQuestion: Question | null;
  questionIndex: number;
  currentLevel: Level;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  answers: AnswerRecord[];
  phase: 'welcome' | 'playing' | 'feedback' | 'result';
  lang: Lang;
}
