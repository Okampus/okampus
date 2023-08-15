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
import { useRef, useState } from 'react';

import type { ControlledMultiSelect, SelectItem } from '@okampus/shared/types';

export type AutoCompleteInputProps<T> = {
  multiple?: boolean;
  search: string;
  onChangeSearch: (search: string) => void;
  onAddCurrentSearch?: (search: string) => SelectItem<T, true> | void;
  maxHeight?: string;
  triggerClassName?: string;
  contentClassName?: string;
  contentRef?: React.Ref<HTMLUListElement>;
  showIcon?: boolean;
} & ControlledMultiSelect<T, true>;

export default function AutoCompleteInput<T>({
  search,
  multiple = false,
  onChangeSearch,
  onAddCurrentSearch,
  placeholder = 'Votre choix',
  maxHeight: maxHeightProp = '12rem',
  contentClassName: contentClass = 'flex flex-col gap-2 max-h-96 bg-2',
  triggerClassName = 'w-full',
  contentRef,
  showIcon = true,
  ...props
}: AutoCompleteInputProps<T>) {
  const { options, name, value, onChange, error, className, label, disabled, required, description } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const selected: SelectItem<T, true>[] = [];
  if (multiple) {
    for (const val of value) {
      const item = options.find((choice) => choice.value === val);
      if (item) selected.push(item);
    }
  } else {
    const item = options.find((choice) => choice.value === value);
    if (item) selected.push(item);
  }

  const [selectedItems, setSelectedItems] = useState<SelectItem<T, true>[]>(selected);

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

  const selectedIndex = multiple ? undefined : options.findIndex((choice) => choice.value === value);

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
    onMatch: isOpen ? setActiveIndex : (index: number) => setSelectedItems([...selectedItems, options[index]]),
  };
  const typeahead = useTypeahead(context, { ...typeProps, onTypingChange: (typing) => (isTypingRef.current = typing) });

  const interactions = [dismiss, role, listNav, typeahead, click];
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(interactions);

  const handleSelect = (idx: number) => {
    if (onAddCurrentSearch && idx === options.length) {
      const item = onAddCurrentSearch(search);
      if (item) setSelectedItems([...selectedItems, item]);
      setIsOpen(false);
    } else {
      const item = options[idx];
      if (multiple) {
        setSelectedItems([...selectedItems, item]);
        onChange?.([...value, item.value]);
      } else {
        setSelectedItems([item]);
        onChange?.([item.value]);
      }
    }
    setIsOpen(false);
  };

  const fieldProps = { label, className, name, description, required, error };

  const triggerClass = clsx(triggerClassName, disabled && 'pointer-events-none opacity-50');
  const triggerProps = { tabIndex: 0, ref: refs.setReference, className: triggerClass, ...getReferenceProps() };

  const contentStyle = { ...floatingStyles, overflowY: 'auto' } as React.CSSProperties;
  const contentProps = { ref: refs.setFloating, className: contentClass, style: contentStyle, ...getFloatingProps() };

  const selectedTags = selectedItems.map((item) => ({
    content: item.label,
    onRemove: () => setSelectedItems(selectedItems.filter(({ value }) => value !== item.value)),
  }));

  return (
    <Field {...fieldProps}>
      <TagList {...triggerProps} className="input" tags={selectedTags}>
        <input
          name={name}
          className="input-unpadded min-w-[6rem]"
          value={search}
          onChange={(event) => onChangeSearch(event.target.value)}
          placeholder={placeholder}
        />
      </TagList>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <ul {...contentProps} role="listbox" ref={contentRef}>
              {options.map(({ value, label }, idx) => {
                const style = {
                  cursor: 'default',
                  background: idx === activeIndex ? 'bg-3 opacity-100' : 'opacity-50',
                };
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
                    style={style}
                    {...getItemProps({ onClick: () => handleSelect(idx), onKeyDown })}
                  >
                    {label}
                    {showIcon && selected ? (
                      <IconCheck aria-hidden className="h-5 w-5 bg-[var(--primary)] text-white p-0.5 rounded-[50%]" />
                    ) : (
                      multiple && <IconCircle aria-hidden className="h-5 w-5 bg-[var(--primary)] text-white p-0.5" />
                    )}
                  </li>
                );
              })}
              {
                <li
                  ref={(node) => (listElementRef.current[options.length] = node)}
                  tabIndex={options.length === activeIndex ? 0 : -1}
                  aria-selected={false}
                  role="option"
                  style={{ cursor: 'default', background: 'opacity-50' }}
                  {...getItemProps({
                    onClick: () => handleSelect(options.length),
                    onKeyDown: (event: React.KeyboardEvent) => {
                      if (event.key === 'Enter' || (event.key === ' ' && !isTypingRef.current)) {
                        event.preventDefault();
                        handleSelect(options.length);
                      }
                    },
                  })}
                >
                  Ajouter &quot;{search}&quot;
                </li>
              }
            </ul>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </Field>
  );
}

