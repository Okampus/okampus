'use client';

import LinkList from '../List/LinkList';

import CollapseInput from '../Input/CollapseInput';
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
    accordeons.findIndex((acc) => acc.items.find((link) => link.href === pathname))
  );
  return (
    <ul className={clsx('flex flex-col', className)}>
      {accordeons.map((accordeon, i) => (
        <li key={i} className="flex flex-col">
          <CollapseInput heading={accordeon.heading} open={open === i} setOpen={(open) => setOpen(open ? i : -1)} />
          {open === i && <LinkList items={accordeon.items} className="" />}
        </li>
      ))}
    </ul>
  );
}
