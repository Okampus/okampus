import { IconChevronRight } from '@tabler/icons-react';
import type { SelectItem } from '@okampus/shared/types';

export type Choice<T> = { item: SelectItem<T>; prefix?: React.ReactNode };
export type ChoiceListProps<T> = { items: Choice<T>[]; onClick: (value: T) => void };

export default function ChoiceList<T>({ items, onClick }: ChoiceListProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      {items.map(({ item, prefix }, idx) => {
        return (
          <div
            key={idx}
            className="flex px-5 py-3 gap-6 text-[var(--text-0)] rounded-2xl cursor-pointer border border-[var(--border-2)] bg-[var(--bg-main)] hover:bg-[var(--bg-3)] items-center justify-between min-h-[5.5rem]"
            onClick={() => onClick(item.value)}
          >
            <div className="flex gap-4 items-center">
              {prefix}
              <div className="text-1 font-semibold text-xl line-clamp-1 tracking-tight">{item.label}</div>
            </div>
            <IconChevronRight className="w-10 aspect-square" />
          </div>
        );
      })}
    </div>
  );
}
