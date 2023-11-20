'use client';

import ActionWrapper from '../../atoms/Wrapper/ActionWrapper';
import clsx from 'clsx';

import { usePathname } from 'next/navigation';

import type { Action } from '@okampus/shared/types';

type Icons = { base: React.ReactNode; selected?: React.ReactNode };
type TabBarItemProps = { label: string; icons: Icons; regex?: string; action: Action; isCustomIcon?: boolean };
export default function TabBarItem({ label, icons, regex, action, isCustomIcon }: TabBarItemProps) {
  const pathname = usePathname();
  const selected = regex && new RegExp(`${regex}(?:/|$)`, 'g').exec(pathname);

  const selectedClass = isCustomIcon
    ? '[&>:first-child]:shadow-[0_0_0_3px_var(--primary)] text-primary'
    : 'text-primary';
  const itemClassName = clsx(selected ? selectedClass : 'text-1 hover:text-[var(--text-0)]', 'sidebar-link px-5');

  return (
    <ActionWrapper action={action} className={itemClassName}>
      {selected ? icons.selected || icons.base : icons.base}
      <div className="sidebar-label md-max:hidden line-clamp-1">{label}</div>
    </ActionWrapper>
  );
}
