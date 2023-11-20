import ActionWrapper from '../Wrapper/ActionWrapper';
import type { ActionProps } from '@okampus/shared/types';

export type ListColumnProps = {
  title: string;
  items: ActionProps[];
  count?: number;
  seeMore?: ActionProps;
};
export function ListColumn({ title, items, count, seeMore }: ListColumnProps) {
  return (
    <div className="flex flex-col gap-2.5 mb-4">
      <h3 className="font-medium text-2 px-2">
        {title} — {count ?? items.length}
      </h3>
      <div className="text-1">
        {items.map((action, idx) => (
          <ActionWrapper key={idx} {...action} />
        ))}
      </div>
      {seeMore && count && count > items.length && <ActionWrapper {...seeMore} />}
    </div>
  );
}