// import { baseItemClassName, contentClassName } from '../../../../config/select-config';
// import {
//   useFloating,
//   autoUpdate,
//   flip,
//   size,
//   useRole,
//   useDismiss,
//   useListNavigation,
//   useInteractions,
//   FloatingPortal,
//   FloatingFocusManager,
//   offset,
// } from '@floating-ui/react';
// import { IconX } from '@tabler/icons-react';

// import clsx from 'clsx';
// import { forwardRef, useId, useState, useRef, useEffect } from 'react';

// import type { SelectItem } from '@okampus/shared/types';

// interface ItemProps {
//   children: React.ReactNode;
//   active: boolean;
// }

// // eslint-disable-next-line react/display-name
// const Item = forwardRef<HTMLDivElement, ItemProps & React.HTMLProps<HTMLDivElement>>(
//   ({ children, active, ...rest }, ref) => {
//     const id = useId();
//     return (
//       <div
//         ref={ref}
//         role="option"
//         id={id}
//         aria-selected={active}
//         className={clsx(baseItemClassName, active && 'bg-1')}
//         {...rest}
//       >
//         {children}
//       </div>
//     );
//   }
// );

// type AutoCompleteSelectItem<T> = SelectItem<T> & { searchValue: string };
// export type AutoCompleteInputProps<T> = {
//   value: AutoCompleteSelectItem<T> | null;
//   searchValue?: string;
//   onChange: (value: AutoCompleteSelectItem<T> | null) => void;
//   onChangeSearchValue: (value: string) => void;
//   addCurrentSearch?: () => void;
//   triggerClassName?: string;
//   autoFocus?: boolean;
//   className?: string;
//   error?: Error | null;
//   loading: boolean;
//   items: AutoCompleteSelectItem<T>[];
// };

// export default function AutoCompleteInput<T>({
//   value,
//   searchValue,
//   onChange,
//   onChangeSearchValue,
//   addCurrentSearch,
//   triggerClassName = 'w-full text-base font-medium text-[var(--text-0)]',
//   autoFocus,
//   className = 'h-[var(--h-input)] rounded-lg px-3.5 flex items-center bg-[var(--bg-input)]',
//   error,
//   loading,
//   items,
//   options,
// }: AutoCompleteInputProps<T>) {
//   const [open, setOpen] = useState(false);
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);

//   const listRef = useRef<Array<HTMLElement | null>>([]);

//   const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
//     whileElementsMounted: autoUpdate,
//     open,
//     onOpenChange: setOpen,
//     middleware: [
//       flip({ padding: 10 }),
//       offset(4),
//       size({
//         apply({ rects, availableHeight, elements }) {
//           Object.assign(elements.floating.style, {
//             width: `${rects.reference.width}px`,
//             maxHeight: `${availableHeight}px`,
//           });
//         },
//         padding: 10,
//       }),
//     ],
//   });

