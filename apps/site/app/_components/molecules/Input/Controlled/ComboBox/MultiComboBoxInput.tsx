'use client';

import { selectContentClass, selectItemClass } from '../Select/SelectInput';

import Field from '../../Field';
import TagList from '../../../List/TagList';

import { handleSelectMulti, useComboBoxConfig } from '../../../../../_hooks/useComboBoxConfig';

import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { Check } from '@phosphor-icons/react';

import clsx from 'clsx';
import { useMemo, useState } from 'react';

import { Controller } from 'react-hook-form';

import type { OnAddSearch } from './ComboBoxInput';
import type { UseComboBoxConfig } from '../../../../../_hooks/useComboBoxConfig';

import type { ComboBoxItem, ControlledMultiComboBox } from '@okampus/shared/types';
import type { Placement } from '@floating-ui/react';

export type MultiComboBoxInputProps<T, U> = ControlledMultiComboBox<T> & {
  onAddSearch?: OnAddSearch<T, U>;
  onSearch?: (search: string) => Promise<void> | void;
  renderSelected?: (item: ComboBoxItem<T>) => React.ReactNode;
  maxHeight?: string;
  contentClassName?: string;
  itemClassName?: string;
  itemActiveClassName?: string;
  triggerClassName?: string;
  showIcon?: boolean;
  placement?: Placement;
};

export type MultiComboBoxInnerProps<T, U> = {
  props: MultiComboBoxInputProps<T, U>;
  value: T[];
  onChange: (value: T[]) => void;
  comboBoxConfig: UseComboBoxConfig<T>;
};

export function MultiComboBoxInner<T, U>({ props, value, onChange, comboBoxConfig }: MultiComboBoxInnerProps<T, U>) {
  const [selectedLabels, setSelectedLabels] = useState<React.ReactNode[]>([]);

  const { activeIndex, options, ...config } = comboBoxConfig;
  const renderSelected = props.renderSelected || ((item: ComboBoxItem<T>) => item.searchText);

  const selected = useMemo(() => {
    const selectedArray: T[] = [];
    for (const selectedValue of value) {
      const item = options.find((choice) => choice.value === selectedValue);
      if (item) selectedArray.push(item.value);
    }
    return selectedArray;
  }, [value, options]);

  const setSelected = (selectedValue: T) => {
    if (selected.includes(selectedValue)) {
      const index = selected.indexOf(selectedValue);
      setSelectedLabels(selectedLabels.filter((_, idx) => idx !== index));
      onChange(selected.filter((_, idx) => idx !== index));
    } else {
      onChange([...selected, selectedValue]);
      const option = options.find((item) => item.value === selectedValue);
      option && setSelectedLabels([...selectedLabels, renderSelected(option)]);
    }
    comboBoxConfig.setIsOpen(false);
  };

  const handlers = (idx: number) => ({
    onClick: handleSelectMulti({ ...comboBoxConfig, setSelected, selected: value }, idx),
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSelectMulti({ ...comboBoxConfig, setSelected, selected: value }, idx);
      }
    },
  });

  const style: React.CSSProperties = { ...comboBoxConfig.floatingStyles, zIndex: 103, overflowY: 'auto' };
  const contentProps = { className: clsx(props.contentClassName, selectContentClass), style };

  const addSearchProps = comboBoxConfig.getItemProps(handlers(options.length));
  const addSearchA11y = { 'aria-selected': false, role: 'option', tabIndex: options.length === activeIndex ? 0 : -1 };

  const triggerProps = { tabIndex: 0, className: clsx(props.triggerClassName, 'input max-h-[var(--h-input)]') };
  const inputProps = { value: config.search, disabled: props.disabled, placeholder: props.placeholder };

  const onRemoveValue = (valueToRemove: T) => () => {
    setSelected(valueToRemove);
    onChange(value.filter((selectedValue) => selectedValue !== valueToRemove));
  };

  const { label, className, name, description, required, error, info, loading, itemClassName, ...otherProps } = props;
  const field = { error: error || config.error?.message, loading: loading || config.loading };
  return (
    <>
      <Field {...{ ...field, label, className, name, description, required, info }}>
        <div ref={config.refs.setReference} {...config.getReferenceProps()} {...triggerProps}>
          <TagList
            className="w-full"
            tags={selectedLabels.map((item, idx) => ({ content: item, onRemove: onRemoveValue(selected[idx]) }))}
          >
            <input {...inputProps} />
          </TagList>
        </div>
      </Field>
      <FloatingPortal>
        {config.isOpen && (
          <FloatingFocusManager context={config.context} initialFocus={-1} visuallyHiddenDismiss>
            <ul {...contentProps} ref={config.refs.setFloating} role="listbox">
              {options.map(({ value, label }, idx) => {
                const isSelected = selected.includes(value);
                const isActive = activeIndex === idx;

                const className = clsx(itemClassName, selectItemClass, isActive && otherProps.itemActiveClassName);

                const itemProps = { ...comboBoxConfig.getItemProps(handlers(idx)), className };
                const a11yProps = { 'aria-selected': isSelected, 'aria-label': comboBoxConfig.search, role: 'option' };

                return (
                  <li key={idx} {...a11yProps} {...itemProps} ref={config.setListRef(idx)} tabIndex={isActive ? 0 : -1}>
                    {otherProps.showIcon &&
                      (isSelected ? (
                        <div className="rounded bg-[var(--info)] h-6 w-6 flex items-center justify-center">
                          <Check aria-hidden className="text-white" />
                        </div>
                      ) : (
                        <div className="rounded border border-[var(--border-1)] h-6 w-6" />
                      ))}
                    {label}
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

export default function MultiComboBoxInput<T, U>({
  placeholder = 'Votre choix',
  maxHeight = '16rem',
  contentClassName = 'flex flex-col bg-[var(--bg-main)] text-0 cursor-pointer font-medium',
  itemClassName = 'flex items-center gap-4 px-4 py-2 bg-3-hover min-h-[var(--h-input)]',
  itemActiveClassName = 'bg-3',
  triggerClassName = 'w-full',
  showIcon = true,
  placement = 'bottom-start',
  ...otherProps
}: MultiComboBoxInputProps<T, U>) {
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
        render={({ field: { value, onChange } }) => (
          <MultiComboBoxInner {...{ value, onChange, props, comboBoxConfig }} />
        )}
      />
    );
  }

  const innerProps = { value: props.value, onChange: props.onChange, props, comboBoxConfig };
  return <MultiComboBoxInner {...innerProps} />;
}
