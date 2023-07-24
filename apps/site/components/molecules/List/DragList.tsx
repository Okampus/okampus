'use client';

import { IconGripVertical, IconTrash } from '@tabler/icons-react';
import { List, arrayMove } from 'react-movable';
import clsx from 'clsx';
import type { SelectItem } from '@okampus/shared/types';

export type DragListProps<T> = {
  items: SelectItem<T>[];
  atLeastOne?: boolean;
  className?: string;
  onChange: (items: SelectItem<T>[]) => void;
};

export default function DragList<T>({ className, atLeastOne, items, onChange }: DragListProps<T>) {
  return (
    <List
      values={items}
      onChange={({ oldIndex, newIndex }) => onChange(arrayMove(items, oldIndex, newIndex))}
      renderList={({ children, props }) => (
        <ul {...props} className={clsx('w-full max-w-4xl pt-5', className)}>
          {children}
        </ul>
      )}
      renderItem={({ value, props, index }) => (
        // TODO: fix internal state conservation on drag with react-movable (fix keys with alternative system)
        <div
          {...props}
          key={value.key ?? index}
          className="w-full md:rounded-2xl bg-1 mb-5 flex gap-4 items-stretch z-50"
        >
          <span data-movable-handle className="pl-2.5 flex justify-center items-center cursor-grab">
            <IconGripVertical className="h-4 w-4 text-2" />
          </span>
          <div className="flex-1 py-6">{value.label}</div>
          {atLeastOne && index === 0 ? (
            <span className="ml-5 mt-6 h-8 w-8" />
          ) : (
            <span className="pl-1 pr-5 pt-6 flex">
              <IconTrash
                className="h-7 w-7 text-2 self-start p-0.5 cursor-pointer"
                onClick={() => onChange(items.filter((item) => item !== value))}
              />
            </span>
          )}
        </div>
      )}
    />
  );
}
