import ITag from '../../atoms/Inline/ITag';
import clsx from 'clsx';

import type { ITagProps } from '../../atoms/Inline/ITag';

export type TagListProps = {
  tags: ITagProps[];
  onRemove?: (index: number) => void;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLUListElement>, 'children'>;

export default function TagList({ tags, className, onRemove, children, ...ulProps }: TagListProps) {
  return (
    <ul className={clsx('w-full flex flex-wrap gap-2 gap-x-2 gap-y-1 overflow-hidden', className)} {...ulProps}>
      {tags.map((tag, idx) => (
        <ITag
          key={idx}
          content={tag.content}
          startContent={tag.startContent}
          endContent={tag.endContent}
          onRemove={tag.onRemove ?? (onRemove ? () => onRemove(idx) : undefined)}
        />
      ))}
      {children}
    </ul>
  );
}
