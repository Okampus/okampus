import { clsx } from 'clsx';
import { useState } from 'react';

// TODO: improve next/previous page buttons (change page switching approach?), add animation

export type PaginationSwiperProps<T> = {
  className?: string;
  header?: React.ReactNode;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  grid: [number, number];
};

export function PaginationSwiper<T>({ className, items, renderItem, grid, header }: PaginationSwiperProps<T>) {
  const [page, setPage] = useState(0);

  return (
    <div className={clsx('px-3 py-2.5 rounded-2xl flex flex-col gap-3', className)}>
      {header && <div>{header}</div>}
      <div
        className="relative grid gap-4"
        style={{
          gridTemplateRows: `repeat(${grid[0]}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${grid[1]}, minmax(0, 1fr))`,
        }}
      >
        {page > 0 && (
          <div
            className="bg-white/30 shadow cursor-pointer absolute -translate-y-[50%] top-[50%] -left-1 rounded-[50%] p-1"
            onClick={() => setPage(page - 1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        )}

        {items.slice(page * grid[0] * grid[1], (page + 1) * grid[0] * grid[1]).map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}

        {page < Math.ceil(items.length / (grid[0] * grid[1])) - 1 && (
          <div
            className="bg-white/30 shadow cursor-pointer absolute -translate-y-[50%] top-[50%] -right-1 rounded-[50%] p-1"
            onClick={() => setPage(page + 1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
