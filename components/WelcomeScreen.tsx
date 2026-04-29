'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { t } from '@/lib/i18n';
import type { Lang } from '@/types/quiz';

interface Props {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onStart: () => void;
  loading: boolean;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

export function WelcomeScreen({ lang, onLangChange, onStart, loading }: Props) {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8 text-center">
      {/* Logo */}
      <motion.div {...fadeUp(0)} className="rounded-2xl overflow-hidden shadow-lg">
        <Image
          src="/logo.png"
          alt="Claude Code Quizz"
          width={280}
          height={200}
          priority
          className="block"
        />
      </motion.div>

      {/* Subtitle */}
      <motion.p {...fadeUp(0.1)} className="text-gray-500 text-sm">
        {t('welcome.subtitle', lang)}
      </motion.p>

      {/* Language selector */}
      <motion.div {...fadeUp(0.2)} className="flex gap-3">
        {(['pt', 'en'] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => onLangChange(l)}
            aria-pressed={lang === l}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
              lang === l
                ? 'bg-[#D97757] text-white border-[#D97757]'
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#D97757]'
            }`}
          >
            {l === 'pt' ? '🇧🇷' : '🇺🇸'}
            {t(`welcome.lang.${l}`, lang)}
          </button>
        ))}
      </motion.div>

      {/* Start button */}
      <motion.button
        {...fadeUp(0.3)}
        onClick={onStart}
        disabled={loading}
        className="w-full max-w-xs py-4 rounded-xl bg-[#D97757] hover:bg-[#c5674a] text-white font-bold text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? '...' : t('welcome.start', lang)}
      </motion.button>
    </div>
  );
}
