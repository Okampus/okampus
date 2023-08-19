import clsx from 'clsx';
import Link from 'next/link';

type TabBarItemProps = {
  children?: React.ReactNode;
  smallPadding?: boolean;
  pathname: string;
  icon?: React.ReactNode;
  label?: string;
  checkSelected?: (href: string) => boolean;
  linkOrAction: string | (() => void);
  // href: string;
};
export default function TabBarItem({
  pathname,
  icon,
  label,
  checkSelected,
  linkOrAction,
  children,
  smallPadding,
}: TabBarItemProps) {
  checkSelected = checkSelected || ((href) => pathname === href);
  const selected = typeof linkOrAction === 'string' && checkSelected(linkOrAction);

  const className = clsx(
    'relative flex justify-center items-center w-full aspect-square group-hover:scale-[1.03] overflow-hidden rounded-xl [&>:first-child]:rounded-lg',
    icon
      ? clsx(
          'bg-2 border-[3px] [&>:first-child]:w-full [&>:first-child]:h-full',
          smallPadding ? '[&>:first-child]:p-1.5' : '[&>:first-child]:p-2',
        )
      : 'border-0',
    selected ? 'border-[3px] border-[var(--border-opposite)]' : 'border-transparent',
  );

  if (icon) {
    const selectedClassName = selected ? 'text-0' : 'text-2';
    children = <div className={clsx(className, selectedClassName)}>{icon}</div>;
  } else {
    children = <div className={clsx(className)}>{children}</div>;
  }

  const itemClassName = 'relative flex flex-col items-center pl-2 pr-2.5 pt-2 group';

  return typeof linkOrAction === 'string' ? (
    <Link href={linkOrAction} className={itemClassName} title={typeof label === 'string' ? label : ''}>
      {children}
    </Link>
  ) : (
    <button onClick={linkOrAction} className={itemClassName}>
      {children}
    </button>
  );
}
