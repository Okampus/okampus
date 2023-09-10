import { IconX } from '@tabler/icons-react';
import clsx from 'clsx';

export type ITagProps = {
  className?: string;
  content: React.ReactNode;
  onRemove?: () => void;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
};

export default function ITag({ className, content, onRemove, startContent, endContent }: ITagProps) {
  const tagClassName = clsx(
    className,
    'rounded-md inline-flex items-center gap-1.5 py-0.5 px-2.5 text-0 bg-[var(--bg-tag)] hover:bg-[var(--bg-1)]',
    onRemove && 'cursor-pointer !pr-0.5',
  );

  return (
    <li
      className={tagClassName}
      onClick={(e) => {
        e.preventDefault();
        onRemove?.();
      }}
    >
      {startContent && <span className="shrink-0">{startContent}</span>}
      <span className="line-clamp-1 break-all">{content}</span>
      {endContent && <span className="shrink-0">{endContent}</span>}
      {onRemove && <IconX className="shrink-0 aspect-square pr-1" />}
    </li>
  );
}
