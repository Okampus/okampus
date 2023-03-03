import { motion } from 'framer-motion';
import { forwardRef, useEffect, useState } from 'react';
import { ReactComponent as ArrowDropdown } from '@okampus/assets/svg/icons/arrow-dropdown.svg';
import { clsx } from 'clsx';
import { useOutsideClick } from '@okampus/ui/hooks';
import { mergeRefs } from 'react-merge-refs';

import { Popover, PopoverTrigger, PopoverContent } from '@okampus/ui/atoms';
import type { Ref } from 'react';
import type { Variants } from 'framer-motion';

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

export type SelectItem<T> = { value: T; element: React.ReactNode };

export type SelectMenuProps<T> = {
  items: SelectItem<T>[];
  placeholder: React.ReactNode;
  onChange?: (value: T) => void;
  onClick?: () => void;
  dropdown?: React.ReactNode | null;
  contentClassName?: string;
  contentPadding?: string;
  placeholderClassName?: string;
  placeholderBackgroundClass?: string | boolean;
  itemClassName?: string;
  fullWidth?: boolean;
  showSelected?: boolean;
  isContentAbsolute?: boolean;
  isControlled?: boolean;
  open?: boolean;
};

function SelectMenuInner<T>(
  {
    items,
    placeholder: name,
    onChange,
    onClick,
    dropdown,
    contentClassName,
    contentPadding = '0.5rem',
    placeholderClassName,
    placeholderBackgroundClass = 'bg-0',
    itemClassName = 'hoverable px-4 py-2.5',
    fullWidth,
    isContentAbsolute = true,
    showSelected = true,
    isControlled = false,
    open = false,
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
  const [selectedItem, setSelectedItem] = useState<SelectItem<T> | null>(null);

  const trigger = (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        if (isControlled) setIsOpen(true);
        else setIsOpen(!isOpen);
        onClick?.();
      }}
      className={clsx(
        placeholderClassName,
        placeholderBackgroundClass,
        'flex gap-4 items-center px-4 py-2.5 rounded-lg text-0 medium',
        fullWidth ? 'w-full justify-between' : 'w-fit'
      )}
    >
      {selectedItem && showSelected ? selectedItem.element : name}
      {dropdown === undefined ? (
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
        dropdown
      )}
    </motion.button>
  );

  const content = (
    <motion.ul
      className={clsx(
        'my-1 min-w-full w-fit rounded-xl text-modest text-0 gap-1 flex-col bg-0 z-20',
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
              setSelectedItem(item);
              if (!isControlled) setIsOpen(false);
              if (onChange) onChange(item.value);
            }}
          >
            {item.element}
          </motion.li>
        ))}
    </motion.ul>
  );

  return isContentAbsolute ? (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent className="p-0">{content}</PopoverContent>
    </Popover>
  ) : (
    <motion.div
      ref={mergeRefs([ref, propRef])}
      initial={'closed'}
      animate={isOpen ? 'open' : 'closed'}
      className={clsx('relative', fullWidth ? 'w-full' : 'w-fit')}
    >
      {trigger}
      {content}
    </motion.div>
  );
}

export const SelectMenu = forwardRef(SelectMenuInner);
