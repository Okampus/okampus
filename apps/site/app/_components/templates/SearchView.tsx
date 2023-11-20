'use client';

import SearchInput from '../molecules/Input/Other/SearchInput';
import clsx from 'clsx';
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

import type { ComboBoxItem } from '@okampus/shared/types';

export type SearchViewProps<T> = {
  options: Omit<ComboBoxItem<T>, 'value'>[];
  emptyState: React.ReactNode;
  className?: string;
  innerClassName?: string;
  innerWrapper?: ({ children, className }: { children: React.ReactNode; className?: string }) => React.ReactNode;
};

export function SearchView<T>({ options, emptyState, className, innerClassName, innerWrapper }: SearchViewProps<T>) {
  const [search, setSearch] = useState('');

  const fuse = useMemo(
    () => new Fuse(options, { keys: ['searchText'], ignoreLocation: true, threshold: 0.3 }),
    [options],
  );

  const filteredOptions = useMemo(
    () => (search ? fuse.search(search).map((result) => result.item) : options),
    [fuse, options, search],
  );

  if (!options || (Array.isArray(options) && options.length === 0)) return emptyState;

  const inner = filteredOptions.map((option) => option.label);

  return (
    <div className={clsx(className, 'flex flex-col')}>
      <div className="stick-to-top bg-[var(--bg-main)]">
        <SearchInput className="my-4" value={search} onChange={setSearch} />
      </div>
      {innerWrapper ? (
        innerWrapper({ children: inner, className: innerClassName })
      ) : (
        <div className={innerClassName}>{inner}</div>
      )}
    </div>
  );
}
