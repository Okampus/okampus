'use client';

import MenuList from './MenuList';
import Popover from '../../atoms/Popup/Popover/Popover';
import PopoverContent from '../../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../../atoms/Popup/Popover/PopoverTrigger';

import { ActionType } from '@okampus/shared/types';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import Link from 'next/link';

import type { ActionButtonProps } from '@okampus/shared/types';

export const buttonMotion = (disabled: boolean) => ({
  whileTap: { scale: disabled ? 1 : 0.98 },
  whileHover: { scale: disabled ? 1 : 1.02 },
  disabled,
});

function getActionClass(active: boolean, variant?: ActionType): string {
  switch (variant) {
    case ActionType.Action: {
      return active ? 'text-0 border-[var(--border-1)] border' : 'bg-opposite text-opposite';
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
      return 'text-1 bg-3';
    }
    default: {
      return 'hover:underline text-1 border-2 border-[var(--border-2)]';
    }
  }
}

export default function ActionButton({
  action,
  className,
  children,
  iconPosition,
  inheritLabel = true,
  small,
}: ActionButtonProps) {
  const active = !!action.active;
  const disabled = !!action.disabled;
  const hasIcon = !!action.iconOrSwitch;

  const buttonLabel = inheritLabel && action.label ? action.label : children;
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

  const actionClassName = getActionClass(active, action.type);
  const iconClassName = onlyIcon
    ? small
      ? 'icon-button !h-10 !w-10'
      : 'icon-button'
    : ['button', small && '!h-10', hasIcon && (iconPosition === 'left' ? '!pl-6' : '!pr-6')];
  const buttonClassName = clsx(className, actionClassName, iconClassName, disabled && 'disabled pointer-events-none');

  const linkOrActionOrMenu = action.linkOrActionOrMenu;
  return typeof linkOrActionOrMenu === 'string' ? (
    <Link href={linkOrActionOrMenu} className={clsx(buttonClassName, disabled && 'pointer-events-none')}>
      {trigger}
    </Link>
  ) : typeof linkOrActionOrMenu === 'function' ? (
    <motion.button {...buttonMotion(disabled)} className={buttonClassName} onClick={linkOrActionOrMenu}>
      {trigger}
    </motion.button>
  ) : (
    <Popover triggerOn="hover" forcePlacement={true} placement="right-start" placementOffset={-4}>
      <PopoverTrigger className="w-full">{trigger}</PopoverTrigger>

      <PopoverContent>
        <MenuList {...linkOrActionOrMenu} />
      </PopoverContent>
    </Popover>
  );
}
