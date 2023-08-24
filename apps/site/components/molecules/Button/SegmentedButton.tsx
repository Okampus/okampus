'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useId, useState } from 'react';

export type SegmentedButtonProps = {
  initialIndex: number;
  options: { label: React.ReactNode; action: (() => void) | string }[];
  className?: string;
};

export default function SegmentedButton({ initialIndex, options, className }: SegmentedButtonProps) {
  const id = useId();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  return (
    <div className={clsx(className, 'rounded-xl flex bg-2')}>
      {options.map(({ label, action }, idx) => {
        const inner = (
          <>
            {currentIndex === idx && (
              <motion.div layoutId={id} className="absolute inset-y-1 inset-x-1.5 z-0 bg-[var(--bg-0)] rounded-lg" />
            )}
            {typeof action === 'string' ? (
              <Link className="z-10" href={action}>
                {label}
              </Link>
            ) : (
              <div className="z-10" onClick={action}>
                {label}
              </div>
            )}
          </>
        );
        const className =
          'py-3 w-full h-full relative flex items-center justify-center text-center font-medium text-0 cursor-pointer';

        return typeof action === 'string' ? (
          <Link className={className} href={action} onClick={() => setCurrentIndex(idx)}>
            {inner}
          </Link>
        ) : (
          <div className={className} onClick={() => (setCurrentIndex(idx), action())}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
