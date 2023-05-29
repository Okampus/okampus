import { formatCurrency, formatCurrencyWithSign } from '@okampus/shared/utils';
import { clsx } from 'clsx';

export type TextFinanceProps = {
  amount: number;
  showRed?: boolean;
  textClass?: string;
  className?: string;
  withSign?: boolean;
};
export function TextFinance({ amount, showRed, textClass = 'text-1', className, withSign = true }: TextFinanceProps) {
  const isPositive = amount > 0;
  const format = withSign ? formatCurrencyWithSign : formatCurrency;
  return (
    <span
      className={clsx(
        className,
        isPositive ? 'dark:text-green-300 text-green-400' : showRed ? 'text-red-400' : textClass,
        'font-medium tracking-wide tabular-nums'
      )}
    >
      {format(amount)}
    </span>
  );
}
