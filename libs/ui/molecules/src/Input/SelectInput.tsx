import { ReactComponent as ArrowDropdown } from '@okampus/assets/svg/icons/arrow-dropdown.svg';

import { Popover, PopoverTrigger, PopoverContent } from '@okampus/ui/atoms';
import { useOutsideClick } from '@okampus/ui/hooks';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import type { RefObject, Ref } from 'react';
import type { InputOptions, SelectItem } from '@okampus/shared/types';
import type { ValidRefTarget } from '@okampus/ui/hooks';
import type { Variants } from 'framer-motion';

export type SelectInputProps<T> = {
  items: SelectItem<T>[];
  className?: string;
  value: T | null;
  onChange: (value: T) => void;
  triggerOnClick?: () => void;
  arrow?: boolean;
  contentElementRef?: Ref<HTMLDivElement>;
  options: InputOptions;
};

const transition = { type: 'spring', bounce: 0, duration: 0.4, delayChildren: 0.025, staggerChildren: 0.025 };
const contentVariants: Variants = {
  open: { height: 'auto', opacity: 1, transformOrigin: 'top', display: 'block', transition },
  closed: { height: 0, opacity: 0.1, transformOrigin: 'bottom', transition },
};

const itemVariants: Variants = {
  open: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const setRefIndex = (idx: number, ref: RefObject<(ValidRefTarget | null)[]>) => (el: HTMLElement | null) => {
  if (ref.current) ref.current[idx] = el;
};

export function SelectInput<T>({
  items,
  className = 'input',
  value,
  onChange,
  triggerOnClick,
  arrow = true,
  contentElementRef,
  options,
}: SelectInputProps<T>) {
  const [ref, isOpen, setIsOpen] = useOutsideClick(false);
  const onClick = () => (triggerOnClick?.(), setIsOpen(!isOpen));

  const disabled = options.disabled;
  const whileTap = { scale: disabled ? 1 : 0.98 };
  const triggerConfig = { whileTap, disabled, ref: setRefIndex(0, ref), name: options.name, onClick };
  const contentConfig = { ref: setRefIndex(1, ref), variants: contentVariants };
  const arrowConfig = { variants: { open: { rotate: 180 }, closed: { rotate: 0 } }, transition: { duration: 0.2 } };

  const selectedItem = items.find((item) => item.value === value);
  const triggerInputClassName = clsx('w-full !cursor-pointer flex justify-between gap-2', className);
  const contentClassName = clsx('flex flex-col max-h-[16rem] overflow-y-scroll scrollbar rounded text-0 bg-1 z-20');

  const contentRef = useRef<HTMLUListElement>(null);
  const selectedElementRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (selectedElementRef.current && contentRef.current)
      contentRef.current.scrollTo(0, selectedElementRef.current.offsetTop - 50);
  }, [contentRef, isOpen]);

  return (
    <motion.div initial={'closed'} animate={isOpen ? 'open' : 'closed'} className="w-full">
      <Popover controlledOpen={isOpen} placement="bottom-start" sameWidthAsTarget={true}>
        <PopoverTrigger {...triggerConfig} className="w-full relative">
          <div className={triggerInputClassName}>
            <div className={clsx('text-0 line-clamp-1 text-left', options.label && 'pt-6')}>
              {selectedItem && selectedItem.label}
            </div>
            {arrow && (
              <motion.div {...arrowConfig} className="h-4 aspect-square text-0" style={{ originY: 0.5 }}>
                <ArrowDropdown />
              </motion.div>
            )}
          </div>
          <label htmlFor={options.name} className={clsx('input-label left-0', selectedItem && 'selected')}>
            {options.label}
            {options.required && <span className="text-red-500">*</span>}
          </label>
        </PopoverTrigger>
        <PopoverContent ref={contentElementRef} className={clsx('p-0 z-100', contentClassName)}>
          <motion.ul {...contentConfig} className={contentClassName} ref={contentRef}>
            {items &&
              items.map((item, index) => {
                const isSelectedItem = item.value === value;
                const onClick = () => (setIsOpen(false), onChange(item.value));
                const itemClassName = clsx('cursor-pointer py-2 text-0 bg-2-hover px-5', isSelectedItem && 'bg-4');
                const ref = isSelectedItem ? selectedElementRef : null;
                return (
                  <motion.li ref={ref} key={index} variants={itemVariants} className={itemClassName} onClick={onClick}>
                    {item.label}
                  </motion.li>
                );
              })}
          </motion.ul>
        </PopoverContent>
      </Popover>
    </motion.div>
  );
}
