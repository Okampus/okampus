'use client';

import Field from '../../Field';

import { useSelectConfig } from '../../../../../_hooks/useSelectConfig';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { Check, CaretDown, CaretUp } from '@phosphor-icons/react';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import type { BaseSyntheticEvent } from 'react';
import type { Placement } from '@floating-ui/react';
import type { ControlledSelect, SelectItem } from '@okampus/shared/types';

export const selectTriggerClass =
  'flex items-center justify-between gap-1.5 outline-none disabled:opacity-50 disabled:pointer-events-none invalid:border-[var(--danger)] invalid:text-[var(--danger)] active:border-[var(--border-0)]';
export const selectContentClass =
  'overflow-scroll rounded-lg outline-none bg-[var(--bg-main)] border border-[var(--border-1)] shadow-xl p-2';
export const selectItemClass =
  'outline-none gap-2 px-2 text-[var(--text-0)] hover:bg-[var(--bg-3)] cursor-pointer min-h-[calc(var(--h-input)-0.5rem)] rounded';

export type SelectInputProps<T, Cancellable> = ControlledSelect<T, Cancellable> & {
  maxHeight?: string;
  hideArrow?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  itemActiveClassName?: string;
  showIcon?: boolean;
  placement?: Placement;
  onBlur?: () => void;
  cancellable?: Cancellable;
};

export type SelectInnerProps<T, Cancellable> = {
  props: SelectInputProps<T, Cancellable>;
  value: T | undefined;
  onChange: (value: Cancellable extends true ? T | undefined : T) => void;
};

const selectKeys = new Set(['Enter', ' ']);
function SelectInner<T, Cancellable>({ props, value, onChange }: SelectInnerProps<T, Cancellable>) {
  const { hideArrow, options, name, error, disabled, maxHeight, placement, onBlur, placeholder } = props;

  const selected = options.find((choice) => choice.value === value);
  const [selectedItem, setSelectedItem] = useState<SelectItem<T> | null>(selected ?? null);

  useEffect(() => {
    const item = options.find((choice) => choice.value === value);
    setSelectedItem(item ?? null);
  }, [options, value]);

  const { refs, setListRef, context, getReferenceProps, getFloatingProps, getItemProps, isOpen, ...selectConfig } =
    useSelectConfig({ value, options, maxHeight, placement, onSelected: onChange, onBlur });

  const triggerClass = clsx(selectTriggerClass, props.triggerClassName, isOpen && 'active', error && 'invalid');
  const triggerProps = { name, tabIndex: 0, className: triggerClass, ...getReferenceProps() };

  const style: React.CSSProperties = { ...selectConfig.floatingStyles, zIndex: 103, overflowY: 'auto' };
  const contentProps = { className: clsx(props.contentClassName, selectContentClass), style, ...getFloatingProps() };

  return (
    <Field {...props}>
      <button type="button" ref={refs.setReference} disabled={disabled} {...triggerProps}>
        {selectedItem?.label ?? placeholder}
        {!hideArrow && (isOpen ? <CaretUp className="w-4 h-4" /> : <CaretDown className="w-4 h-4" />)}
      </button>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <ul role="listbox" ref={refs.setFloating} {...contentProps}>
              {selectConfig.searchableOptions.map(({ value, label, searchText }, idx) => {
                const select = (event: BaseSyntheticEvent) => {
                  event.preventDefault();
                  selectConfig.handleSelect(idx);
                };

                const isSelected = selectedItem?.value === value;
                const isActive = selectConfig.activeIndex === idx;

                const className = clsx(props.itemClassName, selectItemClass, isActive && props.itemActiveClassName);

                const onKeyDown = (event: React.KeyboardEvent) => selectKeys.has(event.key) && select(event);
                const itemProps = { ...getItemProps({ onClick: select, onKeyDown }), className };
                const a11yProps = { 'aria-selected': isSelected, 'aria-label': searchText, role: 'option' };
                return (
                  <li key={idx} tabIndex={isActive ? 0 : -1} ref={setListRef(idx)} {...a11yProps} {...itemProps}>
                    {label}
                    {props.showIcon && isSelected && (
                      <Check aria-hidden className="h-5 w-5 bg-[var(--primary)] text-white p-0.5 rounded-[50%]" />
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

export default function SelectInput<T, Cancellable>({
  placeholder = 'Votre choix',
  maxHeight = '12rem',
  contentClassName = 'flex flex-col',
  itemClassName = 'flex items-center gap-2 p-2 bg-3-hover cursor-pointer min-h-[var(--h-input)]',
  itemActiveClassName = 'bg-3',
  triggerClassName = 'input max-h-[var(--h-input)] w-full',
  showIcon = true,
  placement = 'bottom-start',
  ...otherProps
}: SelectInputProps<T, Cancellable>) {
  const props = {
    placeholder,
    maxHeight,
    contentClassName,
    itemClassName,
    itemActiveClassName,
    triggerClassName,
    showIcon,
    placement,
    ...otherProps,
  };

  if (props.control) {
    return (
      <Controller
        name={props.name}
        control={props.control}
        render={({ field }) => <SelectInner value={field.value} onChange={field.onChange} props={props} />}
      />
    );
  }

  return <SelectInner value={props.value} onChange={props.onChange} props={props} />;
}
