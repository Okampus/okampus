import clsx from 'clsx';

export type PercentProgressProps = { className?: string; max?: number; value: number };
export function PercentProgress({ className, max = 100, value }: PercentProgressProps) {
  return (
    <span className={clsx('flex items-center gap-1 text-sm font-medium text-2', className)}>
      {value.toFixed(0)}%
      <progress className="rounded-sm bg-transparent h-2" max={max} value={value} />
    </span>
  );
}
