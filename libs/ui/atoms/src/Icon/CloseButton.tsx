import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/material/filled/close.svg';

import { clsx } from 'clsx';
import { useKeyPressEvent } from 'react-use';

// 'h-10 w-10 rounded-[50%] border-2 border-[var(--text-0)] contrast-hover flex justify-center items-center';

export type CloseButtonProps = { onClick: () => void; className?: string; disabled?: boolean; icon?: React.ReactNode };
export function CloseButton({ onClick, className, disabled, icon = <CloseIcon /> }: CloseButtonProps) {
  useKeyPressEvent('Escape', () => !disabled && onClick());

  const button = (
    <button
      onClick={onClick}
      className={clsx(
        'button-circle opacity-50 !p-1.5 h-10',
        className,
        disabled ? 'text-3 opacity-70' : 'text-1 opacity-80 hover:opacity-100 hover:bg-[var(--bg-4)]'
      )}
    >
      {icon}
    </button>
  );

  return button;
}
