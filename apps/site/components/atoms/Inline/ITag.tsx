import { IconX } from '@tabler/icons-react';
import clsx from 'clsx';

export type ITagProps = {
  content: React.ReactNode;
  onRemove?: () => void;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
};

export default function ITag({ content, onRemove, startContent, endContent }: ITagProps) {
  const className = clsx(
    'rounded-md inline-flex items-center h-10 gap-2 px-2 text-0 bg-0 hover:bg-[var(--bg-1)]',
    onRemove && 'cursor-pointer',
  );
  return (
    <li className={className} onClick={onRemove}>
      {startContent && <span className="shrink-0">{startContent}</span>}
      <span className="line-clamp-1 break-all font-medium">{content}</span>
      {endContent && <span className="shrink-0">{endContent}</span>}
      {onRemove && <IconX className="shrink-0 aspect-square pr-1" />}
    </li>
  );
}
