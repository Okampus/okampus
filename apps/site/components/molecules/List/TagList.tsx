import ITag from '../../atoms/Inline/ITag';
import clsx from 'clsx';
import { forwardRef } from 'react';

import type { ITagProps } from '../../atoms/Inline/ITag';

export type TagListProps = {
  tags: ITagProps[];
  onRemove?: (index: number) => void;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLUListElement>, 'children'>;

export default forwardRef<HTMLUListElement, TagListProps>(function TagList(
  { tags, className, onRemove, children, ...ulProps }: TagListProps,
  ref,
) {
  return (
    <ul ref={ref} className={clsx('flex flex-wrap gap-2 gap-x-2 gap-y-1 overflow-hidden', className)} {...ulProps}>
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
});
