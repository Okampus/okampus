'use client';

import LinkItem from '../../atoms/Item/LinkItem';
import GroupHeading from '../../atoms/Heading/GroupHeading';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import type { GroupHeadingProps } from '../../atoms/Heading/GroupHeading';
import type { LinkItemProps } from '@okampus/shared/types';

export type LinkListProps = {
  items: Omit<LinkItemProps, 'pathname'>[];
  heading?: GroupHeadingProps;
  large?: boolean;
  className?: string;
};

export default function LinkList({ items, heading, large, className }: LinkListProps) {
  const pathname = usePathname();
  return (
    <ul className={clsx('flex flex-col', className)}>
      {heading && (
        <div className="px-3 pb-4">
          <GroupHeading {...heading} />
        </div>
      )}
      {items.map((item, i) => (
        <LinkItem key={i} pathname={pathname} {...item} large={large} />
      ))}
    </ul>
  );
}
