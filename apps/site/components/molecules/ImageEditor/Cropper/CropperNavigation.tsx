'use client';

import CropperRotate from './CropperRotate';

import clsx from 'clsx';
import { useLayoutEffect, useState } from 'react';
import { IconFlipHorizontal, IconFlipVertical, IconRotate2, IconRotateClockwise2 } from '@tabler/icons-react';

import type { ImmediatelyOptions, InteractionOptions, TransitionOptions } from 'react-advanced-cropper';

export interface PublicNavigationProps {
  className?: string;
  buttonClassName?: string;
  barClassName?: string;
}

type Options = TransitionOptions & InteractionOptions & ImmediatelyOptions;
interface NavigationProps extends PublicNavigationProps {
  value: number;
  onFlip?: (horizontal: boolean, vertical?: boolean, options?: Options) => void;
  onRotate?: (angle: number, options?: Options) => void;
  onRotateEnd?: () => void;
  className?: string;
  disabled?: unknown;
}

export type NavigationRef = { refresh: () => void };
export default function CropperNavigation({
  className,
  buttonClassName,
  disabled,
  value,
  onFlip,
  onRotate,
  onRotateEnd,
}: NavigationProps) {
  const [quarter, setQuarter] = useState(0);
  const [adjustmentAngle, setAdjustmentAngle] = useState(0);

  useLayoutEffect(() => {
    const absRotate = Math.abs(value);

    let rotate;
    if (absRotate % 90 > 45) {
      rotate = (absRotate - (absRotate % 90) + 90) / 90;
    } else if (absRotate % 90 < 45) {
      rotate = (absRotate - (absRotate % 90)) / 90;
    } else {
      rotate = quarter;
    }
    rotate = Math.sign(rotate) * rotate;

    if (rotate !== quarter) {
      setQuarter(rotate);
    }
    setAdjustmentAngle(Math.sign(value) * (Math.abs(value) - Math.abs(rotate) * 90));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const rotateTo = (angle: number) => {
    if (onRotate && !disabled) {
      onRotate(angle, { transitions: false, interaction: true, immediately: true });
    }
  };

  const rotateLeft = () => {
    if (onRotate && !disabled) {
      if (adjustmentAngle > 0) {
        onRotate(-adjustmentAngle);
      } else if (adjustmentAngle < 0) {
        onRotate(-90 - adjustmentAngle);
      } else {
        onRotate(-90);
      }
    }
  };

  const rotateRight = () => {
    if (onRotate && !disabled) {
      if (adjustmentAngle > 0) {
        onRotate(90 - adjustmentAngle);
      } else if (adjustmentAngle < 0) {
        onRotate(-adjustmentAngle);
      } else {
        onRotate(90);
      }
    }
  };

  const flipHorizontal = () => onFlip && !disabled && onFlip(true);
  const flipVertical = () => onFlip && !disabled && onFlip(false, true);

  const buttonClass = clsx(
    'cursor-pointer w-6 h-6 flex items-center shrink-0 transition-transform duration-500 mx-1 border-0 hover:scale-110 focus:scale-110',
    buttonClassName
  );

  return (
    <div className={clsx('flex items-center px-4 py-5 gap-4', className)}>
      <button type="button" className={buttonClass} onClick={flipHorizontal}>
        <IconFlipHorizontal />
      </button>
      <button type="button" className={buttonClass} onClick={rotateRight}>
        <IconRotateClockwise2 />
      </button>
      <CropperRotate
        className={clsx('w-full mx-2.5')}
        onChange={rotateTo}
        onBlur={onRotateEnd}
        from={-45}
        to={45}
        value={adjustmentAngle}
      />
      <button type="button" className={buttonClass} onClick={rotateLeft}>
        <IconRotate2 />
      </button>
      <button type="button" className={buttonClass} onClick={flipVertical}>
        <IconFlipVertical />
      </button>
    </div>
  );
}
