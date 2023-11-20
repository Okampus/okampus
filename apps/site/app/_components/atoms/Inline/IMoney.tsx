'use client';

import { useTranslation } from '../../../_hooks/context/useTranslation';
import clsx from 'clsx';

import type { Currency } from '@prisma/client';

export type IMoneyProps = { amount: number; currency?: Currency; className?: string; withSign?: boolean };
export default function IMoney({ amount, className, currency = 'EUR', withSign = true }: IMoneyProps) {
  const isPositive = amount > 0;
  const amountClassName = isPositive ? 'text-[var(--success)]' : 'text-[var(--text-1)]';

  const { format } = useTranslation();
  const number = format('decimal', amount);

  return (
    <span className={clsx(className, amountClassName, 'tracking-wide tabular-nums')}>
      {withSign && isPositive && '+'}
      {number} {currency}
    </span>
  );
}
