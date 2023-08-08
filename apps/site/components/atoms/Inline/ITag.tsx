import { IconX } from '@tabler/icons-react';
import clsx from 'clsx';

export type ITagProps = {
  content: React.ReactNode;
  onRemove?: () => void;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
};

export function ITag({ content, onRemove, startContent, endContent }: ITagProps) {
  const className = clsx(
    'rounded-md inline-flex items-stretch gap-2 px-1.5 text-0 bg-0 hover:bg-[var(--bg-1)]',
    onRemove && 'cursor-pointer'
  );
  return (
    <li className={className} onClick={onRemove}>
      {startContent && <span className="shrink-0">{startContent}</span>}
      <span className="line-clamp-1 break-all font-medium text-sm">{content}</span>
      {endContent && <span className="shrink-0">{endContent}</span>}
      {onRemove && <IconX className="shrink-0 aspect-square py-1 pr-1" />}
    </li>
  );
}
