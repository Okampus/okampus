import { clsx } from 'clsx';

export type TabsListProps = {
  color: string;
  selected: string;
  tabClassName?: string;
  listClassName?: string;
  tabs: { key: string; label: React.ReactNode; onClick: (tab: string) => void }[];
};

export function TabsList({ color, selected, tabClassName, listClassName, tabs }: TabsListProps) {
  return (
    <div className={clsx('flex gap-8 overflow-x-scroll scrollbar', listClassName)}>
      {tabs.map(({ key, label, onClick }) => (
        <div
          key={key}
          className={clsx(
            tabClassName,
            key === selected ? 'border-b-4 text-0 font-bold' : 'text-1 font-semibold',
            'pb-1.5 font-heading cursor-pointer hover:border-b-4 whitespace-nowrap'
          )}
          style={{ borderColor: color }}
          onClick={() => onClick(key)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
