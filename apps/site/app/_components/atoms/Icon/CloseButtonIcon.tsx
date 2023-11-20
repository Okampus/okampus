import { X } from '@phosphor-icons/react/dist/ssr';

import clsx from 'clsx';
import { useKeyPressEvent } from 'react-use';

// 'h-10 w-10 rounded-[50%] border border-[var(--text-0)] contrast-hover flex justify-center items-center';

export type CloseButtonIconProps = {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};
export default function CloseButtonIcon({ onClick, className, disabled, icon = <X /> }: CloseButtonIconProps) {
  useKeyPressEvent('Escape', () => !disabled && onClick());

  const button = (
    <button
      onClick={onClick}
      className={clsx(
        'button-icon',
        className,
        disabled ? 'text-3 opacity-70' : 'text-1 opacity-80 hover:opacity-100 hover:bg-[var(--bg-3)]',
      )}
    >
      {icon}
    </button>
  );

  return button;
}
