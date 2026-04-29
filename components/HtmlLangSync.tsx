'use client';

import { useEffect } from 'react';
import { getSavedLang } from '@/lib/lang';

export function HtmlLangSync() {
  useEffect(() => {
    document.documentElement.lang = getSavedLang();
  }, []);
  return null;
}
