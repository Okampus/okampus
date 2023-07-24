'use client';

import Popover from '../../atoms/Popup/Popover/Popover';
import PopoverContent from '../../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../../atoms/Popup/Popover/PopoverTrigger';
import GroupHeading from '../../atoms/Heading/GroupHeading';
import {
  contentVariants,
  itemVariants,
  arrowConfig,
  baseItemClassName,
  contentClassName,
  innerContentClassName,
  openClassName,
  searchInputClassName,
} from '../../../config/select-config';
import { useOutsideClick } from '../../../hooks/useOutsideClick';

import InputLabel from '../../atoms/Label/InputLabel';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { IconCheck, IconChevronDown } from '@tabler/icons-react';

import type { Ref } from 'react';
import type { InputOptions, SelectItem } from '@okampus/shared/types';

export type SelectInputProps<T> = {
  items: SelectItem<T>[];
  triggerClassName?: string;
  className?: string;
  value: T | null;
  arrow?: boolean;
  onChange?: (value: T) => void;
  contentElementRef?: Ref<HTMLDivElement>;
  search?: boolean;
  options?: InputOptions;
};

export default function SelectInput<T>({
  items,
  triggerClassName = 'w-full',
  className = 'input pt-5 h-[var(--h-input)]',
  value,
  arrow = true,
  onChange,
  contentElementRef,
  search,
  options,
}: SelectInputProps<T>) {
  const [ref, isOpen, setIsOpen] = useOutsideClick(false);
  const [searchText, setSearchText] = useState('');

  const shownItems = search
    ? items.filter((item) => JSON.stringify(item.value).toLowerCase().includes(searchText.toLowerCase()))
    : items;

  const shownGroups: { name: string; items: SelectItem<T>[] }[] = [];
  for (const item of shownItems) {
    const group = shownGroups.find((group) => group.name === item.group);
    if (group) group.items.push(item);
    else shownGroups.push({ name: item.group ?? '', items: [item] });
  }

  const whileTap = { scale: options?.disabled ? 1 : 0.98 };
  const triggerConfig = {
    whileTap,
    disabled: !!options?.disabled,
    ref: (el: HTMLDivElement) => ref.current && (ref.current[0] = el),
    onClick: () => setIsOpen(!isOpen),
    ...(options?.name && { name: options.name }),
  };

  const contentRef = useRef<HTMLDivElement | null>(null);
  const contentConfig = {
    ref: (el: HTMLDivElement) => ref.current && ((ref.current[1] = el), (contentRef.current = el)),
    variants: contentVariants,
  };

  const serializedValue = JSON.stringify(value);
  const selectedItem = items.find((item) => JSON.stringify(item.value) === serializedValue);
  const triggerInputClassName = clsx('!cursor-pointer flex justify-between items-center gap-2 w-full', className);

  const selectedElementRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (selectedElementRef.current && contentRef.current)
      contentRef.current.scrollTo(0, selectedElementRef.current.offsetTop - 50);
  }, [contentRef, isOpen]);

  const renderItem = (item: SelectItem<T>, idx: number) => {
    const selected = item === selectedItem;
    const className = clsx(baseItemClassName, selected && 'bg-main');
    const onClick = () => (onChange?.(item.value), setIsOpen(false));
    const ref = selected ? selectedElementRef : null;

    return (
      <motion.li key={idx} variants={itemVariants} className={className} onClick={onClick} ref={ref}>
        {item.label}
        {selected && <IconCheck className="h-5 w-5 bg-[var(--primary)] text-white p-0.5 rounded-[50%]" />}
      </motion.li>
    );
  };

  return (
    <motion.div
      initial={'closed'}
      animate={isOpen ? 'open' : 'closed'}
      className={clsx(triggerClassName, 'border-2 border-transparent', options?.disabled && 'pointer-events-none')}
    >
      <Popover controlledOpen={isOpen} placement="bottom-start" sameWidthAsTarget={true} placementOffset={4}>
        <PopoverTrigger
          aria-haspopup="listbox"
          {...triggerConfig}
          className={clsx('w-full relative rounded-lg', isOpen && openClassName)}
        >
          <div className={triggerInputClassName}>
            <div className={clsx('text-0 line-clamp-1 text-left pointer-events-none')}>
              {selectedItem && selectedItem.label}
            </div>
            {arrow && (
              <motion.div {...arrowConfig} className="z-20 text-0 absolute top-1/2 right-4">
                <IconChevronDown className="h-5 w-5" />
              </motion.div>
            )}
          </div>
          {options?.label && <InputLabel {...options} label={options.label} selected={!!selectedItem} />}
        </PopoverTrigger>
        <PopoverContent ref={contentElementRef} className={clsx('p-0 z-100', contentClassName)}>
          <motion.div {...contentConfig}>
            {search && (
              <div className="px-3 pt-3 pb-1 shrink-0">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Filtrer..."
                  className={searchInputClassName}
                />
                {/* <TextInput value={searchText} onChange={setSearchText} options={{ label: 'Rechercher un espace...' }} /> */}
              </div>
            )}
            <motion.ul className={innerContentClassName} role="listbox">
              {shownGroups.map((group, idx) => (
                <motion.li key={idx} variants={itemVariants} role="option">
                  {group.name && <GroupHeading label={group.name} className="px-3 py-2" />}
                  <ul>{group.items.map(renderItem)}</ul>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </PopoverContent>
      </Popover>
    </motion.div>
  );
}
