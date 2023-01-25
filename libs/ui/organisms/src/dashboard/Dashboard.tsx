import { fuseClasses } from '@okampus/shared/utils';
import React from 'react';

type Column<T> = {
  label: string;
  center?: boolean;
  classes?: string;
  sortable?: boolean;
  sort?: (a: T, b: T) => number;
  render: (value: T) => JSX.Element;
};

type DashboardProps<T extends object> = {
  columns: Column<T>[];
  data: T[];
};

export function Dashboard<T extends object>({ columns, data }: DashboardProps<T>) {
  return (
    <div className="max-h-full w-full overflow-scroll app-scrollbar border bc-2 rounded-lg">
      <table className="text-2 table-auto w-max min-w-full">
        {/* Header */}
        <thead>
          <tr className="text-1">
            {columns.map((column, colIdx) => (
              <th key={colIdx} className={fuseClasses('py-3 px-4 font-medium', column.center ? '' : 'text-left')}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        {/* Rows */}
        <tbody>
          {data.map((row, rowIdx) => (
            <tr className="border-t bc-3 px-3" key={rowIdx}>
              {columns.map((column, colIdx) => (
                <td key={colIdx} className={fuseClasses('py-3 px-4', column.classes)}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
