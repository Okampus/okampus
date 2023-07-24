import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import clsx from 'clsx';
import { useKeyPressEvent } from 'react-use';

export type ArrowButtonIconProps = {
  direction: 'left' | 'right';
  sizeClassName?: string;
  onClick: () => void;
  disabled?: boolean;
  showShortcut?: boolean;
};
export default function ArrowButtonIcon({
  direction,
  sizeClassName = 'h-8 w-8',
  onClick,
  disabled,
}: ArrowButtonIconProps) {
  useKeyPressEvent(direction === 'left' ? 'ArrowLeft' : 'ArrowRight', () => !disabled && onClick()); // TODO: hover state & account for disabled & debouncing when holding down

  const icon =
    direction === 'left' ? (
      <IconChevronLeft className={sizeClassName} />
    ) : (
      <IconChevronRight className={sizeClassName} />
    );
  const className = clsx(
    'rounded-lg p-1 shrink-0',
    disabled ? 'text-3 opacity-70' : 'text-0 opacity-80 hover:opacity-100 hover:bg-[var(--bg-3)]'
  );
  return (
    <button onClick={onClick} className={className}>
      {icon}
    </button>
  );
}