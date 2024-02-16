'use client';

import { usePopoverContext } from './usePopover';

import { useCurrentBreakpoint } from '../../../_hooks/useCurrentBreakpoint';
import { FloatingArrow, FloatingFocusManager, FloatingPortal, useMergeRefs } from '@floating-ui/react';

import clsx from 'clsx';

import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef } from 'react';

import type { MotionProps } from 'framer-motion';

type PopoverContentProps = { backgroundClass?: string; popoverClassName?: string; motionConfig?: MotionProps };
export default forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement> & PopoverContentProps>(
  function PopoverContent({ backgroundClass, popoverClassName = '', motionConfig, ...props }, propRef) {
    const currentBreakpoint = useCurrentBreakpoint();
    const isMobile = currentBreakpoint === 'mobile';

    const { context: floatingContext, ...context } = usePopoverContext();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);

    // const side = context.placement.split('-')[0];
    // const staticSide = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[side];

    // const arrowX = context.middlewareData.arrow?.x;
    // const arrowY = context.middlewareData.arrow?.y;

    // const offsetSize = Math.sqrt(2 * context.arrowSize ** 2);
    // const isVertical = side === 'top' || side === 'bottom';
    // const staticOffset = isVertical ? `-${offsetSize / 2 + 1}px` : `-${context.arrowSize + 1}px`;

    return (
      <FloatingPortal>
        <AnimatePresence>
          {context.open && (
            <FloatingFocusManager context={floatingContext} modal={context.modal}>
              <motion.div
                {...motionConfig}
                // initial={{ opacity: 0.5, y: -50 }}
                // animate={{ opacity: 1, scale: 1, y: 0 }}
                // exit={{ opacity: 0, y: 50 }}
                // transition={{ type: 'spring', duration: 0.35 }}
                ref={ref}
                className={clsx(
                  !isMobile && context.useArrow && 'border border-[var(--border-1)] !border-opacity-30',
                  popoverClassName,
                  backgroundClass,
                )}
                style={{
                  position: context.strategy,
                  top: context.y ?? 0,
                  left: context.x ?? 0,
                  width: 'max-content',
                  zIndex: 103,
                  ...props.style,
                }}
                aria-labelledby={context.labelId}
                aria-describedby={context.descriptionId}
                {...context.getFloatingProps(props)}
              >
                {props.children}
                {context.useArrow && <FloatingArrow ref={context.arrowRef} context={floatingContext} />}
              </motion.div>
            </FloatingFocusManager>
          )}
        </AnimatePresence>
      </FloatingPortal>
    );
  },
);
