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
      return 'bg-transparent text-white border-white [data-active=true]:border-[var(--primary)] [data-active=true]:text-[var(--primary)] border';
    }
    case ActionType.Confirm: {
      return 'bg-green-500 text-black';
    }
    case ActionType.Danger: {
      return 'bg-red-500 text-black';
    }
    default: {
      return 'dark:bg-white bg-black dark:text-black text-white';
    }
  }
}

export function ActionButton({
  children,
  active,
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
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={clsx(getActionClass(variant), small ? 'button-sm' : 'button', onlyIcon && '!p-3')}
    >
      {currentIcon ? (
        onlyIcon ? (
          currentIcon
        ) : (
          <span className="flex gap-2 items-center">
            {currentIcon}
            <span className="line-clamp-1">{children}</span>
          </span>
        )
      ) : (
        <span className="line-clamp-1">{children}</span>
      )}
    </motion.button>
  );
}
