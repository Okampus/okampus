'use client';

import { useTranslation } from '../../../_hooks/context/useTranslation';
import clsx from 'clsx';

import type { dateFormatters } from '../../../../config/i18n';

export type IDateProps = { date?: Date | number; formatter?: keyof typeof dateFormatters; className?: string };
export default function IDate({ date, className, formatter = 'day' }: IDateProps) {
  const { format } = useTranslation();
  return (
    <span className={clsx(className, 'tracking-wide tabular-nums')}>
      {date ? format(formatter, date) : 'Date inconnue'}
    </span>
  );
}
