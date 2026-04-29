'use client';

import { useCallback, useRef, useState } from 'react';
import { getAllQuestions } from '@/lib/questions';
import {
  getNextLevel,
  getMaxLevel,
  pickQuestion,
  TOTAL_QUESTIONS,
} from '@/lib/quiz-engine';
import { getSavedLang, LANG_KEY } from '@/lib/lang';
import type { AnswerRecord, Lang, Level, Question, QuizState } from '@/types/quiz';

function buildInitialState(lang: Lang): QuizState {
  return {
    currentQuestion: null,
    questionIndex: 0,
    currentLevel: 'beginner',
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    answers: [],
    phase: 'welcome',
    lang,
  };
}

export function useQuiz() {
  // Lazy initializer reads localStorage only once on mount
  const [state, setState] = useState<QuizState>(() => buildInitialState(getSavedLang()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const poolRef = useRef<Record<Level, Question[]>>({
    beginner: [],
    intermediate: [],
    advanced: [],
  });
  const usedIdsRef = useRef<Record<Level, Set<string>>>({
    beginner: new Set(),
    intermediate: new Set(),
    advanced: new Set(),
  });

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await getAllQuestions();
      poolRef.current = {
        beginner: all.filter((q) => q.level === 'beginner'),
        intermediate: all.filter((q) => q.level === 'intermediate'),
        advanced: all.filter((q) => q.level === 'advanced'),
      };
    } catch {
      setError('load');
    } finally {
      setLoading(false);
    }
  }, []);

  const start = useCallback(
    async (lang: Lang) => {
      localStorage.setItem(LANG_KEY, lang);
      usedIdsRef.current = {
        beginner: new Set(),
        intermediate: new Set(),
        advanced: new Set(),
      };
      if (
        poolRef.current.beginner.length === 0 &&
        poolRef.current.intermediate.length === 0 &&
        poolRef.current.advanced.length === 0
      ) {
        await loadQuestions();
      }
      const first = pickQuestion(
        poolRef.current['beginner'],
        usedIdsRef.current['beginner']
      );
      if (!first) {
        setError('load');
        return;
      }
      usedIdsRef.current['beginner'].add(first.id);
      setState({
        currentQuestion: first,
        questionIndex: 0,
        currentLevel: 'beginner',
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        answers: [],
        phase: 'playing',
        lang,
      });
    },
    [loadQuestions]
  );

  const answer = useCallback((value: boolean | null) => {
    setState((s) => {
      if (!s.currentQuestion || s.phase !== 'playing') return s;
      const timedOut = value === null;
      const correct = !timedOut && value === s.currentQuestion.answer;
      const newConsecCorrect = correct ? s.consecutiveCorrect + 1 : 0;
      const newConsecWrong = !correct ? s.consecutiveWrong + 1 : 0;

      const record: AnswerRecord = {
        questionId: s.currentQuestion.id,
        level: s.currentQuestion.level,
        correct,
        timedOut,
      };

      return {
        ...s,
        consecutiveCorrect: newConsecCorrect,
        consecutiveWrong: newConsecWrong,
        answers: [...s.answers, record],
        phase: 'feedback',
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState((s) => {
      if (s.phase !== 'feedback') return s;

      const nextIndex = s.questionIndex + 1;
      if (nextIndex >= TOTAL_QUESTIONS) {
        return { ...s, phase: 'result' };
      }

      const nextLevel = getNextLevel(
        s.currentLevel,
        s.consecutiveCorrect,
        s.consecutiveWrong
      );
      const nextQ = pickQuestion(
        poolRef.current[nextLevel],
        usedIdsRef.current[nextLevel]
      );

      if (!nextQ) {
        const fallbackLevels: Level[] = ['beginner', 'intermediate', 'advanced'];
        for (const lvl of fallbackLevels) {
          const fallback = pickQuestion(
            poolRef.current[lvl],
            usedIdsRef.current[lvl]
          );
          if (fallback) {
            usedIdsRef.current[lvl].add(fallback.id);
            return {
              ...s,
              currentQuestion: fallback,
              questionIndex: nextIndex,
              currentLevel: lvl,
              phase: 'playing',
            };
          }
        }
        return { ...s, phase: 'result' };
      }

      usedIdsRef.current[nextLevel].add(nextQ.id);
      return {
        ...s,
        currentQuestion: nextQ,
        questionIndex: nextIndex,
        currentLevel: nextLevel,
        consecutiveCorrect: nextLevel !== s.currentLevel ? 0 : s.consecutiveCorrect,
        consecutiveWrong: nextLevel !== s.currentLevel ? 0 : s.consecutiveWrong,
        phase: 'playing',
      };
    });
  }, []);

  const restart = useCallback(() => {
    usedIdsRef.current = {
      beginner: new Set(),
      intermediate: new Set(),
      advanced: new Set(),
    };
    setState((s) => {
      const first = pickQuestion(
        poolRef.current['beginner'],
        usedIdsRef.current['beginner']
      );
      if (!first) return { ...buildInitialState(s.lang), phase: 'welcome' };
      usedIdsRef.current['beginner'].add(first.id);
      return {
        ...buildInitialState(s.lang),
        currentQuestion: first,
        phase: 'playing',
      };
    });
  }, []);

  const setLang = useCallback((lang: Lang) => {
    localStorage.setItem(LANG_KEY, lang);
    setState((s) => ({ ...s, lang }));
  }, []);

  const maxLevel = getMaxLevel(state.answers.map((a) => a.level));
  const score = state.answers.filter((a) => a.correct).length;

  return {
    state,
    loading,
    error,
    score,
    maxLevel,
    start,
    answer,
    nextQuestion,
    restart,
    setLang,
    loadQuestions,
  };
}
