import {
  autoUpdate,
  flip,
  offset,
  size,
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useTypeahead,
  useInteractions,
} from '@floating-ui/react';
import { useState, useRef, useMemo } from 'react';

import type { SelectItem } from '@okampus/shared/types';
import type { ElementRects, FloatingContext, Placement, ReferenceType } from '@floating-ui/react';
import type { HTMLProps, CSSProperties } from 'react';

type SizeMiddlewareData = { rects: ElementRects; elements: { floating: HTMLElement }; availableHeight: number };
export const resize = (element: HTMLElement, maxHeight: string, availableHeight: number, width: string) => {
  Object.assign(element.style, { maxHeight: maxHeight ?? `${availableHeight}px`, minWidth: `${width}px` });
};
export type UseSelectConfigOptions<T, Cancellable, Array> = {
  value: Array extends true ? T[] : T | undefined;
  onSelected: (value: Cancellable extends true ? T | undefined : T) => void;
  options: SelectItem<T>[];
  maxHeight?: string;
  placement?: Placement;
  onBlur?: () => void;
};

type UseSelectConfig<T> = {
  refs: {
    reference: React.RefObject<ReferenceType>;
    floating: React.RefObject<ReferenceType>;
    setReference: (ref: HTMLElement | null) => void;
    setFloating: (ref: HTMLElement | null) => void;
  };
  setListRef: (index: number) => (ref: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  context: FloatingContext<ReferenceType>;
  getReferenceProps: (userProps?: HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
  getFloatingProps: (userProps?: HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
  getItemProps: (userProps?: HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
  handleSelect: (index: number) => void;
  isOpen: boolean;
  activeIndex: number | null;
  searchableOptions: (SelectItem<T> & { searchText: string })[];
};

export function useSelectConfig<T, Cancellable, Array>({
  value,
  options,
  maxHeight = '12rem',
  placement,
  onSelected,
  onBlur,
}: UseSelectConfigOptions<T, Cancellable, Array>): UseSelectConfig<T> {
  const searchableOptions = useMemo(
    () => options.map((option) => ({ ...option, searchText: JSON.stringify(option) })),
    [options],
  );

  // Floating configuration
  const [isOpen, setIsOpen] = useState(false);
  const sizeApply = ({ elements, rects, availableHeight }: SizeMiddlewareData) =>
    resize(elements.floating, maxHeight, availableHeight, `${rects.reference.width}px`);

  const middleware = [flip({ padding: 10 }), offset(5), size({ padding: 10, apply: sizeApply })];
  const floatingProps = { placement, open: isOpen, onOpenChange: setIsOpen, whileElementsMounted: autoUpdate };

  const { refs, floatingStyles, context } = useFloating({ ...floatingProps, middleware });

  // Custom interactions configuration
  const click = useClick(context, { event: 'mousedown' });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'listbox' });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const selectedIndex = options.findIndex((choice) => choice.value === value);

  // List navigation configuration
  const listRef = useRef<(HTMLElement | null)[]>([]);
  const setListRef = (index: number) => (ref: HTMLElement | null) => (listRef.current[index] = ref);
  const listNavigationProps = { listRef, activeIndex, selectedIndex, onNavigate: setActiveIndex, loop: true };
  const listNavigation = useListNavigation(context, listNavigationProps);

  const handleSelect = (index: number) => {
    const item = searchableOptions[index];
    onSelected(item.value);
    setIsOpen(false);
    onBlur?.();
  };

  // Typeahead configuration
  const typeaheadListRef = useRef(searchableOptions.map(({ searchText }) => searchText));
  const onMatch = isOpen ? setActiveIndex : (index: number) => handleSelect(index);
  const typeahead = useTypeahead(context, { listRef: typeaheadListRef, activeIndex, selectedIndex, onMatch });

  // Handle interactions
  const interactions = [click, dismiss, role, listNavigation, typeahead];
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(interactions);

  return {
    refs,
    setListRef,
    floatingStyles,
    context,
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    isOpen,
    activeIndex,
    handleSelect,
    searchableOptions,
  };
}
