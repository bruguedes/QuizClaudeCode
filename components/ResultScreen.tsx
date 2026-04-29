'use client';

import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, RefreshCw } from 'lucide-react';
import { t } from '@/lib/i18n';
import { LevelBadge } from './LevelBadge';
import type { AnswerRecord, Lang, Level } from '@/types/quiz';

interface Props {
  score: number;
  answers: AnswerRecord[];
  maxLevel: Level;
  lang: Lang;
  onRetry: () => void;
}

function getMessage(score: number, lang: Lang): string {
  if (score <= 4) return t('result.msg.low', lang);
  if (score <= 7) return t('result.msg.mid', lang);
  return t('result.msg.high', lang);
}

const levels: Level[] = ['beginner', 'intermediate', 'advanced'];

export function ResultScreen({ score, answers, maxLevel, lang, onRetry }: Props) {
  const [copied, setCopied] = useState(false);
  const total = answers.length;
  const percent = Math.round((score / total) * 100);

  const byLevel = useMemo(
    () =>
      answers.reduce<Record<Level, { correct: number; total: number }>>(
        (acc, a) => {
          if (!acc[a.level]) acc[a.level] = { correct: 0, total: 0 };
          acc[a.level].total++;
          if (a.correct) acc[a.level].correct++;
          return acc;
        },
        {} as Record<Level, { correct: number; total: number }>
      ),
    [answers]
  );

  const handleShare = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const text = t('result.share.text', lang, { score: String(score), url });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (permission denied, not focused, or non-HTTPS)
    }
  }, [lang, score]);

  return (
    <motion.div
      className="w-full max-w-md mx-auto flex flex-col gap-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{t('result.title', lang)}</h2>
        <p className="text-5xl font-extrabold text-[#D97757] my-4">
          {score}/{total}
        </p>
        <p className="text-gray-500 text-sm mb-3">{percent}%</p>
        <p className="text-lg font-semibold text-gray-800">{getMessage(score, lang)}</p>
      </div>

      {/* Breakdown by level */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
        {levels.map((lvl) => {
          const data = byLevel[lvl];
          if (!data) return null;
          return (
            <div key={lvl} className="flex items-center justify-between">
              <LevelBadge level={lvl} lang={lang} />
              <span className="text-sm text-gray-600 font-medium">
                {data.correct}/{data.total}
              </span>
            </div>
          );
        })}
      </div>

      {/* Max level */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <span className="text-sm text-gray-600">{t('result.maxLevel', lang)}</span>
        <LevelBadge level={maxLevel} lang={lang} />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
        >
          <Share2 size={16} />
          {copied ? '✓' : t('result.share', lang)}
        </button>
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D97757] text-white font-semibold hover:bg-[#c5674a] transition-colors"
        >
          <RefreshCw size={16} />
          {t('result.retry', lang)}
        </button>
      </div>
    </motion.div>
  );
}
