'use client';

import Popover from '../../atoms/Popover/Popover';
import PopoverContent from '../../atoms/Popover/PopoverContent';
import PopoverTrigger from '../../atoms/Popover/PopoverTrigger';

import { useCurrentBreakpoint } from '../../../_hooks/useCurrentBreakpoint';

import clsx from 'clsx';
import Link from 'next/link';

import { useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';

import type { MenuButtonProps } from '@okampus/shared/types';

const itemClass =
  'flex items-center justify-between gap-6 w-[calc(100%-1rem)] mx-[0.5rem] text-1 font-medium py-2 px-3 bg-2-hover rounded-md';
export default function MenuButton({ children, header, footer, actions, className }: MenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isMobile = useCurrentBreakpoint() === 'mobile';

  const actionsRender = (
    <ul className="flex flex-col gap-2">
      {actions.map(({ action, separator, icon, children }, idx) => {
        return (
          <li
            key={idx}
            className={clsx(
              idx === 0 && header && 'border-t border-[var(--border-1)]',
              (separator || (idx === actions.length - 1 && footer)) && 'border-b border-[var(--border-1)]',
            )}
          >
            {typeof action === 'string' || (typeof action === 'object' && 'href' in action) ? (
              <Link
                className={itemClass}
                href={typeof action === 'string' ? action : action.href}
                {...(typeof action === 'object' && action)}
              >
                <span className="pr-8">{children}</span>
                <div className="w-6 h-6">{icon}</div>
              </Link>
            ) : typeof action === 'function' ? (
              <button onClick={action} className={itemClass}>
                <span className="pr-8">{children}</span>
                <div className="w-6 h-6">{icon}</div>
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );

  if (isMobile)
    return (
      <>
        <button onClick={() => setIsOpen(true)}>{children}</button>
        <BottomSheet open={isOpen} onDismiss={() => setIsOpen(false)} footer={footer} header={header}>
          {actionsRender}
        </BottomSheet>
      </>
    );

  return (
    <Popover controlledOpen forcePlacement={true}>
      <PopoverTrigger className={clsx(className)}>{children}</PopoverTrigger>
      <PopoverContent>
        <div className={clsx('flex flex-col rounded-xl', className)}>
          {header}
          {actionsRender}
          {footer}
        </div>
      </PopoverContent>
    </Popover>
  );
}
