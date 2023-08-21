import clsx from 'clsx';
import Link from 'next/link';

import type { LinkItemProps } from '@okampus/shared/types';

export default function LinkItem({
  className,
  pathname,
  icon,
  label,
  checkSelected,
  href,
  large,
  customIcon,
  onClick,
}: LinkItemProps) {
  if (!checkSelected) checkSelected = (href) => pathname === href;
  const selected = checkSelected(href);
  const classes = clsx(
    className,
    'relative flex items-center px-2.5 py-2 font-medium rounded',
    selected ? 'text-[var(--primary)]' : 'text-2 text-0-hover opacity-90 text-hover',
    large ? 'text-lg gap-3' : 'text-base gap-2.5',
  );

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {icon && (
        <i
          className={clsx(
            customIcon && selected && '[&>:first-child]:shadow-[0_0_0_3px_var(--primary)]',
            'relative',
            large
              ? 'h-8 w-8 [&>:first-child]:h-8 [&>:first-child]:w-8'
              : 'h-6 w-6 [&>:first-child]:h-6 [&>:first-child]:w-6',
          )}
        >
          {icon}
        </i>
      )}
      <div className="line-clamp-1">{label}</div>
    </Link>
  );
}
