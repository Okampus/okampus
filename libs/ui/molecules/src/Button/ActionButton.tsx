import { MenuButton } from './MenuList';
import { ActionType } from '@okampus/shared/types';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

import { Link } from 'react-router-dom';
import type { ActionButtonProps } from '@okampus/shared/types';

export const buttonMotion = (disabled: boolean) => ({
  whileTap: { scale: disabled ? 1 : 0.98 },
  whileHover: { scale: disabled ? 1 : 1.02 },
  disabled,
});

function getActionClass(active: boolean, variant?: ActionType): string {
  switch (variant) {
    case ActionType.Action: {
      return active ? 'text-0 border-color-5 border' : 'bg-opposite text-opposite';
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
      return 'bg-[var(--info)] text-white';
    }
    default: {
      return 'text-1 bg-3';
      // return 'text-white dark:bg-[#333] bg-[#181818] hover:bg-[#444] dark:hover:bg-[#666]';
    }
  }
}

export function ActionButton({ action, className, children, iconPosition, inheritLabel = true }: ActionButtonProps) {
  const active = !!action.active;
  const disabled = !!action.disabled;
  const hasIcon = !!action.iconOrSwitch;

  const buttonLabel = inheritLabel && action.label ? action.label : children;
  const onlyIcon = hasIcon && !buttonLabel;

  const currentIcon = typeof action.iconOrSwitch === 'function' ? action.iconOrSwitch(active) : action.iconOrSwitch;
  const trigger = currentIcon ? (
    <>
      {(iconPosition === 'left' || !iconPosition) && (
        <div className="h-full aspect-square">
          {typeof action.iconOrSwitch === 'function' ? action.iconOrSwitch(active) : action.iconOrSwitch}
        </div>
      )}
      {buttonLabel}
      {iconPosition === 'right' && (
        <div className="h-full aspect-square">
          {typeof action.iconOrSwitch === 'function' ? action.iconOrSwitch(active) : action.iconOrSwitch}
        </div>
      )}
    </>
  ) : (
    buttonLabel
  );

  const actionClassName = getActionClass(active, action.type);
  const iconClassName = onlyIcon
    ? 'icon-button h-14'
    : ['button', hasIcon && (iconPosition === 'left' ? '!pl-6' : '!pr-6')];
  const buttonClassName = clsx(className, actionClassName, iconClassName, disabled && 'disabled pointer-events-none');

  const linkOrActionOrMenu = action.linkOrActionOrMenu;
  return typeof linkOrActionOrMenu === 'string' ? (
    <Link to={linkOrActionOrMenu} className={clsx(buttonClassName, disabled && 'pointer-events-none')}>
      {trigger}
    </Link>
  ) : typeof linkOrActionOrMenu === 'function' ? (
    <motion.button {...buttonMotion(disabled)} className={buttonClassName} onClick={linkOrActionOrMenu}>
      {trigger}
    </motion.button>
  ) : (
    <MenuButton placement="right-start" placementOffset={-4} triggerOn="hover" menuProps={linkOrActionOrMenu}>
      {trigger}
    </MenuButton>
  );
}
