import { range } from '@okampus/shared/utils';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { DraggableArea } from 'react-advanced-cropper';

import type { MoveDirections } from 'react-advanced-cropper';

export type RotateComponentProps = {
  from: number;
  to: number;
  value: number;
  step?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  className?: string;
  barClassName?: string;
  highlightedBarClassName?: string;
  valueBarClassName?: string;
  zeroBarClassName?: string;
  count?: number;
  density?: number;
};

export type RotateComponentRef = { refresh: () => void };
export type Bar = { value: number; highlighted: boolean; zero: boolean; opacity: number; left: string };

const baseThickness = 2;
const zeroThickness = 3;

export default function CropperRotate({
  from,
  to,
  value,
  step = 2.5,
  onBlur,
  onChange,
  className,
  density = 10,
}: RotateComponentProps) {
  const barsRef = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState(false);

  const [items, setItems] = useState<Bar[]>([]);

  const recalculate = () => {
    if (barsRef.current) {
      const width = 100;
      const count = width / density;
      const values = range({ from, to, step });

      const radius = Math.abs(Math.ceil(count / 2) * step);

      setItems(
        values.map((barValue) => {
          const sign = Math.sign(barValue - value);

          let leftPosition;
          if (Math.abs(barValue - value) / step <= Math.ceil(count / 2)) {
            const multiplier = Math.sqrt(Math.pow(radius, 2) - Math.pow(value + sign * radius - barValue, 2)) / radius;
            leftPosition = width / 2 + sign * (width / 2) * Math.pow(multiplier, 2.5);
          } else {
            leftPosition = width / 2 + (sign * width) / 2;
          }

          let opacity = 0;
          if (count > 0 && Math.abs(barValue - value) / step <= Math.ceil(count / 2)) {
            opacity = Math.pow(Math.sqrt(Math.pow(radius, 2) - Math.pow(value - barValue, 2)) / radius, 4);
          }

          const highlighted =
            (value < 0 && barValue >= value && barValue <= 0) || (value > 0 && barValue <= value && barValue >= 0);
          const left = `calc(${leftPosition}% - ${baseThickness / 2}px)`;
          return { value: barValue, highlighted, zero: barValue === 0, left, opacity };
        })
      );
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(recalculate, [density, from, to, value, step]);

  const onMove = (directions: MoveDirections) => {
    if (barsRef.current) {
      const width = barsRef.current.clientWidth;
      const count = width / density;
      const shift = -(directions.left / barsRef.current.clientWidth) * count * step;
      if (onChange) {
        if (value + shift > to) {
          onChange(to - value);
        } else if (value + shift < from) {
          onChange(from - value);
        } else {
          onChange(shift);
        }
      }
    }
  };

  const onMoveEnd = () => {
    document.body.classList.remove('cursor-grabbing');
    setDragging(false);
    onBlur?.();
  };

  const onMoveStart = () => {
    document.body.classList.add('cursor-grabbing');
    setDragging(true);
  };

  const barsClassName = clsx('cursor-grab w-full flex min-w-0 relative h-6', dragging && 'cursor-grabbing');
  const valueBarClass = clsx(
    'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 bg-[var(--primary)] text-[var(--primary)] font-semibold h-6 rounded-sm'
  );

  return (
    <div className={clsx('cursor-grab w-full flex relative h-6', className)}>
      <DraggableArea
        onMoveStart={onMoveStart}
        onMove={onMove}
        onMoveEnd={onMoveEnd}
        useAnchor={false}
        className="w-full"
      >
        <div className={barsClassName} ref={barsRef}>
          {items.map(({ zero, highlighted, opacity, left, value }) => {
            const barStateClass = clsx(highlighted ? 'bg-[var(--primary)]' : 'bg-white', zero ? 'h-5' : 'h-4');
            const barClass = clsx('absolute top-1/2 shrink-0 transition-none', barStateClass);
            const width = opacity ? (zero ? zeroThickness : baseThickness) : 0;
            const style = { width, opacity, left, transform: 'translateY(-50%)' };

            return <div className={barClass} key={value} style={style} />;
          })}
          <div className={valueBarClass}>
            <div className="absolute text-inherit -translate-x-1/2 text-xs left-1/2 -top-5 select-none">
              {value.toFixed(1)}°
            </div>
          </div>
        </div>
      </DraggableArea>
    </div>
  );
}