//   const role = useRole(context, { role: 'listbox' });
//   const dismiss = useDismiss(context);
//   const listNav = useListNavigation(context, {
//     listRef,
//     activeIndex,
//     onNavigate: setActiveIndex,
//     virtual: true,
//     loop: true,
//   });

//   const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([role, dismiss, listNav]);

//   function onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
//     console.log('onSearchChange', event.target.value);
//     const value = event.target.value;
//     onChangeSearchValue(value);

//     if (value) {
//       setOpen(true);
//       setActiveIndex(0);
//     } else {
//       onChange(null);
//       setOpen(false);
//     }
//   }

//   const inputRef = refs.domReference.current;

//   useEffect(() => {
//     if (autoFocus && inputRef) setTimeout(() => (setOpen(true), inputRef.focus()), 200);
//   }, [inputRef, autoFocus]);

//   return (
//     <div
//       className={clsx('relative rounded-lg', triggerClassName, open && 'outline outline-2 outline-[var(--border-2)]')}
//     >
//       <input
//         className={clsx('w-full', className, 'outline-none')}
//         {...getReferenceProps({
//           ref: refs.setReference,
//           onChange: onSearchChange,
//           value: searchValue,
//           placeholder: options?.label ?? 'Rechercher...',
//           'aria-autocomplete': 'list',
//           onClick: () => setOpen(true),
//           onKeyDown: (event) => {
//             if (event.key === 'Enter') {
//               if (addCurrentSearch && activeIndex === items.length) {
//                 addCurrentSearch();
//                 setOpen(false);
//               } else if (activeIndex != null && items[activeIndex]) {
//                 onChangeSearchValue(items[activeIndex].searchValue);
//                 onChange(items[activeIndex]);
//                 setActiveIndex(null);
//                 setOpen(false);
//               }
//             }
//           },
//         })}
//       />
//       {!open && value && (
//         <div
//           onClick={() => (setOpen(true), inputRef?.focus())}
//           className="cursor-pointer absolute z-20 bg-[var(--bg-input)] flex items-center justify-between inset-x-3.5 inset-y-0 tracking-[0.00125rem]"
//         >
//           {value.label}
//           <IconX className="text-1" onClick={() => (onChange(null), onChangeSearchValue(''))} />
//         </div>
//       )}
//       <FloatingPortal>
//         {open && (
//           <FloatingFocusManager context={context} initialFocus={-1} visuallyHiddenDismiss>
//             <div
//               className={contentClassName}
//               {...getFloatingProps({
//                 ref: refs.setFloating,
//                 style: { ...floatingStyles, zIndex: 100, overflowY: 'auto' },
//               })}
//             >
//               {error && <div className={clsx('text-red-500', baseItemClassName)}>{error.message}</div>}
//               {!loading &&
//                 items.map((item, index) => (
//                   <Item
//                     key={item.searchValue}
//                     {...getItemProps({
//                       ref: (node) => (listRef.current[index] = node),
//                       onClick() {
//                         onChange(item);
//                         onChangeSearchValue(item.searchValue);
//                         setOpen(false);
//                         refs.domReference.current?.focus();
//                       },
//                     })}
//                     active={activeIndex === index}
//                   >
//                     {item.label}
//                   </Item>
//                 ))}
//               {addCurrentSearch && searchValue && (
//                 <Item
//                   key={'addCurrentSearch'}
//                   {...getItemProps({
//                     ref: (node) => (listRef.current[items.length] = node),
//                     onClick: () => (addCurrentSearch(), setOpen(false)),
//                   })}
//                   active={activeIndex === items.length}
//                 >
//                   Ajouter &quot;{searchValue}&quot;
//                 </Item>
//               )}
//             </div>
//           </FloatingFocusManager>
//         )}
//       </FloatingPortal>
//     </div>
//   );
// }
