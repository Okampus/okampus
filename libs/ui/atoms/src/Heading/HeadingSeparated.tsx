import { clsx } from 'clsx';

export type HeadingSeparatedProps = {
  title?: React.ReactNode;
  titleTextClassName?: string;
  separatorClassName?: string;
  gapClassName?: string;
};

export function HeadingSeparated({
  title,
  titleTextClassName = 'text-3xl text-1',
  separatorClassName = 'border-color-2',
  gapClassName = 'gap-4',
}: HeadingSeparatedProps) {
  return title ? (
    <div className={clsx('flex flex-col', gapClassName)}>
      <span className={clsx('pl-1 font-medium pr-20', titleTextClassName)}>{title}</span>
      <hr className={clsx('mb-4', separatorClassName)} />
    </div>
  ) : null;
}
