import clsx from 'clsx';

export type ItemCardProps = { onClick?: () => void; className?: string; children: React.ReactNode };
export function ItemCard({ onClick, className, children }: ItemCardProps) {
  // const itemCardClass;
  return (
    <div onClick={() => onClick?.()} className={clsx(className, 'item-card')}>
      {children}
    </div>
  );
}
