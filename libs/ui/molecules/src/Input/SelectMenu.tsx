import { ReactComponent as ArrowDropdown } from '@okampus/assets/svg/icons/arrow-dropdown.svg';

import { Popover, PopoverTrigger, PopoverContent } from '@okampus/ui/atoms';
import { useOutsideClick } from '@okampus/ui/hooks';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { forwardRef, useEffect, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import type { SelectItem } from '@okampus/shared/types';
import type { Variants } from 'framer-motion';
import type { Ref } from 'react';

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

export type SelectMenuProps<T> = {
  items: SelectItem<T>[];
  placeholder: React.ReactNode;
  onChange?: (value: T) => void;
  onClick?: () => void;
  customDropdown?: React.ReactNode | null;
  contentClassName?: string;
  contentPadding?: string;
  placeholderClassName?: string;
  placeholderBackgroundClass?: string | boolean;
  itemClassName?: string;
  fullWidth?: boolean;
  showSelected?: boolean;
  isContentAbsolute?: boolean;
  isControlled?: boolean;
  value?: T;
  open?: boolean;
  name?: string;
};

function SelectMenuInner<T>(
  {
    items,
    placeholder,
    onChange,
    onClick,
    customDropdown,
    contentClassName,
    contentPadding = '0.5rem',
    placeholderClassName,
    placeholderBackgroundClass = 'bg-0',
    itemClassName = 'px-4 py-2.5',
    fullWidth,
    isContentAbsolute = true,
    showSelected = true,
    isControlled = false,
    open = false,
    value,
    name,
  }: SelectMenuProps<T>,
  propRef: React.ForwardedRef<HTMLDivElement>
) {
  let ref: Ref<HTMLDivElement>, isOpen: boolean, setIsOpen: (isOpen: boolean) => void;

  if (isControlled) {
    ref = { current: null };
    [isOpen, setIsOpen] = useState(false);
  } else {
    [ref, isOpen, setIsOpen] = useOutsideClick<HTMLDivElement>(false);
  }

  useEffect(() => {
    if (isControlled) setIsOpen(open);
  }, [open, isControlled]);
  const [selectedItem, setSelectedItem] = useState<SelectItem<T> | null>(
    items.find((item) => item.value === value) ?? null
  );

  const triggerClassName = clsx(
    placeholderClassName,
    placeholderBackgroundClass,
    'flex gap-4 items-center px-4 py-2.5 rounded-lg text-0 medium',
    fullWidth ? 'w-full justify-between' : 'w-fit'
  );

  const triggerOnClick = () => {
    if (isControlled) setIsOpen(true);
    else setIsOpen(!isOpen);
    onClick?.();
  };

  const trigger = (
    <>
      {showSelected && (selectedItem ? selectedItem.label : placeholder)}
      {customDropdown === undefined ? (
        <motion.div
          variants={{
            open: { rotate: 180 },
            closed: { rotate: 0 },
          }}
          transition={{ duration: 0.2 }}
          style={{ originY: 0.5 }}
        >
          <ArrowDropdown className="h-5" />
        </motion.div>
      ) : (
        customDropdown
      )}
    </>
  );

  const content = (
    <motion.ul
      className={clsx(
        'my-1 min-w-full w-fit rounded-lg text-modest text-0 gap-1 flex-col bg-0 z-20',
        contentClassName,
        isOpen ? 'flex' : '!hidden',
        isContentAbsolute && 'h-max-[20rem]'
      )}
      variants={{
        open: {
          display: 'block',
          height: 'auto',
          opacity: 1,
          transformOrigin: 'top',
          transition: {
            type: 'spring',
            bounce: 0,
            duration: 0.7,
            delayChildren: 0.1,
            staggerChildren: 0.1,
          },
        },
        closed: {
          height: 0,
          opacity: 0.1,
          transformOrigin: 'bottom',
          transition: {
            type: 'spring',
            bounce: 0,
            duration: 0.4,
          },
        },
      }}
      style={{
        pointerEvents: isOpen ? 'auto' : 'none',
        paddingLeft: contentPadding,
        paddingRight: contentPadding,
      }}
    >
      {items &&
        items.map((item, index) => (
          <motion.li
            key={index}
            variants={itemVariants}
            className={clsx('cursor-pointer', itemClassName)}
            onClick={() => {
              console.log('item', item);
              setSelectedItem(item);
              if (!isControlled) setIsOpen(false);
              if (onChange) onChange(item.value);
            }}
          >
            {item.label}
          </motion.li>
        ))}
    </motion.ul>
  );

  return isContentAbsolute ? (
    <motion.div
      className={clsx(fullWidth ? 'w-full' : 'w-fit')}
      initial={'closed'}
      animate={isOpen ? 'open' : 'closed'}
    >
      <Popover controlledOpen={isOpen} placement="bottom-start">
        <PopoverTrigger
          name={name}
          motionConfig={{ whileTap: { scale: 0.95 } }}
          onClick={triggerOnClick}
          className={triggerClassName}
        >
          {trigger}
        </PopoverTrigger>
        <PopoverContent className="p-0 z-100">{content}</PopoverContent>
      </Popover>
    </motion.div>
  ) : (
    <motion.div
      ref={mergeRefs([ref, propRef])}
      initial={'closed'}
      animate={isOpen ? 'open' : 'closed'}
      className={clsx('relative', fullWidth ? 'w-full' : 'w-fit')}
    >
      <motion.button name={name} whileTap={{ scale: 0.95 }} onClick={triggerOnClick} className={triggerClassName}>
        {trigger}
      </motion.button>
      {content}
    </motion.div>
  );
}

type SelectMenuWithRefProps<T> = SelectMenuProps<T> & { ref?: React.Ref<HTMLDivElement> };

export function SelectMenu<T>({ ref, ...props }: SelectMenuWithRefProps<T>) {
  const SelectMenuWithRef = forwardRef<HTMLDivElement, SelectMenuProps<T>>(SelectMenuInner);
  return <SelectMenuWithRef ref={ref} {...props} />;
}
