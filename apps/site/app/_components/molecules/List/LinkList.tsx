'use client';

import LinkItem from '../../atoms/Item/LinkItem';
import GroupHeading from '../../atoms/Heading/GroupHeading';

import { isSidebarOpenAtom } from '../../../_context/global';
import { useCurrentBreakpoint } from '../../../_hooks/useCurrentBreakpoint';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import { useAtom } from 'jotai';
import type { GroupHeadingProps } from '../../atoms/Heading/GroupHeading';
import type { LinkItemProps } from '@okampus/shared/types';

export type LinkListProps = {
  items: Omit<LinkItemProps, 'pathname'>[];
  heading?: GroupHeadingProps;
  className?: string;
  mode?: 'sidebar';
};

const SideBarLinkItem = (props: LinkItemProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const currentWindowSize = useCurrentBreakpoint();
  const isMobile = currentWindowSize === 'mobile';
  return <LinkItem onClick={() => isMobile && setIsSidebarOpen(!isSidebarOpen)} {...props} />;
};

export default function LinkList({ items, heading, className, mode }: LinkListProps) {
  const pathname = usePathname();
  return (
    <ul className={clsx('flex flex-col', className)}>
      {heading && (
        <div className="px-3 pb-4">
          <GroupHeading {...heading} />
        </div>
      )}
      {items.map((item, idx) =>
        mode === 'sidebar' ? (
          <SideBarLinkItem key={idx} pathname={pathname} {...item} />
        ) : (
          <LinkItem key={idx} pathname={pathname} {...item} />
        ),
      )}
    </ul>
  );
}