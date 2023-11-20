import ActionWrapper from '../../atoms/Wrapper/ActionWrapper';
import { CaretRight } from '@phosphor-icons/react/dist/ssr';

import clsx from 'clsx';

import type { Action } from '@okampus/shared/types';

export type ChoiceListProps = {
  choices: { label: React.ReactNode; action: Action; prefix?: React.ReactNode }[];
  className?: string;
};

// const itemClass =
//   'flex items-center justify-between px-5 py-3 gap-6 rounded-2xl border border-[var(--border-2)] bg-[var(--bg-main)] hover:bg-[var(--bg-3)] min-h-[5.5rem]';

export default function ChoiceList({ choices, className }: ChoiceListProps) {
  return (
    <div className={clsx('flex flex-col', className)}>
      {choices.map(({ label, action, prefix }, idx) => {
        return (
          <>
            <ActionWrapper key={idx} className="py-5 flex items-center justify-center justify-between" action={action}>
              <span className="flex gap-4 items-center">
                <div className="shrink-0">{prefix}</div>
                <div className="text-0 text-lg line-clamp-1">{label}</div>
              </span>
              <CaretRight className="w-7 aspect-square text-[var(--primary)]" />
            </ActionWrapper>
            <hr className="border-[var(--border-1)]" />
          </>
        );
      })}
    </div>
  );
}
