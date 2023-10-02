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
    <div className={clsx(className, 'rounded-md flex bg-1 border border-color-1')}>
      {options.map(({ label, action }, idx) => {
        const inner = (
          <>
            {currentIndex === idx && <div className="absolute inset-y-1 inset-x-1 z-0 bg-3 rounded-md" />}
            {<div className="z-10">{label}</div>}
          </>
        );
        const className =
          'py-3 w-full h-full relative flex items-center justify-center text-center font-medium text-0 cursor-pointer';

        return typeof action === 'string' ? (
          <Link key={idx} className={className} href={action} onClick={() => setCurrentIndex(idx)}>
            {inner}
          </Link>
        ) : (
          <div key={idx} className={className} onClick={() => (setCurrentIndex(idx), action())}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
