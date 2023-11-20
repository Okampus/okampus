import Popover from '../../atoms/Popover/Popover';
import PopoverContent from '../../atoms/Popover/PopoverContent';
import PopoverTrigger from '../../atoms/Popover/PopoverTrigger';

import { Block } from '../../atoms/Container/Block';
import clsx from 'clsx';

const defaultRenderMore = (count: number) => (
  <div className="text-0 flex items-center justify-center ml-3">+&thinsp;{count}</div>
);

export type StackProps<T> = {
  items: T[];
  itemsCount?: number;
  limit: number;
  title?: string;
  showNumberInTitle?: boolean;
  render: (item: T) => React.ReactNode;
  renderListElement?: (item: T) => React.ReactNode;
  renderMore?: (count: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
};

export default function Stack<T>({
  items,
  itemsCount,
  limit,
  title,
  showNumberInTitle = true,
  render,
  renderListElement = render,
  renderMore = defaultRenderMore,
  className,
  itemClassName,
}: StackProps<T>) {
  const popoverTitle = showNumberInTitle
    ? `${title ?? 'Tous les éléments'} (${itemsCount ?? items.length})`
    : title ?? 'Tous les éléments';

  return (
    <div className={clsx('flex', className)}>
      {items.slice(0, limit).map((item, idx) => (
        <div className={itemClassName} key={idx} style={{ zIndex: limit - idx }}>
          {render(item)}
        </div>
      ))}
      {(itemsCount ?? items.length) > limit && (
        <Popover placementOffset={10}>
          <PopoverTrigger>{renderMore((itemsCount ?? items.length) - limit)}</PopoverTrigger>
          <PopoverContent popoverClassName="card-md p-3 bg-2 rounded-2xl text-0">
            <Block title={popoverTitle}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {items.map((item, idx) => (
                  <div key={idx}>{renderListElement(item)}</div>
                ))}
              </div>
            </Block>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
