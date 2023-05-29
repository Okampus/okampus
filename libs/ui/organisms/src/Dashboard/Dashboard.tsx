import { ReactComponent as SortArrowsFilledIcon } from '@okampus/assets/svg/icons/material/filled/sort-arrows.svg';
import { ReactComponent as UpFilledIcon } from '@okampus/assets/svg/icons/material/filled/arrow-up.svg';
import { ReactComponent as DownFilledIcon } from '@okampus/assets/svg/icons/material/filled/arrow-down.svg';

import { Align } from '@okampus/shared/enums';
import { Skeleton } from '@okampus/ui/atoms';
import { clsx } from 'clsx';
import React from 'react';

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

type SortColumn = { column?: number; direction?: 'asc' | 'desc' };

export function Dashboard<T extends object>({
  className,
  columns,
  data,
  nItems = 10,
  onElementClick,
}: DashboardProps<T>) {
  // eslint-disable-next-line unicorn/no-useless-undefined
  const arr = data ?? Array.from({ length: nItems }, () => undefined);
  const [sort, setSort] = React.useState<SortColumn>({ column: undefined, direction: undefined });

  return (
    <div className={clsx('relative max-h-full w-full scrollbar', className)}>
      <table className="text-2 table-auto w-max min-w-full">
        {/* Header */}
        <thead className="sticky top-0 bg-2">
          <tr>
            {columns.map((column, colIdx) => (
              <th key={colIdx} className={clsx('font-medium')}>
                <button
                  className={clsx(
                    'py-2.5 px-6 font-semibold flex items-center gap-2 w-full',
                    sort.column === colIdx && 'text-0',
                    column.align
                      ? column.align === Align.Center
                        ? 'justify-center'
                        : column.align === Align.Right
                        ? 'justify-end'
                        : 'justify-start'
                      : colIdx === 0
                      ? 'justify-start'
                      : colIdx === columns.length - 1
                      ? 'justify-end'
                      : 'justify-center'
                  )}
                  onClick={() =>
                    setSort((prev) => ({
                      column: prev.direction === 'desc' && prev.column === colIdx ? undefined : colIdx,
                      direction:
                        prev.column === colIdx && prev.direction === 'desc'
                          ? undefined
                          : prev.column === colIdx && prev.direction === 'asc'
                          ? 'desc'
                          : 'asc',
                    }))
                  }
                >
                  {column.label}
                  {sort.column === colIdx ? (
                    sort.direction === 'asc' ? (
                      <UpFilledIcon className="w-3 h-3" />
                    ) : (
                      <DownFilledIcon className="w-3 h-3" />
                    )
                  ) : (
                    <SortArrowsFilledIcon className="w-4 h-4" />
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        {/* Rows */}
        <tbody className="overflow-scroll scrollbar">
          {arr.map((row, rowIdx) => (
            <tr
              className={clsx('text-0 border-b border-color-1', onElementClick && 'bg-3-hover cursor-pointer')}
              key={rowIdx}
              onClick={() => row && onElementClick?.(row)}
            >
              {columns.map((column, colIdx) => (
                <td key={colIdx} className={clsx(rowIdx === 0 && 'pt-2', 'text-2')}>
                  <div
                    className={clsx(
                      'py-4 px-6 flex',
                      column.classes,
                      column.align
                        ? column.align === Align.Center
                          ? 'justify-center'
                          : column.align === Align.Right && 'justify-end'
                        : colIdx === columns.length - 1
                        ? 'justify-end'
                        : colIdx !== 0 && 'justify-center'
                    )}
                  >
                    {row === undefined ? column.skeleton ?? <Skeleton width="full" height={12} /> : column.render(row)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
