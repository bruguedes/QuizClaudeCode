import type { Level, Question } from '@/types/quiz';

export const LEVEL_UP_THRESHOLD = 3;
export const LEVEL_DOWN_THRESHOLD = 2;
export const TOTAL_QUESTIONS = 10;
export const TIMER_SECONDS = 15;

export function getNextLevel(
  current: Level,
  consecutiveCorrect: number,
  consecutiveWrong: number
): Level {
  if (consecutiveCorrect >= LEVEL_UP_THRESHOLD) {
    if (current === 'beginner') return 'intermediate';
    if (current === 'intermediate') return 'advanced';
    return 'advanced';
  }
  if (consecutiveWrong >= LEVEL_DOWN_THRESHOLD) {
    if (current === 'advanced') return 'intermediate';
    if (current === 'intermediate') return 'beginner';
    return 'beginner';
  }
  return current;
}

export function pickQuestion(
  pool: Question[],
  usedIds: Set<string>
): Question | null {
  const available = pool.filter((q) => !usedIds.has(q.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export function getMaxLevel(levels: Level[]): Level {
  if (levels.includes('advanced')) return 'advanced';
  if (levels.includes('intermediate')) return 'intermediate';
  return 'beginner';
}
