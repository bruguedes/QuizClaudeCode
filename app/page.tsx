'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { getSavedLang, LANG_KEY } from '@/lib/lang';
import type { Lang } from '@/types/quiz';

export default function Home() {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>(getSavedLang);
  const [starting, setStarting] = useState(false);

  const handleLangChange = (l: Lang) => {
    localStorage.setItem(LANG_KEY, l);
    setLangState(l);
  };

  const handleStart = () => {
    setStarting(true);
    router.push('/quiz');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <WelcomeScreen
        lang={lang}
        onLangChange={handleLangChange}
        onStart={handleStart}
        loading={starting}
      />
    </main>
  );
}
