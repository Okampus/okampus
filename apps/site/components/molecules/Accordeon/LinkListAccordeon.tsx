'use client';

import Accordeon from './Accordeon';
import LinkList from '../List/LinkList';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import type { GroupHeadingProps } from '../../atoms/Heading/GroupHeading';
import type { LinkItemProps } from '@okampus/shared/types';

export type LinkListAccordeonProps = {
  accordeons: { heading: GroupHeadingProps; items: Omit<LinkItemProps, 'pathname'>[] }[];
  className?: string;
};

export default function LinkListAccordeon({ accordeons, className }: LinkListAccordeonProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<number>(
    accordeons.findIndex((acc) => acc.items.find((link) => link.href === pathname)),
  );
  return (
    <ul className={clsx('flex flex-col', className)}>
      {accordeons.map(({ items, heading }, idx) => {
        const label = (
          <h3 className="flex items-center gap-2.5 label-title">
            {heading.icon && <i className="[&>:first-child]:h-5 [&>:first-child]:w-5">{heading.icon}</i>}
            {heading.label}
          </h3>
        );

        return (
          <Accordeon key={idx} label={label} open={open === idx} setOpen={(open) => setOpen(open ? idx : -1)}>
            <LinkList items={items} />
          </Accordeon>
        );
      })}
    </ul>
  );
}
