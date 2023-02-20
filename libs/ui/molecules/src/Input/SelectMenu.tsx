import { motion } from 'framer-motion';
import { forwardRef, useEffect, useState } from 'react';
import { ReactComponent as ArrowDropdown } from '@okampus/assets/svg/icons/arrow-dropdown.svg';
import { clsx } from 'clsx';
import { useOutsideClick } from '@okampus/ui/hooks';
import { mergeRefs } from 'react-merge-refs';

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
  placeholderClassName?: string;
  placeholderBackgroundClass?: string;
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
    placeholderClassName,
    placeholderBackgroundClass = 'bg-0',
    itemClassName = 'px-4 py-2.5',
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
  const [selected, setSelected] = useState<SelectItem<T> | null>(null);

  return (
    <motion.div
      ref={mergeRefs([ref, propRef])}
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className={clsx('relative', fullWidth ? 'w-full' : 'w-fit')}
    >
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          if (isControlled) setIsOpen(true);
          else setIsOpen(!isOpen);
          onClick?.();
        }}
        className={clsx(
          'flex gap-4 items-center px-4 py-2.5 rounded-lg text-0 medium',
          fullWidth ? 'w-full justify-between' : 'w-fit',
          placeholderClassName,
          placeholderBackgroundClass
        )}
      >
        {selected && showSelected ? selected.element : name}
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
      <motion.ul
        className={clsx(
          'mt-1 min-w-full w-fit rounded-lg text-modest p-2 text-0 gap-1 flex flex-col bg-0 z-20',
          contentClassName,
          isContentAbsolute ? 'absolute h-max-[20rem]' : ''
        )}
        variants={{
          open: {
            ...(isContentAbsolute ? { scale: 1 } : { height: 'auto' }),
            opacity: 1,
            transformOrigin: 'top',
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.7,
              delayChildren: 0.15,
              staggerChildren: 0.05,
            },
          },
          closed: {
            ...(isContentAbsolute ? { scale: 0 } : { height: 0 }),
            opacity: 0,
            transformOrigin: 'top',
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.2,
            },
          },
        }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        {items &&
          items.map((item, index) => (
            <motion.li
              key={index}
              variants={itemVariants}
              className={clsx('hoverable cursor-pointer', itemClassName)}
              onClick={() => {
                setSelected(item);
                if (!isControlled) setIsOpen(false);
                if (onChange) onChange(item.value);
              }}
            >
              {item.element}
            </motion.li>
          ))}
      </motion.ul>
    </motion.div>
  );
}

export const SelectMenu = forwardRef(SelectMenuInner);
