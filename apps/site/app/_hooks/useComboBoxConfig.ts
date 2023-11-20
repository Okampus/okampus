import { resize } from './useSelectConfig';

import useDebounce from './useDebounce';
import {
  autoUpdate,
  flip,
  offset,
  size,
  useFloating,
  useDismiss,
  useRole,
  useListNavigation,
  useInteractions,
} from '@floating-ui/react';

import { useState, useRef } from 'react';
import useSWR from 'swr';

import type { ComboBoxItem, GetOptions } from '@okampus/shared/types';
import type { ElementRects, FloatingContext, Placement, ReferenceType } from '@floating-ui/react';
import type { HTMLProps, CSSProperties } from 'react';
import type { OnAddSearch } from '../_components/molecules/Input/Controlled/ComboBox/ComboBoxInput';

type SizeMiddlewareData = { rects: ElementRects; elements: { floating: HTMLElement }; availableHeight: number };

export type UseComboBoxConfigOptions<T> = {
  getOptions: GetOptions<T>;
  getOptionsKey: (search: string) => string | null;
  debounce?: number;
  onSearch?: (value: string) => void;
  maxHeight?: string;
  placement?: Placement;
};

export type UseComboBoxConfig<T> = {
  refs: {
    reference: React.RefObject<ReferenceType>;
    floating: React.RefObject<ReferenceType>;
    setReference: (ref: HTMLElement | null) => void;
    setFloating: (ref: HTMLElement | null) => void;
  };
  options: ComboBoxItem<T>[];
  setOptions: (options: ComboBoxItem<T>[]) => void;
  loading: boolean;
  error: Error | null;
  setListRef: (index: number) => (ref: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  context: FloatingContext<ReferenceType>;
  getReferenceProps: (userProps?: HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
  getFloatingProps: (userProps?: HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
  getItemProps: (userProps?: HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  search: string;
  setSearch: (value: string) => void;
  activeIndex: number | null;
};

export function useComboBoxConfig<T>({
  maxHeight = '12rem',
  placement,
  onSearch,
  getOptions,
  getOptionsKey,
  debounce = 0,
}: UseComboBoxConfigOptions<T>): UseComboBoxConfig<T> {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const optionsFetcher =
    typeof getOptions === 'function'
      ? getOptions
      : () => getOptions.filter((option) => option.searchText.includes(search));

  const searchKey = useDebounce(getOptionsKey(search), debounce);
  const { data, isLoading, error } = useSWR(searchKey, optionsFetcher);

  const [options, setOptions] = useState<ComboBoxItem<T>[]>(data ?? []);

  const sizeApply = ({ elements, rects, availableHeight }: SizeMiddlewareData) =>
    resize(elements.floating, maxHeight, availableHeight, `${rects.reference.width}px`);

  const middleware = [flip({ padding: 10 }), offset(5), size({ padding: 10, apply: sizeApply })];
  const floatingProps = { placement, open: isOpen, onOpenChange: setIsOpen, whileElementsMounted: autoUpdate };
  const { refs, floatingStyles, context } = useFloating({ ...floatingProps, middleware });

  const role = useRole(context, { role: 'listbox' });
  const dismiss = useDismiss(context);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);
  const setListRef = (index: number) => (ref: HTMLElement | null) => (listRef.current[index] = ref);
  const listNavigationProps = { listRef, activeIndex, onNavigate: setActiveIndex, loop: true, virtual: true };
  const listNavigation = useListNavigation(context, listNavigationProps);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([role, dismiss, listNavigation]);

  return {
    refs,
    options,
    setOptions,
    loading: isLoading,
    error,
    search,
    setSearch: (value: string) => {
      setSearch(value);
      onSearch?.(value);
    },
    setListRef,
    floatingStyles,
    context,
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    isOpen,
    setIsOpen,
    activeIndex,
  };
}

export type HandleSelectOptions<T, Array extends boolean, U> = {
  search: string;
  options: ComboBoxItem<T>[];
  setOptions: (options: ComboBoxItem<T>[]) => void;
  selected: Array extends true ? T[] : T | undefined;
  setSelected: (value: Array extends true ? T : T | undefined) => void;
  onAddSearch?: OnAddSearch<T, U>;
};

export function handleSelect<T, U>(props: HandleSelectOptions<T, false, U>, idx: number) {
  const { search, options, setOptions, selected, setSelected, onAddSearch } = props;

  const callback = (option: ComboBoxItem<T>) => {
    setOptions([option, ...options]);
    setSelected(option.value);
  };

  return () => {
    if (idx === options.length && onAddSearch) {
      'context' in onAddSearch
        ? onAddSearch.render({ search, context: onAddSearch.context, callback })
        : onAddSearch.render({ search, callback });
    } else setSelected(selected === options[idx].value ? undefined : options[idx].value);
  };
}

export function handleSelectMulti<T, U>(
  { search, options, setSelected, setOptions, onAddSearch }: HandleSelectOptions<T, true, U>,
  idx: number,
) {
  const callback = (option: ComboBoxItem<T>) => {
    setOptions([option, ...options]);
    setSelected(option.value);
  };

  return () => {
    if (idx === options.length && onAddSearch) {
      'context' in onAddSearch
        ? onAddSearch.render({ search, context: onAddSearch.context, callback })
        : onAddSearch.render({ search, callback });
    } else {
      const value = options[idx].value;
      setSelected(value);
    }
  };
}
