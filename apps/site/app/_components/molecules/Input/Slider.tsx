import { useRef, useState } from 'react';
import clsx from 'clsx';
import type { MouseEvent, TouchEvent } from 'react';

export type SliderProps = {
  className?: string;
  onChange?: (value: number) => void;
  value?: number;
};

export default function Slider({ className, onChange, value = 0 }: SliderProps) {
  const lineRef = useRef<HTMLDivElement | null>(null);
  const [focus, setFocus] = useState<boolean>(false);

  const onDrag = (e: MouseEvent | TouchEvent) => {
    if (focus) {
      const position = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const line = lineRef.current;

      if (line) {
        const { left, width } = line.getBoundingClientRect();

        if (onChange) {
          onChange(Math.min(1, Math.max(0, (position - left) / width)));
        }
      }

      if (e.preventDefault) {
        e.preventDefault();
      }
    }
  };

  const onStop = () => {
    setFocus(false);
  };

  const onStart = (e: MouseEvent | TouchEvent) => {
    setFocus(true);
    onDrag(e);
  };

  return (
    <div
      className={clsx('w-full h-3 flex items-center flex-col justify-center cursor-pointer', className)}
      ref={lineRef}
      onMouseDown={onStart}
      onTouchStart={onStart}
    >
      <div
        className="w-full h-1 bg-[var(--primary)] opacity-50 rounded-full flex items-center relative"
        onMouseMove={onDrag}
        onMouseUp={onStop}
        onTouchMove={onDrag}
        onTouchEnd={onStop}
      >
        <div className="h-full bg-[var(--primary)]" style={{ flexGrow: value }} />
        <div
          className={clsx(
            'flex items-center justify-center   w-6 h-6 rounded-full absolute transition-all duration-200',
            {
              'bg-[var(--primary)] opacity-20': focus,
              'bg-transparent': !focus,
            },
          )}
          style={{ left: `${value * 100}%` }}
        >
          <div className="w-3 h-3 rounded-full bg-[var(--primary)] hover:scale-120" />
        </div>
      </div>
    </div>
  );
}
