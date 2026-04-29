'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useQuiz } from '@/hooks/useQuiz';
import { QuizPlay } from '@/components/QuizPlay';
import { AnswerFeedback } from '@/components/AnswerFeedback';
import { ResultScreen } from '@/components/ResultScreen';
import { getSavedLang } from '@/lib/lang';
import { t } from '@/lib/i18n';

export default function QuizPage() {
  const router = useRouter();
  const {
    state,
    loading,
    error,
    score,
    maxLevel,
    start,
    answer,
    nextQuestion,
    restart,
  } = useQuiz();

  useEffect(() => {
    start(getSavedLang());
  }, [start]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center flex flex-col gap-4">
          <p className="text-red-600 font-medium">{t('error.load', state.lang)}</p>
          <button
            onClick={() => start(state.lang)}
            className="px-6 py-3 rounded-xl bg-[#D97757] text-white font-semibold hover:bg-[#c5674a] transition-colors"
          >
            {t('error.retry', state.lang)}
          </button>
        </div>
      </main>
    );
  }

  if (loading || !state.currentQuestion) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D97757] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (state.phase === 'result') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <ResultScreen
          score={score}
          answers={state.answers}
          maxLevel={maxLevel}
          lang={state.lang}
          onRetry={restart}
        />
      </main>
    );
  }

  const lastAnswer = state.answers[state.answers.length - 1];

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {/* key resets useTimer on each new question (playing) or freezes it (feedback background) */}
      {state.phase === 'playing' && (
        <QuizPlay
          key={state.currentQuestion.id}
          question={state.currentQuestion}
          questionIndex={state.questionIndex}
          currentLevel={state.currentLevel}
          lang={state.lang}
          onAnswer={answer}
          onTimeout={() => answer(null)}
        />
      )}

      {state.phase === 'feedback' && lastAnswer && (
        <QuizPlay
          key={`feedback-${state.currentQuestion.id}`}
          question={state.currentQuestion}
          questionIndex={state.questionIndex}
          currentLevel={state.currentLevel}
          lang={state.lang}
          onAnswer={() => {}}
          onTimeout={() => {}}
        />
      )}

      <AnimatePresence>
        {state.phase === 'feedback' && lastAnswer && (
          <AnswerFeedback
            key={state.currentQuestion.id}
            question={state.currentQuestion}
            record={lastAnswer}
            lang={state.lang}
            onNext={nextQuestion}
          />
        )}
      </AnimatePresence>

      <button
        onClick={() => router.push('/')}
        aria-label="Back to home"
        className="fixed top-4 left-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← Home
      </button>
    </main>
  );
}
