import { baseItemClassName, contentClassName } from '../../../config/select-config';
import {
  useFloating,
  autoUpdate,
  flip,
  size,
  useRole,
  useDismiss,
  useListNavigation,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
  offset,
} from '@floating-ui/react';
import { IconX } from '@tabler/icons-react';

import clsx from 'clsx';
import { forwardRef, useId, useState, useRef, useEffect } from 'react';

import type { InputOptions, SelectItem } from '@okampus/shared/types';

interface ItemProps {
  children: React.ReactNode;
  active: boolean;
}

// eslint-disable-next-line react/display-name
const Item = forwardRef<HTMLDivElement, ItemProps & React.HTMLProps<HTMLDivElement>>(
  ({ children, active, ...rest }, ref) => {
    const id = useId();
    return (
      <div
        ref={ref}
        role="option"
        id={id}
        aria-selected={active}
        className={clsx(baseItemClassName, active && 'bg-1')}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

type AutoCompleteSelectItem<T> = SelectItem<T> & { searchValue: string };
export type AutoCompleteInputProps<T> = {
  value: AutoCompleteSelectItem<T> | null;
  searchValue?: string;
  onChange: (value: AutoCompleteSelectItem<T> | null) => void;
  onChangeSearchValue: (value: string) => void;
  addCurrentSearch?: () => void;
  triggerClassName?: string;
  autoFocus?: boolean;
  className?: string;
  error?: Error | null;
  loading: boolean;
  items: AutoCompleteSelectItem<T>[];
  options?: InputOptions;
};

export default function AutoCompleteInput<T>({
  value,
  searchValue,
  onChange,
  onChangeSearchValue,
  addCurrentSearch,
  triggerClassName = 'w-full text-base font-medium text-[var(--text-0)]',
  autoFocus,
  className = 'h-[var(--h-input)] rounded-lg px-3.5 flex items-center bg-[var(--bg-input)]',
  error,
  loading,
  items,
  options,
}: AutoCompleteInputProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [
      flip({ padding: 10 }),
      offset(4),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
    ],
  });

  const role = useRole(context, { role: 'listbox' });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([role, dismiss, listNav]);

  function onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log('onSearchChange', event.target.value);
    const value = event.target.value;
    onChangeSearchValue(value);

    if (value) {
      setOpen(true);
      setActiveIndex(0);
    } else {
      onChange(null);
      setOpen(false);
    }
  }

  const inputRef = refs.domReference.current;

  useEffect(() => {
    if (autoFocus && inputRef) setTimeout(() => (setOpen(true), inputRef.focus()), 200);
  }, [inputRef, autoFocus]);

  return (
    <div
      className={clsx('relative rounded-lg', triggerClassName, open && 'outline outline-2 outline-[var(--border-2)]')}
    >
      <input
        className={clsx('w-full', className, 'outline-none')}
        {...getReferenceProps({
          ref: refs.setReference,
          onChange: onSearchChange,
          value: searchValue,
          placeholder: options?.label ?? 'Rechercher...',
          'aria-autocomplete': 'list',
          onClick: () => setOpen(true),
          onKeyDown: (event) => {
            if (event.key === 'Enter') {
              if (addCurrentSearch && activeIndex === items.length) {
                addCurrentSearch();
                setOpen(false);
              } else if (activeIndex != null && items[activeIndex]) {
                onChangeSearchValue(items[activeIndex].searchValue);
                onChange(items[activeIndex]);
                setActiveIndex(null);
                setOpen(false);
              }
            }
          },
        })}
      />
      {!open && value && (
        <div
          onClick={() => (setOpen(true), inputRef?.focus())}
          className="cursor-pointer absolute z-20 bg-[var(--bg-input)] flex items-center justify-between inset-x-3.5 inset-y-0 tracking-[0.00125rem]"
        >
          {value.label}
          <IconX className="text-1" onClick={() => (onChange(null), onChangeSearchValue(''))} />
        </div>
      )}
      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context} initialFocus={-1} visuallyHiddenDismiss>
            <div
              className={contentClassName}
              {...getFloatingProps({
                ref: refs.setFloating,
                style: { ...floatingStyles, zIndex: 100, overflowY: 'auto' },
              })}
            >
              {error && <div className={clsx('text-red-500', baseItemClassName)}>{error.message}</div>}
              {!loading &&
                items.map((item, index) => (
                  <Item
                    key={item.searchValue}
                    {...getItemProps({
                      ref: (node) => (listRef.current[index] = node),
                      onClick() {
                        onChange(item);
                        onChangeSearchValue(item.searchValue);
                        setOpen(false);
                        refs.domReference.current?.focus();
                      },
                    })}
                    active={activeIndex === index}
                  >
                    {item.label}
                  </Item>
                ))}
              {addCurrentSearch && searchValue && (
                <Item
                  key={'addCurrentSearch'}
                  {...getItemProps({
                    ref: (node) => (listRef.current[items.length] = node),
                    onClick: () => (addCurrentSearch(), setOpen(false)),
                  })}
                  active={activeIndex === items.length}
                >
                  Ajouter &quot;{searchValue}&quot;
                </Item>
              )}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </div>
  );
}
