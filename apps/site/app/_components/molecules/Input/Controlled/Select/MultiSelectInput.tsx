'use client';

import { selectContentClass, selectItemClass, selectTriggerClass } from './SelectInput';

import Field from '../../Field';
import TagList from '../../../List/TagList';

import { useSelectConfig } from '../../../../../_hooks/useSelectConfig';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { CaretDown, CaretUp, Check, Circle } from '@phosphor-icons/react';

import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';

import type { ControlledMultiSelect, SelectItem } from '@okampus/shared/types';
import type { Placement } from '@floating-ui/react';
import type { BaseSyntheticEvent } from 'react';

export type MultiSelectInputProps<T> = ControlledMultiSelect<T> & {
  maxHeight?: string;
  hideArrow?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  itemActiveClassName?: string;
  showIcon?: boolean;
  placement?: Placement;
  onBlur?: () => void;
};

export type MultiSelectInnerProps<T> = {
  props: MultiSelectInputProps<T>;
  value: T[];
  onChange: (value: T[]) => void;
};

const selectKeys = new Set(['Enter', ' ']);
function MultiSelectInner<T>({ props, value, onChange }: MultiSelectInnerProps<T>) {
  const { hideArrow, options, name, error, disabled, maxHeight, placement, onBlur, placeholder } = props;

  const selected = useMemo(() => {
    const selected: SelectItem<T>[] = [];
    for (const selectedValue of value) {
      const item = options.find((choice) => choice.value === selectedValue);
      if (item) selected.push(item);
    }
    return selected;
  }, [options, value]);

  useEffect(() => {
    for (const selectedValue of value) {
      const item = options.find((choice) => choice.value === selectedValue);
      if (item) selected.push(item);
    }
  }, [options, selected, value]);

  const [selectedItems, setSelectedItems] = useState<SelectItem<T>[]>(selected);
  const [lastValue, setLastValue] = useState<T | undefined>(selected.at(-1)?.value);

  const onSelected = (value: T) => {
    const item =
      !selectedItems.some((choice) => choice.value === value) && options.find((choice) => choice.value === value);
    if (item) {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
      onChange(newSelectedItems.map((item) => item.value));
      setLastValue(value);
    }
  };

  const { refs, setListRef, context, getReferenceProps, getFloatingProps, getItemProps, isOpen, ...selectConfig } =
    useSelectConfig({ value: lastValue, options, maxHeight, placement, onSelected, onBlur });

  const triggerClass = clsx(selectTriggerClass, props.triggerClassName, isOpen && 'active', error && 'invalid');
  const triggerProps = { name, tabIndex: 0, className: triggerClass, ...getReferenceProps() };

  const style = { ...selectConfig.floatingStyles, zIndex: 103, overflowY: 'auto' } as React.CSSProperties;
  const contentProps = { className: clsx(props.contentClassName, selectContentClass), style, ...getFloatingProps() };

  const buttonInner: React.ReactNode =
    selectedItems.length > 0 ? (
      <TagList
        tags={selectedItems.map((item) => ({
          content: item.label,
          onRemove: () => setSelectedItems(selectedItems.filter(({ value }) => value !== item.value)),
        }))}
      />
    ) : (
      placeholder
    );

  return (
    <Field {...props}>
      <button ref={refs.setReference} {...triggerProps} disabled={disabled}>
        {buttonInner}
        {!hideArrow && (isOpen ? <CaretUp className="w-4 h-4" /> : <CaretDown className="w-4 h-4" />)}
      </button>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <ul {...contentProps} ref={refs.setFloating} role="listbox">
              {selectConfig.searchableOptions.map(({ value, label, searchText }, idx) => {
                const select = (event: BaseSyntheticEvent) => {
                  event.preventDefault();
                  selectConfig.handleSelect(idx);
                };

                const selected = selectedItems.some((item) => item.value === value);
                const active = selectConfig.activeIndex === idx;

                const className = clsx(props.itemClassName, selectItemClass, active && props.itemActiveClassName);

                const onKeyDown = (event: React.KeyboardEvent) => selectKeys.has(event.key) && select(event);
                const itemProps = { ...getItemProps({ onClick: select, onKeyDown }), className };
                const a11yProps = { 'aria-selected': selected, 'aria-label': searchText, role: 'option' };
                return (
                  <li key={searchText} tabIndex={active ? 0 : -1} ref={setListRef(idx)} {...a11yProps} {...itemProps}>
                    {label}
                    {props.showIcon && selected ? (
                      <Check aria-hidden className="h-5 w-5 bg-[var(--primary)] text-white p-0.5 rounded-[50%]" />
                    ) : (
                      <Circle aria-hidden className="h-5 w-5 bg-[var(--primary)] text-white p-0.5" />
                    )}
                  </li>
                );
              })}
            </ul>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </Field>
  );
}

export default function MultiSelectInput<T>({
  placeholder = 'Votre choix',
  maxHeight = '12rem',
  contentClassName = 'flex flex-col',
  itemClassName = 'flex items-center gap-2 p-2 bg-3-hover cursor-pointer min-h-[var(--h-input)]',
  itemActiveClassName = 'bg-3',
  triggerClassName = 'input max-h-[var(--h-input)] w-full',
  showIcon = true,
  placement = 'bottom-start',
  onBlur,
  ...otherProps
}: MultiSelectInputProps<T>) {
  const props = {
    ...otherProps,
    placeholder,
    maxHeight,
    contentClassName,
    itemClassName,
    itemActiveClassName,
    triggerClassName,
    showIcon,
    placement,
    onBlur,
  };

  if (props.control) {
    return (
      <Controller
        name={props.name}
        control={props.control}
        render={({ field }) => <MultiSelectInner value={field.value} onChange={field.onChange} props={props} />}
      />
    );
  }

  return <MultiSelectInner value={props.value} onChange={props.onChange} props={props} />;
}
