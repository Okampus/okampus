import { CaretRight } from '@phosphor-icons/react/dist/ssr';
import type { SelectItem } from '@okampus/shared/types';

export type Choice<T> = { item: SelectItem<T>; prefix?: React.ReactNode };
export type ChoiceListProps<T> = { items: Choice<T>[]; onClick: (value: T) => void };

const itemClass =
  'flex items-center justify-between px-5 py-3 gap-6 rounded-2xl border border-[var(--border-2)] bg-[var(--bg-main)] hover:bg-[var(--bg-3)] min-h-[5.5rem]';

export default function ChoiceList<T>({ items, onClick }: ChoiceListProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      {items.map(({ item, prefix }, idx) => {
        return (
          <button key={idx} className={itemClass} onClick={() => onClick(item.value)}>
            <span className="flex gap-4 items-center">
              {prefix}
              <div className="text-1 font-semibold text-xl line-clamp-1 tracking-tight">{item.label}</div>
            </span>
            <CaretRight className="w-10 aspect-square" />
          </button>
        );
      })}
    </div>
  );
}
