'use client';

import MenuList from './MenuList';
import Popover from '../../atoms/Popup/Popover/Popover';
import PopoverContent from '../../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../../atoms/Popup/Popover/PopoverTrigger';

import { ActionType } from '@okampus/shared/types';

import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';

import type { ActionButtonProps } from '@okampus/shared/types';

export function getActionClass(variant?: ActionType, active = false): string {
  switch (variant) {
    case ActionType.Action: {
      return active ? 'text-0 border-[var(--border-1)] border dark:!border-gray-400' : 'bg-opposite text-opposite';
    }
    case ActionType.Primary: {
      return 'bg-[var(--primary)] text-white';
    }
    case ActionType.Success: {
      return 'bg-[var(--success)] text-white';
    }
    case ActionType.Warning: {
      return 'bg-[var(--warning)] text-white';
    }
    case ActionType.Danger: {
      return 'bg-[var(--danger)] text-white';
    }
    case ActionType.Info: {
      return 'text-0 bg-3';
    }
    default: {
      return 'text-0 border';
    }
  }
}

export default function ActionButton({
  action,
  className,
  iconPosition,
  linkInNewTab = false,
  small,
}: ActionButtonProps) {
  const [hovering, setHovering] = useState(false);

  const active = !!action.active;
  const disabled = !!action.disabled;
  const hasIcon = !!action.iconOrSwitch;

  const buttonLabel = hovering && action.hoverLabel ? action.hoverLabel : action.label;
  const onlyIcon = hasIcon && !buttonLabel;

  const currentIcon = typeof action.iconOrSwitch === 'function' ? action.iconOrSwitch(active) : action.iconOrSwitch;
  const trigger = currentIcon ? (
    <>
      {(iconPosition === 'left' || !iconPosition) && (
        <div className="shrink-0">
          {typeof action.iconOrSwitch === 'function' ? action.iconOrSwitch(active) : action.iconOrSwitch}
        </div>
      )}
      {buttonLabel && <div className="line-clamp-1">{buttonLabel}</div>}
      {iconPosition === 'right' && (
        <div className="shrink-0">
          {typeof action.iconOrSwitch === 'function' ? action.iconOrSwitch(active) : action.iconOrSwitch}
        </div>
      )}
    </>
  ) : (
    buttonLabel
  );

  const actionClassName = getActionClass(action.type, active);
  const iconClassName = onlyIcon
    ? small
      ? 'icon-button !h-10 !w-10'
      : 'icon-button'
    : ['button', small && '!h-10', hasIcon && (iconPosition === 'left' ? '!pl-6' : '!pr-6')];
  const buttonClassName = clsx(
    className,
    actionClassName,
    iconClassName,
    hovering && action.type === ActionType.Action && 'text-[var(--danger)]',
    disabled && 'disabled pointer-events-none',
  );

  if (typeof action.linkOrActionOrMenu === 'string')
    return (
      <Link
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={clsx(buttonClassName, disabled && 'pointer-events-none')}
        href={action.linkOrActionOrMenu}
        target={linkInNewTab ? '_blank' : undefined}
      >
        {trigger}
      </Link>
    );

  if (typeof action.linkOrActionOrMenu === 'function')
    return (
      <button
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={buttonClassName}
        onClick={action.linkOrActionOrMenu}
        type="button"
      >
        {trigger}
      </button>
    );

  if (typeof action.linkOrActionOrMenu === 'object')
    return (
      <Popover triggerOn="hover" forcePlacement={true} placement="right-start" placementOffset={-4}>
        <PopoverTrigger
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="w-full"
        >
          {trigger}
        </PopoverTrigger>

        <PopoverContent>
          <MenuList {...action.linkOrActionOrMenu} />
        </PopoverContent>
      </Popover>
    );

  return trigger;
}
