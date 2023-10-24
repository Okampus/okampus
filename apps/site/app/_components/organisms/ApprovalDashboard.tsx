import TextInput from '../molecules/Input/TextInput';
import SidebarLayout from '../atoms/Layout/SidebarLayout';
import { useMemo, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';

import clsx from 'clsx';
import type { SelectItem } from '@okampus/shared/types';

export type ApprovalDashboardProps<T, U> = {
  className?: string;
  items: T[];
  states: SelectItem<U>[];
  renderItem: (item: T) => React.ReactNode;
  renderSelected: (item: T) => React.ReactNode;
  renderHeader: (item: T) => React.ReactNode;
  searchFilter?: (item: T, search: string) => boolean;
  stateFilter?: (item: T, states: U[]) => boolean;
  emptyState?: React.ReactNode;
};
export default function ApprovalDashboard<T, U>({
  className,
  items,
  states,
  renderItem,
  renderSelected,
  renderHeader,
  searchFilter,
  stateFilter,
  emptyState,
}: ApprovalDashboardProps<T, U>) {
  const [selectedApproval, setSelectedApproval] = useState<T | null>(null);
  const [selectedStates, setSelectedStates] = useState<U[]>([]);
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (
          selectedStates.length > 0 &&
          selectedStates.length !== states.length &&
          stateFilter &&
          !stateFilter(item, selectedStates)
        )
          return false;

        if (query && searchFilter && !searchFilter(item, query)) return false;

        return true;
      }),
    [items, query, searchFilter, selectedStates, states.length, stateFilter],
  );

  const counts = useMemo(
    () =>
      Object.fromEntries(
        states.map((state) => [
          state.value,
          items.filter((item) => stateFilter && stateFilter(item, [state.value])).length,
        ]),
      ),
    [items, stateFilter, states],
  );

  return (
    <SidebarLayout
      className={className}
      closeContent={() => setSelectedApproval(null)}
      emptyState={emptyState}
      contentHeader={selectedApproval && renderHeader(selectedApproval)}
      sidebar={
        <div className="h-full py-2 md:p-2 flex flex-col gap-2">
          <ul className="flex flex-wrap gap-x-2">
            {states.map((state, idx) => (
              <li
                key={idx}
                onClick={() => setSelectedStates([state.value])}
                className={clsx(
                  'flex items-center gap-2 p-2 rounded-lg bg-1-hover cursor-pointer',
                  selectedStates.length === 1 && selectedStates[0] === state.value ? 'bg-1 opacity-100' : 'opacity-50',
                )}
              >
                <span>{state.label}</span>
                <span className="h-6 px-1.5 bg-3 rounded-md">{counts[state.value]}</span>
              </li>
            ))}
            <li
              onClick={() => setSelectedStates(states.map((state) => state.value))}
              className={clsx(
                'flex items-center gap-2 p-2 rounded-lg bg-1-hover cursor-pointer',
                selectedStates.length === 0 ? 'bg-1 opacity-100' : 'opacity-50',
              )}
            >
              <span>Tout</span>
              <span className="h-6 px-1.5 bg-3 rounded-md">{items.length}</span>
            </li>
          </ul>
          {searchFilter && (
            <TextInput
              name="search"
              startContent={<MagnifyingGlass className="text-[var(--text-2)] mr-2" />}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher..."
            />
          )}
          {/* {stateFilter && (
              <SimpleFilterInput types={filterItems} selected={selectedStates} setSelected={setSelectedStates} />
            )} */}
          <ul className="h-full overflow-y-scroll overflow-x-hidden scrollbar">
            {filteredItems.map((item, idx) => (
              <li
                key={idx}
                onClick={() => setSelectedApproval(item)}
                className="p-2 rounded-lg bg-1-hover cursor-pointer"
              >
                {renderItem(item)}
              </li>
            ))}
          </ul>
        </div>
      }
      content={selectedApproval && <div className="p-5">{renderSelected(selectedApproval)}</div>}
    />
  );
}
