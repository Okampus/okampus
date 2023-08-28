import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';

export type SegmentedButtonProps = {
  initialIndex: number;
  options: { label: React.ReactNode; action: (() => void) | string }[];
  className?: string;
};

export default function SegmentedButton({ initialIndex, options, className }: SegmentedButtonProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  return (
    <div className={clsx(className, 'rounded-xl flex bg-2')}>
      {options.map(({ label, action }, idx) => {
        const inner = (
          <>
            {currentIndex === idx && <div className="absolute inset-y-1 inset-x-1.5 z-0 bg-[var(--bg-0)] rounded-lg" />}
            {<div className="z-10">{label}</div>}
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
