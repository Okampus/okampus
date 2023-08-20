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
import { IconCheck, IconCircle } from '@tabler/icons-react';
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

  const listElementRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      flip({ padding: 10 }),
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
    listRef: listElementRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([role, dismiss, listNav]);

  // function onChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   const value = event.target.value;
  //   setInputValue(value);

  //   if (value) {
  //     setOpen(true);
  //     setActiveIndex(0);
  //   } else {
  //     setOpen(false);
  //   }
  // }

  const fieldProps = { label, className, name, description, required, error };

  // const triggerClass = clsx(triggerClassName, disabled && 'pointer-events-none opacity-50');
  // const triggerProps = { tabIndex: 0, ref: refs.setReference, className: triggerClass, ...getReferenceProps() };

  const contentStyle = { ...floatingStyles, zIndex: 103, overflowY: 'auto' } as React.CSSProperties;
  const contentProps = { ref: refs.setFloating, className: contentClass, style: contentStyle, ...getFloatingProps() };

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

  return (
    <>
      <Field {...fieldProps}>
        <TagList
          tags={selectedItems.map((item) => ({
            content: item.label,
            onRemove: () => setSelectedItems(selectedItems.filter(({ value }) => value !== item.value)),
          }))}
        />
        <input
          className="input"
          {...getReferenceProps({
            ref: refs.setReference,
            onClick: () => {
              setIsOpen(true);
              setActiveIndex(0);
            },
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              onChangeSearch(event.target.value);
            },
            value: search,
            placeholder,
            'aria-autocomplete': 'list',
            onKeyDown(event) {
              if (event.key === 'Enter' && activeIndex != null && selectedItems[activeIndex]) {
                handleSelect(activeIndex);
                setActiveIndex(null);
                setIsOpen(false);
              }
            },
          })}
        />
      </Field>
      <FloatingPortal>
        {isOpen && (
          <FloatingFocusManager context={context} initialFocus={-1} visuallyHiddenDismiss>
            <ul {...contentProps} role="listbox">
              {options.map(({ value, label }, idx) => {
                const style = {
                  cursor: 'default',
                  background: idx === activeIndex ? 'bg-3 opacity-100' : 'opacity-50',
                };
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

              <li
                ref={(node) => (listElementRef.current[options.length] = node)}
                tabIndex={options.length === activeIndex ? 0 : -1}
                aria-selected={false}
                role="option"
                style={{ cursor: 'default', background: 'opacity-50' }}
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
            </ul>
            {/* <div
              {...getFloatingProps({
                ref: refs.setFloating,
                style: {
                  ...floatingStyles,
                  background: '#eee',
                  color: 'black',
                  overflowY: 'auto',
                },
              })}
            >
              {items.map((item, index) => (
                <Item
                  {...getItemProps({
                    key: item,
                    ref(node) {
                      listRef.current[index] = node;
                    },
                    onClick() {
                      setInputValue(item);
                      setOpen(false);
                      refs.domReference.current?.focus();
                    },
                  })}
                  active={activeIndex === index}
                >
                  {item}
                </Item>
              ))}
            </div> */}
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
}

// export default function AutoCompleteInput<T>({
//   search,
//   multiple = false,
//   onChangeSearch,
//   onAddCurrentSearch,
//   placeholder = 'Votre choix',
//   maxHeight: maxHeightProp = '12rem',
//   contentClassName: contentClass = 'flex flex-col gap-2 max-h-96 bg-2',
//   triggerClassName = 'w-full',
//   showIcon = true,
//   ...props
// }: AutoCompleteInputProps<T>) {
//   const { options, name, value, onChange, error, className, label, disabled, required, description } = props;

//   const [isOpen, setIsOpen] = useState(false);
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);

//   const selected: SelectItem<T, true>[] = [];
//   if (multiple) {
//     for (const val of value) {
//       const item = options.find((choice) => choice.value === val);
//       if (item) selected.push(item);
//     }
//   } else {
//     const item = options.find((choice) => choice.value === value);
//     if (item) selected.push(item);
//   }

//   const [selectedItems, setSelectedItems] = useState<SelectItem<T, true>[]>(selected);

//   const sizeMiddleware = size({
//     padding: 10,
//     apply({ rects, elements: { floating }, availableHeight }) {
//       const maxHeight = maxHeightProp ?? `${availableHeight}px`;
//       Object.assign(floating.style, { maxHeight, minWidth: `${rects.reference.width}px` });
//     },
//   });

//   const { refs, floatingStyles, context } = useFloating({
//     placement: 'bottom-start',
//     open: isOpen,
//     onOpenChange: setIsOpen,
//     whileElementsMounted: autoUpdate,
//     middleware: [offset(5), flip({ padding: 10 }), sizeMiddleware],
//   });

//   const listElementRef = useRef<Array<HTMLElement | null>>([]);
//   const listRef = useRef(options.map((choice) => JSON.stringify(choice.value)));
//   const isTypingRef = useRef(false);

//   const click = useClick(context, { event: 'mousedown' });
//   const dismiss = useDismiss(context);
//   const role = useRole(context, { role: 'listbox' });

//   const selectedIndex = multiple ? undefined : options.findIndex((choice) => choice.value === value);

//   const listNavProps = {
//     listRef: listElementRef,
//     activeIndex,
//     selectedIndex,
//     onNavigate: setActiveIndex,
//     loop: true,
//   };
//   const listNav = useListNavigation(context, listNavProps);

//   const typeProps = {
//     listRef,
//     activeIndex,
//     selectedIndex,
//     onMatch: isOpen ? setActiveIndex : (index: number) => setSelectedItems([...selectedItems, options[index]]),
//   };
//   const typeahead = useTypeahead(context, { ...typeProps, onTypingChange: (typing) => (isTypingRef.current = typing) });

//   const interactions = [dismiss, role, listNav, typeahead, click];
//   const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(interactions);

//   const handleSelect = (idx: number) => {
//     if (onAddCurrentSearch && idx === options.length) {
//       const item = onAddCurrentSearch(search);
//       if (item) setSelectedItems([...selectedItems, item]);
//       setIsOpen(false);
//     } else {
//       const item = options[idx];
//       if (multiple) {
//         setSelectedItems([...selectedItems, item]);
//         onChange?.([...value, item.value]);
//       } else {
//         setSelectedItems([item]);
//         onChange?.([item.value]);
//       }
//     }
//     setIsOpen(false);
//   };

//   const fieldProps = { label, className, name, description, required, error };

//   const triggerClass = clsx(triggerClassName, disabled && 'pointer-events-none opacity-50');
//   const triggerProps = { tabIndex: 0, ref: refs.setReference, className: triggerClass, ...getReferenceProps() };

//   const contentStyle = { ...floatingStyles, zIndex: 103, overflowY: 'auto' } as React.CSSProperties;
//   const contentProps = { ref: refs.setFloating, className: contentClass, style: contentStyle, ...getFloatingProps() };

//   const selectedTags = selectedItems.map((item) => ({
//     content: item.label,
//     onRemove: () => setSelectedItems(selectedItems.filter(({ value }) => value !== item.value)),
//   }));

//   return (
//     <Field {...fieldProps}>
//       <TagList {...triggerProps} className="input" tags={selectedTags} ref={refs.setReference}>
//         <input
//           name={name}
//           className="input-unpadded min-w-[6rem]"
//           value={search}
//           onChange={(event) => onChangeSearch(event.target.value)}
//           placeholder={placeholder}
//         />
//       </TagList>
//       {isOpen && (
//         <FloatingPortal>
//           <FloatingFocusManager context={context} modal={false}>
//             <ul {...contentProps} role="listbox">
//               {options.map(({ value, label }, idx) => {
//                 const style = {
//                   cursor: 'default',
//                   background: idx === activeIndex ? 'bg-3 opacity-100' : 'opacity-50',
//                 };
//                 const selected = selectedItems.some((item) => item.value === value);
//                 const onKeyDown = (event: React.KeyboardEvent) => {
//                   if (event.key === 'Enter' || (event.key === ' ' && !isTypingRef.current)) {
//                     event.preventDefault();
//                     handleSelect(idx);
//                   }
//                 };

//                 return (
//                   <li
//                     key={idx}
//                     ref={(node) => (listElementRef.current[idx] = node)}
//                     tabIndex={idx === activeIndex ? 0 : -1}
//                     aria-selected={selected}
//                     role="option"
//                     style={style}
//                     {...getItemProps({ onClick: () => handleSelect(idx), onKeyDown })}
//                   >
//                     {label}
//                     {showIcon && selected ? (
//                       <IconCheck aria-hidden className="h-5 w-5 bg-[var(--primary)] text-white p-0.5 rounded-[50%]" />
//                     ) : (
//                       multiple && <IconCircle aria-hidden className="h-5 w-5 bg-[var(--primary)] text-white p-0.5" />
//                     )}
//                   </li>
//                 );
//               })}

//               <li
//                 ref={(node) => (listElementRef.current[options.length] = node)}
//                 tabIndex={options.length === activeIndex ? 0 : -1}
//                 aria-selected={false}
//                 role="option"
//                 style={{ cursor: 'default', background: 'opacity-50' }}
//                 {...getItemProps({
//                   onClick: () => handleSelect(options.length),
//                   onKeyDown: (event: React.KeyboardEvent) => {
//                     if (event.key === 'Enter' || (event.key === ' ' && !isTypingRef.current)) {
//                       event.preventDefault();
//                       handleSelect(options.length);
//                     }
//                   },
//                 })}
//               >
//                 Ajouter &quot;{search}&quot;
//               </li>
//             </ul>
//           </FloatingFocusManager>
//         </FloatingPortal>
//       )}
//     </Field>
//   );
// }
