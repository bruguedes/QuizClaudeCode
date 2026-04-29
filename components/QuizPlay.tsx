'use client';

import { useTimer } from '@/hooks/useTimer';
import type { Lang, Level, Question } from '@/types/quiz';
import { QuizCard } from './QuizCard';

interface Props {
  question: Question;
  questionIndex: number;
  currentLevel: Level;
  lang: Lang;
  onAnswer: (value: boolean) => void;
  onTimeout: () => void;
}

export function QuizPlay({
  question,
  questionIndex,
  currentLevel,
  lang,
  onAnswer,
  onTimeout,
}: Props) {
  const { remaining, percent } = useTimer(onTimeout);

  return (
    <QuizCard
      question={question}
      questionIndex={questionIndex}
      currentLevel={currentLevel}
      lang={lang}
      timerPercent={percent}
      timerRemaining={remaining}
      disabled={false}
      onAnswer={onAnswer}
    />
  );
}
