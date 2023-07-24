'use client';

import { IconGripVertical, IconX } from '@tabler/icons-react';
import { List, arrayMove } from 'react-movable';
import clsx from 'clsx';
import type { SelectItem } from '@okampus/shared/types';

export type DragOptionsListProps<T> = {
  items: SelectItem<T>[];
  addOption: (index: number) => SelectItem<T>;
  onChange: (items: SelectItem<T>[]) => void;
  className?: string;
  optionLabel?: string;
};

export default function DragOptionsList<T>({
  items,
  addOption,
  onChange,
  className,
  optionLabel = 'une option',
}: DragOptionsListProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <List
        values={items}
        onChange={({ oldIndex, newIndex }) => onChange(arrayMove(items, oldIndex, newIndex))}
        renderList={({ children, props }) => (
          <ul {...props} className={clsx('w-full flex flex-col', className)}>
            {children}
          </ul>
        )}
        renderItem={({ value, props, index }) => (
          <div {...props} key={index} className="p-1 w-full flex items-center z-50 [&:hover>span]:opacity-100">
            <span data-movable-handle className="shrink-0 pr-1 flex justify-center items-center cursor-grab opacity-0">
              <IconGripVertical className="h-4 w-4 text-2" />
            </span>
            <div className="flex-1">{value.label}</div>
            <span className="px-1 flex justify-center items-center">
              {index === 0 ? (
                <div className="h-7 w-7 p-1" />
              ) : (
                <IconX
                  className="h-7 w-7 text-2 self-start p-1 cursor-pointer"
                  onClick={() => onChange(items.filter((item) => item !== value))}
                />
              )}
            </span>
          </div>
        )}
      />
      <span className="add-button" onClick={() => onChange([...items, addOption(items.length)])}>
        Ajouter {optionLabel}
      </span>
    </div>
  );
}
