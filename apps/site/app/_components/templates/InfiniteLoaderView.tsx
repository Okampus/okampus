'use client';

import { useIntersection } from '../../_hooks/useIntersection';

import { buildCursorUrl } from '../../../utils/build-cursor-url';
import { jsonFetcher } from '../../../utils/json-fetcher';

import { CircleNotch } from '@phosphor-icons/react';
import { useEffect } from 'react';

import useSWRInfinite from 'swr/infinite';

import type { Cursor } from '../../../types/cursor.type';
import type { PrismaSerialize } from '../../../utils/prisma-serialize';

type BaseEntity = { id: bigint };

export type InfiniteLoaderProps<T extends BaseEntity> = {
  render: (data: PrismaSerialize<T>) => React.ReactNode;
  endpoint: string;
  domain: string;
  take?: number;
};
export default function InfiniteLoader<U extends BaseEntity>({
  render,
  endpoint,
  domain,
  take = 6,
}: InfiniteLoaderProps<U>) {
  const {
    data: cursors,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading,
  } = useSWRInfinite<Cursor<PrismaSerialize<U>>>((_, previousData: Cursor<PrismaSerialize<U>> | undefined) => {
    const lastData = previousData?.data.at(-1);
    return buildCursorUrl({ domain, endpoint, take, cursor: lastData?.id });
  }, jsonFetcher);

  const data = cursors ? cursors.flatMap(({ data }) => data) : [];
  const isLoadingMore = isLoading || (size > 0 && cursors && typeof cursors[size - 1] === 'undefined');
  const isReachingEnd = !cursors?.at(-1)?.hasNextPage;
  const isRefreshing = isValidating && cursors && cursors.length === size;

  const [intersecting, ref] = useIntersection<HTMLDivElement>();

  useEffect(() => {
    if (intersecting && !isValidating && !isReachingEnd) {
      setSize((size) => size + 1);
    }
  }, [intersecting, isValidating, setSize, isReachingEnd]);

  return (
    <div className="flex flex-col justify-start items-center">
      <div className="flex flex-col gap-3">{data.map((data) => render(data as PrismaSerialize<U>))}</div>

      <div ref={ref} className="h-[100px] shrink-0 flex justify-center items-center w-full text-0">
        {isRefreshing || isLoadingMore ? (
          <CircleNotch size={48} className="animate-spin" />
        ) : isReachingEnd ? (
          'Fin du fil.'
        ) : null}
      </div>
    </div>
  );
}
