'use client';

import Field from '../Field';
import TagList from '../../List/TagList';

import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useInteractions,
  FloatingFocusManager,
  useTypeahead,
  offset,
  flip,
  size,
  autoUpdate,
  FloatingPortal,
} from '@floating-ui/react';
import { IconCheck, IconCircle } from '@tabler/icons-react';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import type { ControlledMultiSelect, SelectItem } from '@okampus/shared/types';

export type MultiSelectInputProps<T> = ControlledMultiSelect<T> & {
  maxHeight?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  showIcon?: boolean;
};

export default function MultiSelectInput<T>({
  placeholder = 'Votre choix',
  maxHeight: maxHeightProp = '12rem',
  contentClassName = 'flex flex-col gap-2 bg-2',
  itemClassName = 'flex items-center gap-2 p-2 bg-3-hover cursor-pointer min-h-[var(--h-input)]',
  triggerClassName = 'w-full',
  showIcon = true,
  ...props
}: MultiSelectInputProps<T>) {
  const { options, name, value, onChange, error, className, label, disabled, required, description } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const selected: SelectItem<T>[] = [];

  for (const val of value) {
    const item = options.find((choice) => choice.value === val);
    if (item) selected.push(item);
  }

  useEffect(() => {
    for (const val of value) {
      const item = options.find((choice) => choice.value === val);
      if (item) selected.push(item);
    }
  }, [options, selected, value]);

  const [selectedItems, setSelectedItems] = useState<SelectItem<T>[]>(selected);

  const sizeMiddleware = size({
    padding: 10,
    apply({ rects, elements: { floating }, availableHeight }) {
      const maxHeight = maxHeightProp ?? `${availableHeight}px`;
      Object.assign(floating.style, { maxHeight, minWidth: `${rects.reference.width}px` });
    },
  });

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip({ padding: 10 }), sizeMiddleware],
  });

  const listElementRef = useRef<Array<HTMLElement | null>>([]);
  const listRef = useRef(options.map((choice) => JSON.stringify(choice.value)));
  const isTypingRef = useRef(false);

  const click = useClick(context, { event: 'mousedown' });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'listbox' });

  const listNavProps = {
    listRef: listElementRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
  };
  const listNav = useListNavigation(context, listNavProps);

  const typeProps = {
    listRef,
    activeIndex,
    onMatch: isOpen ? setActiveIndex : (index: number) => setSelectedItems([...selectedItems, options[index]]),
  };
  const typeahead = useTypeahead(context, { ...typeProps, onTypingChange: (typing) => (isTypingRef.current = typing) });

  const interactions = [dismiss, role, listNav, typeahead, click];
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(interactions);

  const handleSelect = (index: number) => {
    const item = options[index];
    setSelectedItems([...selectedItems, item]);
    onChange?.([...value, item.value]);
    setIsOpen(false);
  };

  const fieldProps = { label, className, name, description, required, error };

  const triggerClass = clsx(triggerClassName, disabled && 'pointer-events-none opacity-50');
  const triggerProps = { name, tabIndex: 0, className: triggerClass, ...getReferenceProps() };

  const contentStyle = { ...floatingStyles, zIndex: 103, overflowY: 'auto' } as React.CSSProperties;
  const contentProps = { className: clsx(contentClassName, 'scrollbar'), style: contentStyle, ...getFloatingProps() };

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
    <Field {...fieldProps}>
      <button {...triggerProps} ref={refs.setReference}>
        {buttonInner}
      </button>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <ul {...contentProps} ref={refs.setFloating} role="listbox">
              {options.map(({ value, label }, idx) => {
                const selected = selectedItems.some((item) => item.value === value);
                const onKeyDown = (event: React.KeyboardEvent) => {
                  if (event.key === 'Enter' || (event.key === ' ' && !isTypingRef.current)) {
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
                    className={itemClassName}
                    {...getItemProps({ onClick: () => handleSelect(idx), onKeyDown })}
                  >
                    {label}
                    {showIcon && selected ? (
                      <IconCheck aria-hidden className="h-5 w-5 bg-[var(--primary)] text-white p-0.5 rounded-[50%]" />
                    ) : (
                      <IconCircle aria-hidden className="h-5 w-5 bg-[var(--primary)] text-white p-0.5" />
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
