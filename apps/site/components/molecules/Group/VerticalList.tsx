import GroupItem from '../../atoms/Item/GroupItem';
import clsx from 'clsx';

export type VerticalListProps = {
  title?: string;
  className?: string;
  nColumns?: number;
  minWidth?: string;
  children: React.ReactNode | React.ReactNode[];
};

export default function VerticalList({
  title,
  className,
  nColumns = 1,
  minWidth = '10rem',
  children,
}: VerticalListProps) {
  const inner = (
    <div
      className={clsx('grid gap-x-6 gap-y-2', className)}
      style={{ gridTemplateColumns: `repeat(${nColumns}, minmax(${minWidth}, 1fr))` }}
    >
      {children}
    </div>
  );

  if (title) return <GroupItem heading={title}>{inner}</GroupItem>;
  return inner;
}
