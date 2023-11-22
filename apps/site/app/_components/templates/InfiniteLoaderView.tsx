'use client';

import { useIntersection } from '../../_hooks/useIntersection';

import { buildCursorUrl } from '../../../utils/build-cursor-url';
import { jsonFetcher } from '../../../utils/json-fetcher';

import { ArrowDown, CircleNotch } from '@phosphor-icons/react';
import { useEffect } from 'react';

import useSWRInfinite from 'swr/infinite';

import type { Cursor } from '../../../types/cursor.type';
import type { PrismaSerialize } from '../../../utils/prisma-serialize';

type BaseEntity = { id: bigint };

export type InfiniteLoaderViewProps<T extends BaseEntity> = {
  render: (data: PrismaSerialize<T>) => React.ReactNode;
  endpoint: string;
  domain: string;
  take?: number;
};
export default function InfiniteLoaderView<U extends BaseEntity>({
  render,
  endpoint,
  domain,
  take = 6,
}: InfiniteLoaderViewProps<U>) {
  const {
    data: cursors,
    size,
    setSize,
    isValidating,
    isLoading,
  } = useSWRInfinite<Cursor<PrismaSerialize<U>>>(
    (pageIndex, previousData: Cursor<PrismaSerialize<U>>) => {
      if (previousData?.hasNextPage === false) return null;
      const lastData = previousData?.data.at(-1);
      const cursorUrl = buildCursorUrl({ domain, endpoint, take, cursor: lastData?.id });
      return cursorUrl;
    },
    jsonFetcher,
    { revalidateFirstPage: false },
  );

  const data = cursors ? cursors.flatMap(({ data }) => data) : [];
  const isLoadingMore = isLoading || (size > 0 && cursors && typeof cursors[size - 1] === 'undefined');
  const hasNextPage = cursors?.at(-1)?.hasNextPage ?? true;
  const isRefreshing = isValidating && cursors && cursors.length === size;

  const [intersecting, ref] = useIntersection<HTMLDivElement>();

  useEffect(() => {
    if (intersecting && !isValidating && hasNextPage) setSize((size) => size + 1);
  }, [intersecting, isValidating, setSize, hasNextPage]);

  return (
    <div>
      <div className="column-layout">{data.map(render)}</div>
      <div ref={ref} className="h-[8rem] shrink-0 flex justify-center items-center w-full text-0">
        {isRefreshing || isLoadingMore ? (
          <CircleNotch size={48} className="animate-spin" />
        ) : hasNextPage ? (
          <ArrowDown size={48} />
        ) : (
          'Fin du fil.'
        )}
      </div>
    </div>
  );
}
