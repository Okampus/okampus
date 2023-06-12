import { ReactComponent as ChevronRightFilledIcon } from '@okampus/assets/svg/icons/material/filled/chevron-right.svg';
import clsx from 'clsx';

export type CollapsibleItemProps = {
  open: boolean;
  onToggle: (open: boolean) => void;
  disabled?: boolean;
  title: React.ReactNode;
  content: React.ReactNode;
  className?: string;
};

export function CollapsibleItem({ title, onToggle, disabled, content, className, open }: CollapsibleItemProps) {
  return (
    <div>
      <div
        className={clsx('bg-main flex flex-col gap-2 text-2 cursor-pointer', className)}
        onClick={() => !disabled && onToggle(!open)}
      >
        <div className="w-full flex items-center gap-2">
          <ChevronRightFilledIcon className={clsx(open && 'rotate-90', 'w-6 h-6', disabled && 'opacity-0')} />
          {title}
        </div>
      </div>
      {open && <div className="flex flex-col gap-2 bg-2 my-3">{content}</div>}
    </div>
  );
}
