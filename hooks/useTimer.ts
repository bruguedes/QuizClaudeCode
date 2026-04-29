'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TIMER_SECONDS } from '@/lib/quiz-engine';

export function useTimer(onTimeout: () => void) {
  const [remaining, setRemaining] = useState(TIMER_SECONDS);
  const callbackRef = useRef(onTimeout);

  useLayoutEffect(() => {
    callbackRef.current = onTimeout;
  });

  useEffect(() => {
    if (remaining <= 0) {
      callbackRef.current();
      return;
    }
    const id = setTimeout(
      () => setRemaining((r) => Math.max(0, r - 1)),
      1000
    );
    return () => clearTimeout(id);
  }, [remaining]);

  return {
    remaining,
    percent: (remaining / TIMER_SECONDS) * 100,
  };
}
