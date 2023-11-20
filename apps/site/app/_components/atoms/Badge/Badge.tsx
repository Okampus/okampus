import ActionWrapper from '../Wrapper/ActionWrapper';

import { ActionType } from '@okampus/shared/enums';

import { CircleNotch } from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';

import type { ActionProps } from '@okampus/shared/types';

export type BadgeProps = ActionProps & { count?: number; className?: string };

export default function Badge({ children, action, active, count, className, disabled, loading, type }: BadgeProps) {
  const wrapperClassName = clsx(
    'px-4 h-9 w-fit flex items-center gap-2 rounded-full shrink-0 font-medium',
    active
      ? 'text-0 bg-[var(--active-primary)] border-2 border-[var(--primary)]'
      : 'text-1 border border-[var(--border-1)]',
    type === ActionType.Info && '!border-[var(--info)] !text-[var(--info)] border-2',
    disabled && 'opacity-50 pointer-events-none',
    className,
  );

  if (loading) {
    return (
      <button className={wrapperClassName} disabled={true}>
        <CircleNotch className="animate-spin" />
      </button>
    );
  }

  return (
    <ActionWrapper action={action} disabled={disabled} className={wrapperClassName}>
      <span>{children}</span>
      {count ? <span className="text-sm text-2 font-normal pt-px">{count}</span> : null}
    </ActionWrapper>
  );
}
