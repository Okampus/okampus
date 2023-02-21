import { VerticalList } from './VerticalList';
import { Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';

import { clsx } from 'clsx';

const defaultRenderMore = (extra: number, size: number) => (
  <div
    className="text-2 bg-4 h-8 w-8 rounded-[50%] flex items-center justify-center"
    style={{ width: `${size / 6}rem`, height: `${size / 6}rem`, fontSize: `${size / 14}rem` }}
  >
    +{extra}
  </div>
);

export type ItemGroupProps<T> = {
  items: T[];
  limit: number;
  title?: string;
  size?: number;
  showNumberInTitle?: boolean;
  render: (item: T) => React.ReactNode;
  renderListElement?: (item: T) => React.ReactNode;
  renderMore?: (extra: number, size: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
};

export function ItemGroup<T>({
  items,
  limit,
  size = 14,
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
      {items.length > limit && (
        <Popover>
          <PopoverTrigger>{renderMore(items.length - limit, size)}</PopoverTrigger>
          <PopoverContent>
            {VerticalList({
              title: showNumberInTitle ? (
                <div className="flex gap-2 items-center">
                  {`${title ?? 'Tous les éléments'}`} <div className="text-sm text-3 pt-px">({items.length})</div>
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
