import { Align } from '@okampus/shared/enums';
import { clsx } from 'clsx';
import React from 'react';

type Column<T> = {
  label: string;
  align?: Align;
  classes?: string;
  sortable?: boolean;
  sort?: (a: T, b: T) => number;
  render: (value: T) => React.ReactNode;
};

type DashboardProps<T extends object> = {
  columns: Column<T>[];
  data: T[];
};

export function Dashboard<T extends object>({ columns, data }: DashboardProps<T>) {
  return (
    <div className="h-full">
      <div className="bg-gradient-to-r from-[#FC466B] to-[#3F5EFB] w-full h-[0.5rem] rounded-t-lg" />
      <div className="max-h-[calc(100%-0.5rem)] w-full overflow-scroll scrollbar border border-color-1 rounded-b-lg !border-opacity-40">
        <table className="text-2 table-auto w-max min-w-full">
          {/* Header */}
          <thead>
            <tr className="text-1 bg-1">
              {columns.map((column, colIdx) => (
                <th
                  key={colIdx}
                  className={clsx(
                    'py-3 px-4 font-medium',
                    column.align
                      ? column.align === Align.Center
                        ? 'text-center'
                        : column.align === Align.Right
                        ? 'text-right'
                        : 'text-left'
                      : colIdx === 0
                      ? 'text-left'
                      : colIdx === columns.length - 1 && 'text-right'
                  )}
                >
                  <h4>{column.label}</h4>
                </th>
              ))}
            </tr>
          </thead>
          {/* Rows */}
          <tbody>
            {data.map((row, rowIdx) => (
              <tr className="border-t border-color-3 px-3 bg-0 text-0" key={rowIdx}>
                {columns.map((column, colIdx) => (
                  <td key={colIdx}>
                    <div
                      className={clsx(
                        'py-3 px-4 flex',
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
                      {column.render(row)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
