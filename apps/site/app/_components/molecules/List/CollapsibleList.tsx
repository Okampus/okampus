import LinkItem from '../../atoms/Item/LinkItem';
import { CaretUp, CaretDown } from '@phosphor-icons/react/dist/ssr';

import clsx from 'clsx';

import type { LinkItemProps } from '@okampus/shared/types';

export type CollapsibleListProps = {
  open: boolean;
  onToggle: (open: boolean) => void;
  label: string;
  items: LinkItemProps[];
  className?: string;
};
export default function CollapsibleList({ open, onToggle, label, items, className = 'pt-4' }: CollapsibleListProps) {
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between px-3 py-2 bg-[var(--primary)] text-white">
        <span className="text-sm font-semibold">{label}</span>
        <button
          className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-[var(--primary)]"
          onClick={() => onToggle(!open)}
        >
          {open ? <CaretUp className="w-4 h-4" /> : <CaretDown className="w-4 h-4" />}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-1">
          {items.map((item, i) => (
            <LinkItem key={i} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
