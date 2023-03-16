import { ActionType } from '@okampus/shared/types';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

import type { ActionButtonProps } from '@okampus/shared/types';

function getActionClass(variant: ActionType): string {
  switch (variant) {
    case ActionType.Do: {
      return 'bg-[var(--primary)] text-white';
    }
    case ActionType.Simple: {
      return 'bg-0 text-0';
    }
    case ActionType.Switch: {
      return 'bg-transparent text-white border-white border-opacity-50 border';
    }
    case ActionType.Confirm: {
      return 'bg-[var(--success)] text-black';
    }
    case ActionType.Pending: {
      return 'bg-[var(--warning)] text-black';
    }
    case ActionType.Danger: {
      return 'bg-[var(--danger)] text-black';
    }
    default: {
      return 'dark:bg-white bg-black dark:text-black text-white';
    }
  }
}

export function ActionButton({
  children,
  active,
  className = 'line-clamp-1',
  small,
  disabled,
  onClick,
  icon,
  iconActive,
  variant = ActionType.Switch,
}: ActionButtonProps) {
  const onlyIcon = !children && icon;
  const currentIcon = active ? iconActive ?? icon : icon;
  return (
    <motion.button
      disabled={!!disabled}
      data-active={!!active}
      data-variant={variant}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      onClick={onClick}
      className={clsx(
        getActionClass(variant),
        onlyIcon ? (small ? 'button-icon-sm' : 'button-icon') : small ? 'button-sm' : 'button'
      )}
    >
      {currentIcon ? (
        onlyIcon ? (
          currentIcon
        ) : (
          <span className="flex gap-2 items-center">
            {currentIcon}
            <span className={className}>{children}</span>
          </span>
        )
      ) : (
        <span className={className}>{children}</span>
      )}
    </motion.button>
  );
}
