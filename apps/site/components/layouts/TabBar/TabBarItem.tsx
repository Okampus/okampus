import clsx from 'clsx';
import Link from 'next/link';

import type { LinkItemProps } from '@okampus/shared/types';

type TabBarItemProps = LinkItemProps & { children?: React.ReactNode; smallPadding?: boolean };
export default function TabBarItem({
  pathname,
  icon,
  label,
  checkSelected,
  href,
  children,
  smallPadding,
}: TabBarItemProps) {
  checkSelected = checkSelected || ((href) => pathname === href);
  const selected = checkSelected(href);

  const className = clsx(
    'relative flex justify-center items-center w-full aspect-square group-hover:scale-[1.03] overflow-hidden rounded-xl [&>:first-child]:rounded-lg',
    icon
      ? clsx(
          'bg-2 border-[3px] [&>:first-child]:h-full [&>:first-child]:aspect-square',
          smallPadding ? '[&>:first-child]:p-1.5' : '[&>:first-child]:p-2.5'
        )
      : 'border-0',
    selected ? 'border-[3px] border-[var(--border-opposite)]' : 'border-transparent'
  );

  if (icon) {
    const selectedClassName = selected ? 'text-0' : 'text-1';

    children = <div className={clsx(className, selectedClassName)}>{icon}</div>;
  } else {
    children = <div className={clsx(className)}>{children}</div>;
  }

  return (
    <Link
      href={href}
      className="relative flex flex-col items-center pl-2 pr-3.5 group"
      title={typeof label === 'string' ? label : ''}
    >
      {children}
    </Link>
  );
}
