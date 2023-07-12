import { ReactComponent as ChevronRightFilled } from '@okampus/assets/svg/icons/material/filled/chevron-right.svg';
import type { SelectItem } from '@okampus/shared/types';

export type Choice = { item: SelectItem<string | null>; prefix?: React.ReactNode };
export type ChoiceListProps = { items: Choice[]; onClick: (value: string | null) => void };

export function ChoiceList({ items, onClick }: ChoiceListProps) {
  return (
    <div className="flex flex-col gap-3">
      {items.map(({ item, prefix }, idx) => {
        return (
          <div
            key={idx}
            className="item-card items-center justify-between min-h-[5.5rem]"
            onClick={() => onClick(item.value)}
          >
            <div className="flex gap-4 items-center">
              {prefix}
              <div className="text-1 font-semibold text-xl line-clamp-1 tracking-tight">{item.label}</div>
            </div>
            <ChevronRightFilled className="w-10 aspect-square" />
          </div>
        );
      })}
    </div>
  );
}
