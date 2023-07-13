import type { JSONType } from '@okampus/shared/types';

export function toCsv<T>(data: T[], columns: { label: string; data: (item: T) => JSONType }[]) {
  const header = columns.map((column) => column.label).join(',');
  const rows = data.map((item) => {
    const row = columns.map((column) => {
      const value = column.data(item);
      return typeof value === 'string' ? value : JSON.stringify(value);
    });
    return row.join(',');
  });
  return [header, ...rows].join('\n');
}
