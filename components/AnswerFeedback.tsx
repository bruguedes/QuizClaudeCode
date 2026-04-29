'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { t } from '@/lib/i18n';
import type { AnswerRecord, Lang, Question } from '@/types/quiz';

interface Props {
  question: Question;
  record: AnswerRecord;
  lang: Lang;
  onNext: () => void;
}

export function AnswerFeedback({ question, record, lang, onNext }: Props) {
  const onNextRef = useRef(onNext);
  const dialogRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    onNextRef.current = onNext;
  });

  useEffect(() => {
    const id = setTimeout(() => onNextRef.current(), 3000);
    return () => clearTimeout(id);
  }, [question.id]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const label = record.timedOut
    ? t('feedback.timeout', lang)
    : record.correct
    ? t('feedback.correct', lang)
    : t('feedback.wrong', lang);

  const bgColor =
    record.correct && !record.timedOut
      ? 'bg-green-50 border-green-200'
      : 'bg-red-50 border-red-200';
  const textColor =
    record.correct && !record.timedOut ? 'text-green-700' : 'text-red-700';

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onNext}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        tabIndex={-1}
        className={`w-full max-w-md rounded-2xl border p-6 shadow-lg ${bgColor}`}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <p id="feedback-title" className={`text-xl font-bold mb-3 ${textColor}`}>{label}</p>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {question.explanation[lang]}
        </p>
        {question.docLink?.startsWith('https://') && (
          <a
            href={question.docLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4"
            onClick={(e) => e.stopPropagation()}
          >
            {t('feedback.doc', lang)}
            <ExternalLink size={14} />
          </a>
        )}
        <button
          onClick={onNext}
          className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-700 transition-colors"
        >
          {t('feedback.next', lang)}
        </button>
      </motion.div>
    </motion.div>
  );
}
