'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  percent: number;
}

export const TimerBar = memo(function TimerBar({ percent }: Props) {
  const isLow = percent <= 33;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
    >
      <motion.div
        className={`h-full rounded-full transition-colors duration-500 ${
          isLow ? 'bg-red-500' : 'bg-[#D97757]'
        }`}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.9, ease: 'linear' }}
      />
    </div>
  );
});
