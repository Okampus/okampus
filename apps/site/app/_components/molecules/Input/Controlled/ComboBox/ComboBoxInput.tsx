'use client';

import { selectContentClass, selectItemClass } from '../Select/SelectInput';

import Field from '../../Field';

import { handleSelect, useComboBoxConfig } from '../../../../../_hooks/useComboBoxConfig';

import { useEffect, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import clsx from 'clsx';

import { FloatingFocusManager, FloatingPortal, type Placement } from '@floating-ui/react';
import { CaretDown, CaretUp, Check } from '@phosphor-icons/react';

import type { UseComboBoxConfig } from '../../../../../_hooks/useComboBoxConfig';
import type { ComboBoxItem, ControlledComboBox } from '@okampus/shared/types';

export type RenderAddOptionWithContextProps<T, U> = {
  search: string;
  context: U;
  callback: (option: ComboBoxItem<T>) => void;
};
export type RenderAddOptionProps<T> = { search: string; callback: (option: ComboBoxItem<T>) => void };

export type OnAddSearch<T, U = undefined> = U extends undefined
  ? { render: (props: RenderAddOptionProps<T>) => React.ReactNode }
  : { render: (props: RenderAddOptionWithContextProps<T, U>) => React.ReactNode; context: U };

export type ComboBoxInputProps<T, U> = ControlledComboBox<T> & {
  onAddSearch?: OnAddSearch<T, U>;
  onSearch?: (search: string) => Promise<void> | void;
  maxHeight?: string;
  contentClassName?: string;
  itemClassName?: string;
  itemActiveClassName?: string;
  triggerClassName?: string;
  showIcon?: boolean;
  placement?: Placement;
};

type ComboBoxInnerProps<T, U> = {
  props: ComboBoxInputProps<T, U>;
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  comboBoxConfig: UseComboBoxConfig<T>;
};

function ComboBoxInner<T, U>({ props, value, onChange, comboBoxConfig }: ComboBoxInnerProps<T, U>) {
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>();

  const { activeIndex, options, ...config } = comboBoxConfig;

  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);

  const setSelected = (value: T | undefined) => {
    const item = comboBoxConfig.options.find((option) => option.value === value);
    if (!item) return;
    setSelectedLabel(item.searchText);
    onChange(item.value);
    comboBoxConfig.setIsOpen(false);
  };

  useEffect(() => {
    if (value && selected && !selectedLabel) setSelectedLabel(selected.searchText);
  }, [selected, selectedLabel, value]);

  const handlers = (idx: number) => ({
    onClick: handleSelect({ ...comboBoxConfig, setSelected, selected: value }, idx),
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSelect({ ...comboBoxConfig, setSelected, selected: value }, idx);
      }
    },
  });

  const style: React.CSSProperties = { ...comboBoxConfig.floatingStyles, zIndex: 103, overflowY: 'auto' };
  const contentProps = { className: clsx(props.contentClassName, selectContentClass), style };

  const addSearchProps = comboBoxConfig.getItemProps(handlers(options.length));
  const addSearchA11y = { 'aria-selected': false, role: 'option', tabIndex: options.length === activeIndex ? 0 : -1 };

  const inputProps = {
    disabled: props.disabled,
    className: clsx(props.triggerClassName, 'input max-h-[var(--h-input)] !pr-10'),
  };
  const inputValue = selectedLabel ? (config.isOpen ? config.search : selectedLabel) : config.search;
  const inputComboBoxProps = { ...config.getReferenceProps(), value: inputValue, placeholder: props.placeholder };

  const { label, className, name, description, required, error, info, loading, itemClassName, ...otherProps } = props;
  const field = { error: error || config.error?.message, loading: loading || config.loading };
  return (
    <>
      <Field {...{ ...field, label, className, name, description, required, info }}>
        <button type="button" className="relative w-full">
          <input tabIndex={0} ref={config.refs.setReference} {...inputProps} {...inputComboBoxProps} />
          {config.isOpen ? (
            <CaretUp className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" />
          ) : (
            <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" />
          )}
        </button>
      </Field>
      <FloatingPortal>
        {config.isOpen && (
          <FloatingFocusManager context={config.context} initialFocus={-1} visuallyHiddenDismiss>
            <ul role="listbox" {...contentProps} {...comboBoxConfig.getFloatingProps()}>
              {options.map(({ value, label }, idx) => {
                const isSelected = selected?.value === value;
                const isActive = activeIndex === idx;

                const className = clsx(itemClassName, selectItemClass, isActive && otherProps.itemActiveClassName);

                const itemProps = { ...comboBoxConfig.getItemProps(handlers(idx)), className };
                const a11yProps = { 'aria-selected': isSelected, 'aria-label': comboBoxConfig.search, role: 'option' };

                return (
                  <li key={idx} {...a11yProps} {...itemProps} ref={config.setListRef(idx)} tabIndex={isActive ? 0 : -1}>
                    {label}
                    {otherProps.showIcon && isSelected && (
                      <Check aria-hidden className="h-6 w-6 bg-[var(--primary)] text-white p-0.5 rounded-[50%]" />
                    )}
                  </li>
                );
              })}

              {otherProps.onAddSearch && (
                <li {...addSearchA11y} {...addSearchProps} className={itemClassName}>
                  Ajouter &quot;{comboBoxConfig.search}&quot;
                </li>
              )}
            </ul>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
}

export default function ComboBoxInput<T, U>({
  placeholder = 'Choisissez une option',
  maxHeight = '14rem',
  contentClassName = 'flex flex-col bg-[var(--bg-main)] text-0 cursor-pointer font-medium',
  itemClassName = 'flex items-center gap-4 px-4 py-2 bg-3-hover min-h-[var(--h-input)]',
  itemActiveClassName = 'bg-3',
  triggerClassName = 'w-full',
  showIcon = true,
  placement = 'bottom-start',
  ...otherProps
}: ComboBoxInputProps<T, U>) {
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

  const comboBoxConfig = useComboBoxConfig(props);

  if (props.control) {
    return (
      <Controller
        name={props.name}
        control={props.control}
        render={({ field: { value, onChange } }) => <ComboBoxInner {...{ value, onChange, props, comboBoxConfig }} />}
      />
    );
  }

  const innerProps = { value: props.value, onChange: props.onChange, props, comboBoxConfig };
  return <ComboBoxInner {...innerProps} />;
}
