import { memo } from 'react';
import { t } from '@/lib/i18n';
import { TOTAL_QUESTIONS } from '@/lib/quiz-engine';
import type { Lang, Level, Question } from '@/types/quiz';
import { LevelBadge } from './LevelBadge';
import { TimerBar } from './TimerBar';

interface Props {
  question: Question;
  questionIndex: number;
  currentLevel: Level;
  lang: Lang;
  timerPercent: number;
  timerRemaining: number;
  disabled: boolean;
  onAnswer: (value: boolean) => void;
}

export const QuizCard = memo(function QuizCard({
  question,
  questionIndex,
  currentLevel,
  lang,
  timerPercent,
  timerRemaining,
  disabled,
  onAnswer,
}: Props) {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <LevelBadge level={currentLevel} lang={lang} />
        <span className="text-sm text-gray-500 font-medium">
          {t('quiz.question', lang)} {questionIndex + 1} {t('quiz.of', lang)} {TOTAL_QUESTIONS}
        </span>
        <span
          className={`text-sm font-bold tabular-nums ${
            timerRemaining <= 5 ? 'text-red-500' : 'text-gray-600'
          }`}
        >
          {timerRemaining}s
        </span>
      </div>

      {/* Timer */}
      <TimerBar percent={timerPercent} />

      {/* Question card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <p className="text-lg md:text-xl font-medium text-gray-900 leading-relaxed text-center">
          {question.statement[lang]}
        </p>
      </div>

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          disabled={disabled}
          onClick={() => onAnswer(true)}
          aria-label={t('quiz.true', lang)}
          className="py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('quiz.true', lang)}
        </button>
        <button
          disabled={disabled}
          onClick={() => onAnswer(false)}
          aria-label={t('quiz.false', lang)}
          className="py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('quiz.false', lang)}
        </button>
      </div>
    </div>
  );
});
