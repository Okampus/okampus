'use client';

import ActionWrapper from '../atoms/Wrapper/ActionWrapper';

import { CaretRight } from '@phosphor-icons/react';
import clsx from 'clsx';

import type { Action } from '@okampus/shared/types';

export type ChoiceProps = { action: Action; className?: string; children: React.ReactNode; prefix?: React.ReactNode };
export default function Choice({ action, className, children, prefix }: ChoiceProps) {
  return (
    <ActionWrapper className={clsx('py-5 flex items-center justify-between', className)} action={action}>
      <span className="flex gap-4 items-center">
        {prefix && <div className="shrink-0">{prefix}</div>}
        <div className="text-0 text-lg line-clamp-1">{children}</div>
      </span>
      <CaretRight className="w-7 h-7 text-2" />
    </ActionWrapper>
  );
}
