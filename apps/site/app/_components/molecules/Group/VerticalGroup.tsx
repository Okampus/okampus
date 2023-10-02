import SimpleList from '../List/SimpleList';
import clsx from 'clsx';

export type VerticalGroupProps = {
  title?: string;
  className?: string;
  nColumns?: number;
  minWidth?: string;
  children: React.ReactNode | React.ReactNode[];
};

export default function VerticalGroup({
  title,
  className,
  nColumns = 1,
  minWidth = '10rem',
  children,
}: VerticalGroupProps) {
  const inner = (
    <div
      className={clsx('grid gap-x-6 gap-y-2', className)}
      style={{ gridTemplateColumns: `repeat(${nColumns}, minmax(${minWidth}, 1fr))` }}
    >
      {children}
    </div>
  );

  if (title) return <SimpleList heading={title}>{inner}</SimpleList>;
  return inner;
}
