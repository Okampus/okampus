import { clsx } from 'clsx';

type BubbleProps = {
  onClick: () => void;
  children?: React.ReactNode;
  selected?: boolean;
  showBg?: boolean;
};

export function Bubble({ children, onClick, selected, showBg }: BubbleProps) {
  return (
    <button
      onClick={onClick}
      className={clsx('rounded-[35%] p-0.5 active:scale-95', selected ? 'dark:bg-white bg-[#4880e9]' : '')}
    >
      <div className={clsx('rounded-[35%] p-0.5', selected ? 'dark:bg-black bg-white ' : '')}>
        <div
          className={clsx(
            showBg ? 'bg-bubble' : '',
            'cursor-pointer h-11 w-11 text-gray-300 [&.active]:text-white shrink-0 rounded-[35%] outline-offset-2 flex justify-center items-center overflow-hidden',
            selected ? 'active' : ''
          )}
        >
          {children}
        </div>
      </div>
    </button>
  );
}
