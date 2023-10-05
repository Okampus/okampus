'use client';

import Field from '../Field';
import TagList from '../../List/TagList';

import {
  useFloating,
  useDismiss,
  useRole,
  useListNavigation,
  useInteractions,
  FloatingFocusManager,
  flip,
  size,
  autoUpdate,
  FloatingPortal,
} from '@floating-ui/react';
import { Check } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { ControlledMultiSelect, SelectItem } from '@okampus/shared/types';

export type AutoCompleteInputProps<T> = {
  multiple?: boolean;
  search: string;
  onChangeSearch: (search: string) => void;
  onAddCurrentSearch?: (search: string) => SelectItem<T, true> | void;
  maxHeight?: string;
  contentClassName?: string;
  itemClassName?: string;
  triggerClassName?: string;
  showIcon?: boolean;
  suffix?: React.ReactNode;
} & ControlledMultiSelect<T, true>;

export default function AutoCompleteInput<T>({
  search,
  multiple = false,
  onChangeSearch,
  onAddCurrentSearch,
  placeholder = 'Votre choix',
  maxHeight: maxHeightProp = '14rem',
  contentClassName: contentClass = 'flex flex-col bg-0 text-0 cursor-pointer font-medium',
  itemClassName = 'flex items-center gap-4 px-4 py-2 bg-3-hover min-h-[var(--h-input)]',
  triggerClassName = 'w-full',
  showIcon = true,
  suffix,
  ...props
}: AutoCompleteInputProps<T>) {
  const { options, name, value, onChange, error, className, label, disabled, required, description } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const selected = useMemo(() => {
    const selectedArray: SelectItem<T, true>[] = [];
    if (multiple) {
      for (const val of value) {
        const item = options.find((choice) => choice.value === val);
        if (item) selectedArray.push(item);
      }
    } else {
      const item = options.find((choice) => choice.value === value[0]);
      if (item) selectedArray.push(item);
    }
    return selectedArray;
  }, [multiple, value, options]);

  const [selectedItems, setSelectedItems] = useState<SelectItem<T, true>[]>(selected);

  useEffect(() => {
    setSelectedItems(selected);
  }, [selected]);

  const sizeMiddleware = size({
    padding: 10,
    apply({ rects, elements: { floating }, availableHeight }) {
      const maxHeight = maxHeightProp ?? `${availableHeight}px`;
      Object.assign(floating.style, { maxHeight, minWidth: `${rects.reference.width}px` });
    },
  });

  const listElementRef = useRef<Array<HTMLElement | null>>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [flip({ padding: 10 }), sizeMiddleware],
  });

  const role = useRole(context, { role: 'listbox' });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef: listElementRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([role, dismiss, listNav]);

  const fieldProps = { label, className, name, description, required, error };

  const triggerProps = {
    tabIndex: 0,
    className: clsx(
      triggerClassName,
      'input min-h-[var(--h-input)] flex-wrap cursor-text',
      disabled && 'pointer-events-none opacity-50',
      error && '!border-[var(--danger)] !text-[var(--danger)]',
      suffix && '!pr-12 relative',
      selectedItems.length > 0 && '!py-1.5 !pl-1.5',
    ),
    ...getReferenceProps({
      ref: refs.setReference,
      onClick: () => {
        setIsOpen(true);
        setActiveIndex(0);
        setTimeout(() => inputRef.current?.focus(), 10);
      },
      onKeyDown(event) {
        if (event.key === 'Enter' && activeIndex != null && selectedItems[activeIndex]) {
          handleSelect(activeIndex);
          setActiveIndex(null);
          setIsOpen(false);
        }
      },
    }),
  };

  const inputProps = {
    'aria-autocomplete': 'list',
    className: 'grow tabular-nums text-[var(--text-0)] bg-[var(--bg-input)] min-w-[6rem] outline-none',
    ref: inputRef,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeSearch(event.target.value);
    },
    value: search,
    placeholder,
  } as const;

  const contentStyle = { ...floatingStyles, zIndex: 103, overflowY: 'auto' } as React.CSSProperties;
  const contentProps = {
    ref: refs.setFloating,
    className: clsx(contentClass, 'scrollbar rounded-lg'),
    style: contentStyle,
    ...getFloatingProps(),
  };

  // TODO: make pretty
  const handleSelect = (idx: number) => {
    if (onAddCurrentSearch && idx === options.length) {
      const item = onAddCurrentSearch(search);
      if (item) {
        if (multiple) {
          setSelectedItems([...selectedItems, item]);
          onChange?.([...value, item.value]);
        } else {
          setSelectedItems([item]);
          onChange?.([item.value]);
        }
      }
      setIsOpen(false);
    } else {
      const item = options[idx];
      if (multiple) {
        if (selectedItems.some((selectedItem) => selectedItem.value === item.value)) {
          setSelectedItems(selectedItems.filter((selectedItem) => selectedItem.value !== item.value));
          onChange?.(value.filter((val) => val !== item.value));
        } else {
          setSelectedItems([...selectedItems, item]);
          onChange?.([...value, item.value]);
        }
      } else if (selectedItems.length > 0 && selectedItems[0].value === item.value) {
        setSelectedItems([]);
        onChange?.([]);
      } else {
        setSelectedItems([item]);
        onChange?.([item.value]);
      }
      onChangeSearch('');
    }
    setIsOpen(false);
  };

  return (
    <>
      <Field {...fieldProps}>
        <div {...triggerProps}>
          <TagList
            className="w-full"
            tags={selectedItems.map((item) => ({
              content: item.label,
              onRemove: () => {
                const newSelected = selectedItems.filter(({ value }) => value !== item.value);
                setSelectedItems(newSelected);
                onChange(newSelected.map(({ value }) => value));
              },
            }))}
          >
            {multiple || selectedItems.length === 0 ? <input {...inputProps} /> : null}
          </TagList>
          {suffix && <div className="absolute right-3 top-3">{suffix}</div>}
        </div>
      </Field>
      <FloatingPortal>
        {isOpen && (
          <FloatingFocusManager context={context} initialFocus={-1} visuallyHiddenDismiss>
            <ul {...contentProps} role="listbox">
              {options.map(({ value, label }, idx) => {
                const style = { background: idx === activeIndex ? 'bg-3 opacity-100' : 'opacity-50' };
                const selected = selectedItems.some((item) => item.value === value);
                const onKeyDown = (event: React.KeyboardEvent) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSelect(idx);
                  }
                };

                return (
                  <li
                    key={idx}
                    ref={(node) => (listElementRef.current[idx] = node)}
                    tabIndex={idx === activeIndex ? 0 : -1}
                    aria-selected={selected}
                    role="option"
                    style={style}
                    className={itemClassName}
                    {...getItemProps({ onClick: () => handleSelect(idx), onKeyDown })}
                  >
                    {showIcon &&
                      multiple &&
                      (selected ? (
                        <div className="rounded bg-[var(--info)] h-6 w-6 flex items-center justify-center">
                          <Check aria-hidden className="text-white" />
                        </div>
                      ) : (
                        <div className="rounded border border-color-1 h-6 w-6" />
                      ))}
                    {label}
                    {showIcon && !multiple && selected && (
                      <Check aria-hidden className="h-6 w-6 bg-[var(--primary)] text-white p-0.5 rounded-[50%]" />
                    )}
                  </li>
                );
              })}

              {onAddCurrentSearch && (
                <li
                  ref={(node) => (listElementRef.current[options.length] = node)}
                  tabIndex={options.length === activeIndex ? 0 : -1}
                  aria-selected={false}
                  role="option"
                  className={itemClassName}
                  style={{ background: 'opacity-50' }}
                  {...getItemProps({
                    onClick: () => handleSelect(options.length),
                    onKeyDown: (event: React.KeyboardEvent) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleSelect(options.length);
                      }
                    },
                  })}
                >
                  Ajouter &quot;{search}&quot;
                </li>
              )}
            </ul>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
}
