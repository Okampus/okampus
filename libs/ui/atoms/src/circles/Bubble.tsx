import { fuseClasses } from '@okampus/shared/utils';

type BubbleProps = { children: React.ReactNode; onClick: () => void; selected?: boolean; showBg?: boolean };

export function Bubble({ children, onClick, selected, showBg }: BubbleProps) {
  return (
    <div
      onClick={onClick}
      className={fuseClasses(
        showBg ? 'bg-bubble' : '',
        'cursor-pointer h-[3rem] w-[3rem] text-gray-300 [&.active]:text-white shrink-0 rounded-[50%] hover:rounded-[35%] [&.active]:rounded-[35%] transition-all flex justify-center items-center overflow-hidden',
        selected ? 'active' : ''
      )}
    >
      {children}
    </div>
  );
}
