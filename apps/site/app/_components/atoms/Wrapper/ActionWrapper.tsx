'use client';

import MenuButton from '../../molecules/Button/MenuButton';

import clsx from 'clsx';
import Link from 'next/link';
import { toast } from 'sonner';

import type { ActionProps } from '@okampus/shared/types';

export type ActionWrapperProps = Omit<ActionProps, 'loading' | 'type' | 'active'> & {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function ActionWrapper(props: ActionWrapperProps) {
  const { action, disabled, children, className, onMouseEnter, onMouseLeave, style } = props;

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
        type="button"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={className}
        style={style}
        onClick={action}
        disabled={disabled}
      >
        {children}
      </button>
    );

  if (typeof action === 'object' && 'serverAction' in action) {
    const { serverAction, onAction, onActionFinish, data } = action;
    return (
      <form
        action={async (formData: FormData) => {
          onAction?.();
          await serverAction(formData).then((formState) => {
            if (formState.errors) {
              const allErrors = [];
              for (const [key, value] of Object.entries(formState.errors)) {
                const errorArray = typeof value === 'string' ? [value] : value;
                if (key === 'root') allErrors.push(...errorArray);
                else allErrors.push(...errorArray.map((error) => `${key}: ${error}`));
              }
              toast.error(allErrors.join('\n'));
            } else {
              onActionFinish?.(formState);
            }
          });
        }}
      >
        {data &&
          Object.entries(data).map(([name, value]) => (
            <input key={name} type="hidden" className="hidden" name={name} value={value} />
          ))}
        <button type="submit" className={className} style={style}>
          {children}
        </button>
      </form>
    );
  }

  if (typeof action === 'object') return <MenuButton {...action}>{children}</MenuButton>;

  return children;
}
