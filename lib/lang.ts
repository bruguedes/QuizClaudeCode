import type { Lang } from '@/types/quiz';

export const LANG_KEY = 'quiz_lang';

export function getSavedLang(): Lang {
  if (typeof window === 'undefined') return 'pt';
  return (localStorage.getItem(LANG_KEY) as Lang) ?? 'pt';
}
