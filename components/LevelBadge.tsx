import { memo } from 'react';
import { t } from '@/lib/i18n';
import type { Lang, Level } from '@/types/quiz';

const styles: Record<Level, string> = {
  beginner: 'bg-blue-100 text-blue-700 border-blue-200',
  intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  advanced: 'bg-red-100 text-red-700 border-red-200',
};

interface Props {
  level: Level;
  lang: Lang;
}

export const LevelBadge = memo(function LevelBadge({ level, lang }: Props) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[level]}`}
    >
      {t(`quiz.level.${level}`, lang)}
    </span>
  );
});
