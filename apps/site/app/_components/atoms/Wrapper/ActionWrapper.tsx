'use client';

import MenuButton from '../../molecules/Button/MenuButton';

import Link from 'next/link';
import clsx from 'clsx';

import type { ActionProps } from '@okampus/shared/types';

export type ActionWrapperProps = Omit<ActionProps, 'loading' | 'type' | 'active'> & {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function ActionWrapper(props: ActionWrapperProps) {
  const { action, disabled, children, className, onMouseEnter, onMouseLeave } = props;

  if (typeof action === 'string' || (typeof action === 'object' && 'href' in action)) {
    const { href, ...props } = typeof action === 'string' ? { href: action } : action;
    return (
      <Link
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={clsx(className, disabled && 'pointer-events-none')}
        href={href}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (typeof action === 'function')
    return (
      <button
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={className}
        onClick={action}
        disabled={disabled}
        type="button"
      >
        {children}
      </button>
    );

  if (typeof action === 'object' && 'serverAction' in action) {
    const { serverAction, data } = action;
    return (
      <form action={serverAction}>
        {data &&
          Object.entries(data).map(([name, value]) => (
            <input key={name} type="hidden" className="hidden" name={name} value={value} />
          ))}
        <button className={className} type="submit">
          {children}
        </button>
      </form>
    );
  }

  if (typeof action === 'object') return <MenuButton {...action}>{children}</MenuButton>;

  return children;
}
