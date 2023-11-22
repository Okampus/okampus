'use client';

import { getClassForActionType } from '../../../../utils/format/get-class-for-action-type';

import ActionWrapper from '../../atoms/Wrapper/ActionWrapper';
import { ActionType } from '@okampus/shared/enums';
import { CircleNotch } from '@phosphor-icons/react';

import clsx from 'clsx';

import { useState } from 'react';

import type { ButtonProps } from '@okampus/shared/types';

export default function Button({
  action,
  children,
  hoverContent,
  className,
  active,
  disabled,
  type,
  loading,
}: ButtonProps) {
  const [hovering, setHovering] = useState(false);

  const buttonClassName = clsx(
    'button',
    className,
    getClassForActionType(type, active),
    hovering && type === ActionType.Action && 'text-[var(--danger)]',
    disabled && 'disabled pointer-events-none',
  );

  if (loading) {
    return (
      <button type="button" className={buttonClassName} disabled={true}>
        <CircleNotch className="animate-spin" />
      </button>
    );
  }

  const inner = hovering ? hoverContent || children : children;

  if (!action)
    return (
      <button type="button" className={buttonClassName}>
        {inner}
      </button>
    );

  return (
    <ActionWrapper
      className={buttonClassName}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      action={action}
    >
      {hovering ? hoverContent || children : children}
    </ActionWrapper>
  );
}
