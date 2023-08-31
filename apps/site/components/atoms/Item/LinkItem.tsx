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
  customIcon,
  onClick,
}: LinkItemProps) {
  if (!checkSelected) checkSelected = (href) => pathname === href;
  const selected = checkSelected(href);
  const classes = clsx(
    className,
    selected ? 'text-[var(--primary)]' : 'text-2 text-0-hover opacity-90 text-hover',
    'relative flex items-center py-2 font-medium rounded gap-4 px-3 text-base',
  );

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {icon && (
        <i
          className={clsx(
            customIcon && selected && '[&>:first-child]:shadow-[0_0_0_3px_var(--primary)]',
            'relative h-7 w-7 [&>:first-child]:h-7 [&>:first-child]:w-7',
          )}
        >
          {icon}
        </i>
      )}
      <div className="line-clamp-1">{label}</div>
    </Link>
  );
}
