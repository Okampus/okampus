import VerticalGroup from './VerticalGroup';
import Popover from '../../atoms/Popup/Popover/Popover';
import PopoverContent from '../../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../../atoms/Popup/Popover/PopoverTrigger';

import clsx from 'clsx';

const defaultRenderMore = (count: number) => (
  <div className="text-0 flex items-center justify-center ml-3">+&thinsp;{count}</div>
);

export type GroupProps<T> = {
  items: T[];
  itemsCount?: number;
  limit: number;
  title?: string;
  size?: number;
  rounded: number;
  showNumberInTitle?: boolean;
  render: (item: T) => React.ReactNode;
  renderListElement?: (item: T) => React.ReactNode;
  renderMore?: (count: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
};

export default function Group<T>({
  items,
  itemsCount,
  limit,
  title,
  render,
  renderListElement = render,
  renderMore = defaultRenderMore,
  showNumberInTitle = true,
  className,
  itemClassName,
}: GroupProps<T>) {
  const heading = showNumberInTitle
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
            <VerticalGroup title={heading} nColumns={2}>
              {items.map((item, idx) => (
                <div key={idx}>{renderListElement(item)}</div>
              ))}
            </VerticalGroup>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
