import clsx from 'clsx';

export type TopbarTabsListProps = {
  selected: string | number;
  tabClassName?: string;
  listClassName?: string;
  tabs: { key: string | number; label: React.ReactNode; onClick: (tab: string | number) => void }[];
};

export function TopbarTabsList({ selected, tabClassName, listClassName, tabs }: TopbarTabsListProps) {
  return (
    <div className="relative">
      <ul className={clsx('flex gap-4 overflow-scroll scrollbar', listClassName)}>
        {tabs.map(({ key, label, onClick }) => (
          <li
            key={key}
            className={clsx(
              tabClassName,
              'cursor-pointer whitespace-nowrap text-lg !font-bold button',
              key === selected ? 'text-white bg-primary' : 'text-2'
            )}
            onClick={() => onClick(key)}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
