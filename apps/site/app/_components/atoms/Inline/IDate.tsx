'use client';

import clsx from 'clsx';
import { useFormatter } from 'next-intl';

import type { dateFormatters } from '../../../../utils/format/format';

export type IDateProps = { date?: Date | number; formatter?: keyof typeof dateFormatters; className?: string };
export default function IDate({ date, className, formatter = 'day' }: IDateProps) {
  const format = useFormatter();
  return (
    <span className={clsx(className, 'tracking-wide tabular-nums')}>
      {date ? format.dateTime(date, formatter) : 'Date inconnue'}
    </span>
  );
}
