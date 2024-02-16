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

import { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';

import type { ComboBoxItem, GetOptions } from '@okampus/shared/types';
import type { ElementRects, FloatingContext, Placement, ReferenceType } from '@floating-ui/react';
import type { HTMLProps, CSSProperties } from 'react';
import type { OnAddSearch } from '../_components/molecules/Input/Controlled/ComboBox/ComboBoxInput';

type SizeMiddlewareData = { rects: ElementRects; elements: { floating: HTMLElement }; availableHeight: number };

export type UseComboBoxConfigOptions<T, U> = {
  getOptions: GetOptions<T>;
  getOptionsKey: (search: string) => string | null;
  debounce?: number;
  onSearch?: (value: string) => void;
  maxHeight?: string;
  placement?: Placement;
  onAddSearch?: OnAddSearch<T, U>;
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
  setActiveIndex: (value: number | null) => void;
  handleOnAddSearch: (setSelected: (selected: T) => void) => void;
  onAddSearchContent?: React.ReactNode;
};

export function useComboBoxConfig<T, U>({
  maxHeight = '16rem',
  placement,
  onSearch,
  getOptions,
  getOptionsKey,
  debounce = 0,
  onAddSearch,
}: UseComboBoxConfigOptions<T, U>): UseComboBoxConfig<T> {
  const [onAddSearchContent, setOnAddSearchContent] = useState<React.ReactNode>(null);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const optionsFetcher =
    typeof getOptions === 'function'
      ? getOptions
      : () => getOptions.filter((option) => option.searchText.includes(search));

  const searchKey = useDebounce(getOptionsKey(search), debounce);
  const { data, isLoading, error } = useSWR(searchKey, optionsFetcher);

  const [options, setOptions] = useState<ComboBoxItem<T>[]>(data ?? []);
  useEffect(() => {
    if (data) setOptions(data);
  }, [data]);

  const sizeApply = ({ elements, rects, availableHeight }: SizeMiddlewareData) =>
    resize(elements.floating, onAddSearchContent ? null : maxHeight, availableHeight, `${rects.reference.width}px`);

  const middleware = [flip({ padding: 10 }), offset(5), size({ padding: 10, apply: sizeApply })];
  const floatingProps = {
    placement,
    open: isOpen,
    onOpenChange: (open: boolean) => {
      setIsOpen(open);
      if (!open && onAddSearchContent) setOnAddSearchContent(null);
    },
    whileElementsMounted: autoUpdate,
  };
  const { refs, floatingStyles, context } = useFloating({ ...floatingProps, middleware });

  const role = useRole(context, { role: 'listbox' });
  const dismiss = useDismiss(context, {});

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);
  const setListRef = (index: number) => (ref: HTMLElement | null) => (listRef.current[index] = ref);
  const listNavigationProps = { listRef, activeIndex, onNavigate: setActiveIndex, loop: true, virtual: true };
  const listNavigation = useListNavigation(context, listNavigationProps);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([role, dismiss, listNavigation]);

  const handleOnAddSearch = (setSelected: (selected: T) => void) => {
    if (!onAddSearch) return;

    'context' in onAddSearch
      ? setOnAddSearchContent(
          onAddSearch.render({
            search,
            context: onAddSearch.context,
            callback: (option: ComboBoxItem<T>) => {
              setOptions([option, ...options]);
              setSelected(option.value);
            },
          }),
        )
      : setOnAddSearchContent(
          onAddSearch.render({
            search,
            callback: (option: ComboBoxItem<T>) => {
              setOptions([option, ...options]);
              setSelected(option.value);
            },
          }),
        );
  };

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
    setActiveIndex,
    onAddSearchContent,
    handleOnAddSearch,
  };
}

export type HandleSelectOptions<T, Array extends boolean, U> = {
  search: string;
  options: ComboBoxItem<T>[];
  setOptions: (options: ComboBoxItem<T>[]) => void;
  selected: Array extends true ? T[] : T | undefined;
  setIsOpen: (value: boolean) => void;
  setSearch: (value: string) => void;
  setSelected: (value: Array extends true ? T : T | undefined) => void;
  setActiveIndex: (value: number | null) => void;
  onAddSearch?: OnAddSearch<T, U>;
};

export function handleSelect<T, U>(props: HandleSelectOptions<T, false, U>, idx: number) {
  const { options, selected, setSelected, setIsOpen, setSearch, setActiveIndex } = props;

  return () => {
    setSelected(selected === options[idx].value ? undefined : options[idx].value);
    setActiveIndex(null);
    setSearch('');
    setIsOpen(false);
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
