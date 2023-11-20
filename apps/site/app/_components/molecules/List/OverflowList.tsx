'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMount, useMeasure, usePrevious, useShallowCompareEffect, useUpdateEffect } from 'react-use';

type OverflowDirection = 'none' | 'grow' | 'shrink';

export interface OverflowListProps<T> {
  items: T[];
  itemRenderer: (item: T, index: number) => React.ReactNode;
  overflowRenderer?: (items: T[]) => React.ReactNode;
  minVisibleItems?: number;
  className?: string;
  alwaysRenderOverflow?: boolean;
}

type OverflowState<T> = { visible: T[]; overflow: T[]; lastOverflowCount: number; direction: OverflowDirection };

function DefaultOverflowRenderer<T>(items: T[]) {
  return <div className="ml-2">+ {items.length}</div>;
}

export default function OverflowList<T>({
  items,
  minVisibleItems = 0,
  className = '',
  alwaysRenderOverflow = false,
  overflowRenderer = DefaultOverflowRenderer,
  itemRenderer,
}: OverflowListProps<T>) {
  const [state, setState] = useState<OverflowState<T>>({
    visible: items,
    overflow: [],
    lastOverflowCount: 0,
    direction: 'none',
  });

  const spacer = useRef<HTMLDivElement>(null);

  useShallowCompareEffect(() => repartition(false), [state]);
  useMount(() => repartition(false));

  useUpdateEffect(() => {
    setState(() => ({ direction: 'none', lastOverflowCount: 0, overflow: [], visible: items }));
  }, [items]);

  const maybeOverflow = state.overflow.length === 0 && !alwaysRenderOverflow ? null : overflowRenderer(state.overflow);

  const repartition = useCallback(
    (growing: boolean) => {
      if (!spacer.current) return;

      if (growing) {
        const lastOverflowCount = state.direction === 'none' ? state.overflow.length : state.lastOverflowCount;
        setState({ direction: 'grow', lastOverflowCount, overflow: [], visible: items });
      } else if (spacer.current.getBoundingClientRect().width < 0.9) {
        setState((state) => {
          if (state.visible.length <= minVisibleItems) return state;

          const visible = [...state.visible];
          const next = visible.pop();

          if (!next) return state;
          const overflowing = [next, ...state.overflow];

          const direction = state.direction === 'none' ? 'grow' : state.direction;
          return { ...state, direction, overflow: overflowing, visible };
        });
      } else {
        setState((prevState) => ({ ...prevState, direction: 'none' }));
      }
    },
    [items, minVisibleItems, state],
  );

  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const previousWidth = usePrevious(width);

  useEffect(() => {
    if (!previousWidth) return;

    repartition(width > previousWidth);
  }, [width, previousWidth, repartition]);

  return (
    <div ref={ref} className={clsx(className, 'flex gap-2 flex-nowrap min-w-0')}>
      {state.visible.map(itemRenderer)}
      {maybeOverflow}
      <div style={{ flexShrink: 1, width: 1 }} ref={spacer} />
    </div>
  );
}
