import clsx from 'clsx';
// import { HeadingSeparated } from '@okampus/ui/atoms';

export type VerticalListProps = {
  title?: React.ReactNode | React.ReactNode[];
  className?: string;
  nColumns?: number;
  minWidth?: string;
  children: React.ReactNode | React.ReactNode[];
};

export function VerticalList({ title, className, nColumns = 1, minWidth = '10rem', children }: VerticalListProps) {
  return (
    <div>
      {/* {HeadingSeparated({ title, titleTextClassName: 'text-base text-1', gapClassName: 'gap-2' })} */}
      <div
        className={clsx('grid gap-x-6 gap-y-2', className)}
        style={{ gridTemplateColumns: `repeat(${nColumns}, minmax(${minWidth}, 1fr))` }}
      >
        {children}
      </div>
    </div>
  );
}
