import { clsx } from 'clsx';

type BubbleProps = {
  onClick: () => void;
  children?: React.ReactNode;
  selected?: boolean;
  showBg?: boolean;
  heightClass?: string;
};

export function Bubble({ children, onClick, selected, showBg, heightClass = 'h-bubble' }: BubbleProps) {
  return (
    <button
      onClick={onClick}
      className={clsx('rounded-[35%] p-px active:scale-95', selected ? 'dark:bg-white bg-[#4880e9]' : '')}
    >
      <div className={clsx('rounded-[35%] p-bubble', selected ? 'dark:bg-black bg-white ' : '')}>
        <div
          className={clsx(
            heightClass,
            showBg ? 'bg-bubble' : '',
            'aspect-square cursor-pointer text-gray-300 [&.active]:text-white shrink-0 rounded-[35%] outline-offset-2 flex justify-center items-center overflow-hidden',
            selected ? 'active' : ''
          )}
        >
          {children}
        </div>
      </div>
    </button>
  );
}
