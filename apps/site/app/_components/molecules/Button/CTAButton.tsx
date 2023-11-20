import { getClassForActionType } from '../../../../utils/format/get-class-for-action-type';

import clsx from 'clsx';
import Link from 'next/link';

import type { ActionType } from '@okampus/shared/enums';

export type ActionCTA = (() => void) | string | undefined;

export type CTAButtonProps = {
  className?: string;
  type?: ActionType;
  children: React.ReactNode;
  action?: (() => void) | string;
};

export default function CTAButton({ className, type, children, action }: CTAButtonProps) {
  const ctaClassName = clsx(
    className,
    getClassForActionType(type),
    'button md-max:fixed md-max:bottom-[var(--h-bottombar)] md-max:inset-x-0 md-max:w-[calc(100%-2rem)] md-max:my-[1rem] md-max:mx-[1rem] md-max:!border-0',
  );

  return typeof action === 'function' || action === undefined ? (
    <button type="button" className={ctaClassName} onClick={action}>
      {children}
    </button>
  ) : (
    <Link className={ctaClassName} href={action}>
      {children}
    </Link>
  );
}
