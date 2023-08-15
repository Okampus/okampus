import { getActionClass } from './ActionButton';
import clsx from 'clsx';
import Link from 'next/link';
import type { ActionType } from '@okampus/shared/types';

export type ActionCTA = (() => void) | string;

export type CTAButtonProps = {
  className: string;
  type?: ActionType;
  children: React.ReactNode;
  action?: (() => void) | string;
};

export default function CTAButton({ className, type, children, action }: CTAButtonProps) {
  const ctaClassName = clsx(
    className,
    getActionClass(type),
    'button md-max:fixed md-max:bottom-[var(--h-bottombar)] md-max:inset-x-0 md-max:uppercase md-max:w-full md-max:!h-[var(--h-topbar)] md-max:!rounded-none',
  );

  return typeof action === 'function' || action === undefined ? (
    <button type="button" className={ctaClassName} onClick={action}>
      {children}
    </button>
  ) : (
    <Link className={className} href={action}>
      {children}
    </Link>
  );
}
