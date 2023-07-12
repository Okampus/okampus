import { VerticalList } from './VerticalList';
import { Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';

import clsx from 'clsx';

const defaultRenderMore = (extra: number, size: number, rounded: number) => (
  <div
    className="text-2 bg-4 h-8 w-8 flex items-center justify-center"
    style={{
      width: `${size / 6}rem`,
      height: `${size / 6}rem`,
      fontSize: `${size / 14}rem`,
      borderRadius: `${rounded}%`,
    }}
  >
    +{extra}
  </div>
);

export type ItemGroupProps<T> = {
  items: T[];
  itemsCount?: number;
  limit: number;
  title?: string;
  size?: number;
  rounded: number;
  showNumberInTitle?: boolean;
  render: (item: T) => React.ReactNode;
  renderListElement?: (item: T) => React.ReactNode;
  renderMore?: (extra: number, size: number, rounded: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
};

export function ItemGroup<T>({
  items,
  itemsCount,
  limit,
  size = 14,
  rounded,
  title,
  render,
  renderListElement = render,
  renderMore = defaultRenderMore,
  showNumberInTitle = true,
  className,
  itemClassName,
}: ItemGroupProps<T>) {
  return (
    <div className={clsx('flex', className)}>
      {items.slice(0, limit).map((item, index) => (
        <div className={itemClassName} key={index}>
          {render(item)}
        </div>
      ))}
      {(itemsCount ?? items.length) > limit && (
        <Popover placementOffset={10}>
          <PopoverTrigger>{renderMore((itemsCount ?? items.length) - limit, size, rounded)}</PopoverTrigger>
          <PopoverContent popoverClassName="card-md p-3 bg-2 rounded-2xl">
            {VerticalList({
              title: showNumberInTitle ? (
                <div className="flex gap-2 items-center">
                  {`${title ?? 'Tous les éléments'}`}{' '}
                  <div className="text-sm text-3 pt-px">({itemsCount ?? items.length})</div>
                </div>
              ) : (
                title
              ),
              children: items.map((item, idx) => <div key={idx}>{renderListElement(item)}</div>),
              nColumns: 2,
            })}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
