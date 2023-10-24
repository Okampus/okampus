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

type DashboardProps<T extends object> = {
  className?: string;
  columns: Column<T>[];
  data: T[] | undefined;
  nItems?: number;
  onElementClick?: (element: T) => void;
};

type SortColumn = { column?: number; direction?: Sort };
const alignClassMap: { [key in Align]: 'justify-start' | 'justify-center' | 'justify-end' } = {
  [Align.Left]: 'justify-start',
  [Align.Right]: 'justify-end',
  [Align.Center]: 'justify-center',
};

const baseButtonClass = 'py-2.5 px-6 font-semibold flex items-center gap-2 w-full';
const baseRowClass = 'table-row text-0 border-b border-[var(--border-light)]';

export default function Dashboard<T extends object>({
  className,
  columns,
  data,
  nItems = 10,
  onElementClick,
}: DashboardProps<T>) {
  // eslint-disable-next-line unicorn/no-useless-undefined
  const arr = data ?? Array.from({ length: nItems }, () => undefined);
  const [sort, setSort] = React.useState<SortColumn>({ column: undefined, direction: undefined });

  const toggleSort = (idx: number) => {
    setSort(({ column: previousColumn, direction: previousSort }) => {
      const column = previousSort === Sort.Desc && previousColumn === idx ? undefined : idx;
      let direction;
      if (!previousSort || column !== previousColumn) direction = Sort.Asc;
      else if (previousSort === Sort.Asc) direction = Sort.Desc;

      return { column, direction };
    });
  };

  const getAlignClass = (column: Column<T>, colIdx: number) => {
    if (column.align) return alignClassMap[column.align];
    if (colIdx === 0) return 'justify-start';
    if (colIdx === columns.length - 1) return 'justify-end';
    return 'justify-center';
  };

  return (
    <div className={clsx('relative max-h-[calc(100%-1rem)] w-full scrollbar', className)}>
      <table className="text-2 table table-auto w-max min-w-full">
        {/* Header */}
        <thead className="sticky top-0 bg-2 z-40">
          <tr>
            {columns.map((column, colIdx) => {
              let sortIcon = ' ↕';
              if (sort.column === colIdx) sortIcon = sort.direction === Sort.Asc ? ' ↑' : ' ↓';

              const sortClass = sort.column === colIdx ? 'text-0' : 'text-2';
              const className = clsx(baseButtonClass, sortClass, getAlignClass(column, colIdx));
              return (
                <th key={colIdx} className="font-medium">
                  <button className={className} onClick={() => toggleSort(colIdx)}>
                    {column.label}
                    {sortIcon}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        {/* Rows */}
        <tbody className="overflow-x-scroll scrollbar">
          {arr.map((row, rowIdx) => {
            const className = clsx(baseRowClass, onElementClick && 'bg-3-hover cursor-pointer');
            return (
              <tr key={rowIdx} className={className} onClick={() => row && onElementClick?.(row)}>
                {columns.map((column, colIdx) => {
                  const rowClass = rowIdx === 0 ? 'pt-4 pb-2' : 'py-2';
                  const className = clsx('text-2 flex px-3', column.classes, rowClass, getAlignClass(column, colIdx));

                  return (
                    <td key={colIdx}>
                      <div className={className}>
                        {row ? column.render(row) : column.skeleton ?? <Skeleton className="w-full h-6" />}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
