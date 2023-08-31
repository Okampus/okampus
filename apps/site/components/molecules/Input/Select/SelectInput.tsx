'use client';

import Field from '../Field';

import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useInteractions,
  FloatingFocusManager,
  useTypeahead,
  flip,
  size,
  autoUpdate,
  FloatingPortal,
  offset,
} from '@floating-ui/react';
import { IconCheck, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import type { Placement } from '@floating-ui/react';

import type { ControlledSelect, SelectItem } from '@okampus/shared/types';

export type SelectInputProps<T> = ControlledSelect<T> & {
  maxHeight?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  showIcon?: boolean;
  placement?: Placement;
};

export default function SelectInput<T>({
  placeholder = 'Votre choix',
  maxHeight: maxHeightProp = '12rem',
  contentClassName = 'flex flex-col bg-[var(--bg-input)] border-2 border-[var(--border-1)] font-medium',
  itemClassName = 'flex items-center gap-2 py-2 px-3.5 text-0 bg-3-hover cursor-pointer min-h-[var(--h-input)]',
  triggerClassName = 'input h-[var(--h-input)] max-h-[var(--h-input)]',
  showIcon = true,
  placement = 'bottom-start',
  ...props
}: SelectInputProps<T>) {
  const { options, name, value, onChange, error, className, label, disabled, required, description } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const selected = options.find((choice) => choice.value === value);
  const [selectedItem, setSelectedItem] = useState<SelectItem<T> | null>(selected ?? null);

  useEffect(() => {
    const item = options.find((choice) => choice.value === value);
    setSelectedItem(item ?? null);
  }, [options, value]);

  const sizeMiddleware = size({
    padding: 10,
    apply({ rects, elements: { floating }, availableHeight }) {
      const maxHeight = maxHeightProp ?? `${availableHeight}px`;
      Object.assign(floating.style, { maxHeight, minWidth: `${rects.reference.width}px` });
    },
  });

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [flip({ padding: 10 }), offset(5), sizeMiddleware],
  });

  const listElementRef = useRef<Array<HTMLElement | null>>([]);
  const listRef = useRef(options.map((choice) => JSON.stringify(choice.value)));
  const isTypingRef = useRef(false);

  const click = useClick(context, { event: 'mousedown' });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'listbox' });

  const selectedIndex = options.findIndex((choice) => choice.value === value);

  const listNavProps = {
    listRef: listElementRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    loop: true,
  };
  const listNav = useListNavigation(context, listNavProps);

  const typeProps = {
    listRef,
    activeIndex,
    selectedIndex,
    onMatch: isOpen ? setActiveIndex : (index: number) => setSelectedItem(options[index]),
  };
  const typeahead = useTypeahead(context, { ...typeProps, onTypingChange: (typing) => (isTypingRef.current = typing) });

  const interactions = [dismiss, role, listNav, typeahead, click];
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(interactions);

  const handleSelect = (index: number) => {
    const item = options[index];
    setSelectedItem(item);
    onChange?.(item.value);
    setIsOpen(false);
  };

  const fieldProps = { label, className, name, description, required, error };

  const triggerClass = clsx(
    'flex items-center justify-between gap-1.5',
    triggerClassName,
    disabled && 'pointer-events-none opacity-50',
    error && '!border-[var(--danger)] !text-[var(--danger)]',
  );
  const triggerProps = { name, tabIndex: 0, className: triggerClass, ...getReferenceProps() };

  const contentStyle = { ...floatingStyles, zIndex: 103, overflowY: 'auto' } as React.CSSProperties;
  const contentProps = {
    className: clsx(contentClassName, 'scrollbar rounded-lg outline-none'),
    style: contentStyle,
    ...getFloatingProps(),
  };

  const buttonInner = selectedItem?.label ?? placeholder;

  return (
    <Field {...fieldProps}>
      <button type="button" {...triggerProps} ref={refs.setReference}>
        {buttonInner}
        {isOpen ? <IconChevronUp className="w-6 h-6" /> : <IconChevronDown className="w-6 h-6" />}
      </button>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <ul {...contentProps} ref={refs.setFloating} role="listbox">
              {options.map(({ value, label }, idx) => {
                const selected = selectedItem?.value === value;
                const onKeyDown = (event: React.KeyboardEvent) => {
                  if (event.key === 'Enter' || (event.key === ' ' && !isTypingRef.current)) {
                    event.preventDefault();
                    handleSelect(idx);
                  }
                };

                return (
                  <li
                    key={idx}
                    tabIndex={activeIndex === idx ? 0 : -1}
                    ref={(node) => (listElementRef.current[idx] = node)}
                    aria-selected={selected}
                    role="option"
                    className={clsx(itemClassName, 'outline-none', activeIndex === idx && 'bg-3')}
                    {...getItemProps({ onClick: () => handleSelect(idx), onKeyDown })}
                  >
                    {label}
                    {showIcon && selected && (
                      <IconCheck aria-hidden className="h-5 w-5 bg-[var(--primary)] text-white p-0.5 rounded-[50%]" />
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
