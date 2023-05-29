import { ReactComponent as ChevronLeftIcon } from '@okampus/assets/svg/icons/material/outlined/back.svg';
import { ReactComponent as ChevronRightIcon } from '@okampus/assets/svg/icons/material/outlined/next.svg';

import { clsx } from 'clsx';
import { useKeyPressEvent } from 'react-use';

export type ArrowButtonProps = {
  direction: 'left' | 'right';
  heightClassName?: string;
  onClick: () => void;
  disabled?: boolean;
  showShortcut?: boolean;
};
export function ArrowButton({ direction, onClick, disabled, heightClassName = 'h-11' }: ArrowButtonProps) {
  useKeyPressEvent(direction === 'left' ? 'ArrowLeft' : 'ArrowRight', onClick); // TODO: hover state & account for disabled & debouncing when holding down

  const icon = direction === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />;
  const className = clsx(
    heightClassName,
    'button-circle-bordered',
    disabled ? 'text-3 opacity-70' : 'text-0 opacity-80 hover:opacity-100 hover:bg-[var(--bg-3)]'
  );
  return (
    <button onClick={onClick} className={className}>
      {icon}
    </button>
  );
}
