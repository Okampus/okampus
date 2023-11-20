'use client';

import Accordeon from './Accordeon';
import SidebarLinkItem from '../../atoms/Item/SidebarLinkItem';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import type { SidebarItemProps } from '../../atoms/Item/SidebarLinkItem';

export type LinkListAccordeonProps = {
  className?: string;
  accordeons: { title: string; items: SidebarItemProps[] }[];
};

export default function LinkListAccordeon({ accordeons, className }: LinkListAccordeonProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<number>(
    accordeons.findIndex((acc) => acc.items.find((link) => link.href === pathname)),
  );
  return (
    <ul className={clsx('flex flex-col', className)}>
      {accordeons.map(({ items, title }, idx) => {
        const label = <h3 className="flex items-center gap-2.5">{title}</h3>;

        return (
          <Accordeon
            key={idx}
            titleClassName="text-1 font-medium"
            label={label}
            open={open === idx}
            setOpen={(open) => setOpen(open ? idx : -1)}
          >
            {items.map((item) => (
              <SidebarLinkItem key={item.href} noPadding={true} {...item} />
            ))}
          </Accordeon>
        );
      })}
    </ul>
  );
}
