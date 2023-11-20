'use client';

import Skeleton from '../atoms/Skeleton/Skeleton';
import { Align, Sort } from '@okampus/shared/enums';

import clsx from 'clsx';
import React from 'react';

// TODO: add grouping rows.

export type Column<T> = {
  label: React.ReactNode;
  align?: Align;
  classes?: string;
  sortable?: boolean;
  sort?: (a: T, b: T) => number;
  render: (value: T) => React.ReactNode;
  skeleton?: React.ReactNode;
};

type DatagridProps<T extends object> = {
  className?: string;
  columns: Column<T>[];
  data: T[] | undefined;
  nItems?: number;
  renderSelectedElement?: (element: T) => React.ReactNode;
};

type SortColumn = { column?: number; direction?: Sort };

export default function Datagrid<T extends object>({
  className,
  columns,
  data,
  nItems = 10,
  renderSelectedElement,
}: DatagridProps<T>) {
  // eslint-disable-next-line unicorn/no-useless-undefined
  const arr = data ?? Array.from({ length: nItems }, () => undefined);
  const [sort, setSort] = React.useState<SortColumn>({ column: undefined, direction: undefined });
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

  const toggleSort = (idx: number) => {
    setSort(({ column: previousColumn, direction: previousSort }) => {
      const column = previousSort === Sort.Desc && previousColumn === idx ? undefined : idx;
      let direction;
      if (!previousSort || column !== previousColumn) direction = Sort.Asc;
      else if (previousSort === Sort.Asc) direction = Sort.Desc;

      return { column, direction };
    });
  };

  return (
    <div className={clsx('relative w-full scrollbar', className)}>
      <table className="w-full table-auto border-separate border-spacing-0">
        {/* Header */}
        <thead className="sticky top-0 z-20 border-[var(--border-1)]">
          <tr>
            {columns.map((column, colIdx) => {
              let sortIcon = '';
              if (sort.column === colIdx) sortIcon = sort.direction === Sort.Asc ? ' ↑' : ' ↓';

              const sortClass = sort.column === colIdx ? 'text-0' : 'text-2';
              const className = clsx(
                sortClass,
                'p-3 text-left whitespace-nowrap overflow-ellipsis uppercase text-sm border-y border-[var(--border-1)] bg-[var(--bg-main)]',
                colIdx !== columns.length - 1 && 'border-r',
              );
              return (
                <th key={colIdx} className={className} onClick={() => toggleSort(colIdx)}>
                  {column.label}
                  {sortIcon}
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Rows */}
        <tbody className="overflow-x-scroll scrollbar">
          {arr.map((row, rowIdx) => {
            const className = clsx('text-0', renderSelectedElement && 'hover:bg-[var(--bg-1)] cursor-pointer');
            const rowInner = (
              <tr
                key={rowIdx}
                className={className}
                onClick={() => (selectedIdx === rowIdx ? setSelectedIdx(null) : setSelectedIdx(rowIdx))}
              >
                {columns.map((column, colIdx) => {
                  const className = clsx(
                    'p-4 whitespace-nowrap overflow-ellipsis border-b border-[var(--border-1)]',
                    column.classes,
                    colIdx !== columns.length - 1 && 'border-r',
                  );

                  return (
                    <td key={colIdx} className={className}>
                      {row ? column.render(row) : column.skeleton ?? <Skeleton className="w-full h-6" />}
                    </td>
                  );
                })}
              </tr>
            );

            return selectedIdx === rowIdx && renderSelectedElement ? (
              <>
                {rowInner}
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-6 px-16 bg-[var(--bg-1)] border-t border-b-2 border-[var(--border-1)]"
                  >
                    {row ? renderSelectedElement(row) : <Skeleton className="w-full h-6" />}
                  </td>
                </tr>
              </>
            ) : (
              rowInner
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
