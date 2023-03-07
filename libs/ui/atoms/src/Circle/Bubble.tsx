import { AVATAR_SHORTCUT_ROUNDED } from '@okampus/shared/consts';
import { clsx } from 'clsx';

type BubbleProps = {
  onClick: () => void;
  children?: React.ReactNode;
  selected?: boolean;
  showBg?: boolean;
  heightClass?: string;
};

export function Bubble({ children, onClick, selected }: BubbleProps) {
  return (
    <button
      onClick={onClick}
      style={{ borderRadius: `${AVATAR_SHORTCUT_ROUNDED}%` }}
      data-active={selected}
      className={clsx('p-[2px] active:scale-95 overflow-hidden', selected && 'bg-activate')}
    >
      <div
        style={{ borderRadius: `${AVATAR_SHORTCUT_ROUNDED}%` }}
        className={clsx('p-bubble', selected ? 'dark:bg-black bg-white ' : '')}
      >
        <div
          data-active={selected}
          style={{ borderRadius: `${AVATAR_SHORTCUT_ROUNDED}%` }}
          className={clsx(
            'bg-activate flex justify-center items-center h-bubble aspect-square cursor-pointer text-gray-300 [&.active]:text-white shrink-0 overflow-hidden'
          )}
        >
          {children}
        </div>
      </div>
    </button>
  );
}
