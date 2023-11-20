'use client';

import { useCurrentBreakpoint } from '../../../_hooks/useCurrentBreakpoint';
import clsx from 'clsx';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

export interface SidebarItemProps {
  href: string;
  label: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconSelected?: React.ReactNode;
  customIcon?: boolean;
  noPadding?: boolean;
}

export default function SidebarLinkItem({
  href,
  label,
  className,
  icon,
  iconSelected,
  noPadding,
  customIcon,
}: SidebarItemProps) {
  const pathname = usePathname();
  const selected = pathname === href;

  const currentWindowSize = useCurrentBreakpoint();
  const isMobile = currentWindowSize === 'mobile';

  const itemClassName = clsx(
    className,
    'sidebar-link',
    selected ? 'text-[var(--primary)]' : 'text-2 hover:text-[var(--text-0)]',
    noPadding ? 'px-2' : 'px-6',
  );

  const inner = (
    <>
      {icon && (
        <span
          className={clsx(
            customIcon && selected && '[&>:first-child]:shadow-[0_0_0_2.5px_var(--primary)]',
            'relative h-6 w-6 [&>:first-child]:h-6 [&>:first-child]:w-6',
          )}
        >
          {selected ? iconSelected || icon : icon}
        </span>
      )}
      <div className="line-clamp-1">{label}</div>
    </>
  );

  const closeSidebar = () => isMobile && document.querySelector('#sidebar')?.classList.toggle('active');
  return (
    <Link onClick={closeSidebar} className={itemClassName} href={href}>
      {inner}
    </Link>
  );
}
