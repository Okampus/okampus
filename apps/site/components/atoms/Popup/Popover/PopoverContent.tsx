'use client';

import { usePopoverContext } from './usePopover';

import { FloatingFocusManager, FloatingPortal, useMergeRefs } from '@floating-ui/react';

import clsx from 'clsx';

import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef } from 'react';

import type { MotionProps } from 'framer-motion';

type PopoverContentProps = { backgroundClass?: string; popoverClassName?: string; motionConfig?: MotionProps };
export default forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement> & PopoverContentProps>(
  function PopoverContent({ backgroundClass, popoverClassName = '', ...props }, propRef) {
    const { context: floatingContext, ...context } = usePopoverContext();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);

    const side = context.placement.split('-')[0];
    const staticSide = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[side];

    const arrowX = context.middlewareData.arrow?.x;
    const arrowY = context.middlewareData.arrow?.y;

    const offsetSize = Math.sqrt(2 * context.arrowSize ** 2);
    const isVertical = side === 'top' || side === 'bottom';
    const staticOffset = isVertical ? `-${offsetSize / 2 + 1}px` : `-${context.arrowSize + 1}px`;

    return (
      <FloatingPortal>
        <AnimatePresence>
          {context.open && (
            <FloatingFocusManager context={floatingContext} modal={context.modal}>
              <motion.div
                initial={{ opacity: 0.5, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: 'spring', duration: 0.35 }}
                ref={ref}
                className={clsx(
                  context.useArrow && 'border-4 border-color-2 !border-opacity-30',
                  popoverClassName,
                  backgroundClass
                )}
                style={{
                  position: context.strategy,
                  top: context.y ?? 0,
                  left: context.x ?? 0,
                  width: 'max-content',
                  zIndex: 1001,
                  ...props.style,
                }}
                aria-labelledby={context.labelId}
                aria-describedby={context.descriptionId}
                {...context.getFloatingProps(props)}
              >
                {props.children}
                {context.useArrow && staticSide && ['top', 'bottom', 'left', 'right'].includes(staticSide) && (
                  <div
                    ref={context.arrowRef}
                    style={{
                      position: 'absolute',
                      width: `${offsetSize}px`,
                      height: `${offsetSize / 2}px`,
                      overflow: 'hidden',
                      left: arrowX == null ? '' : `${arrowX}px`,
                      top: arrowY == null ? '' : `${arrowY}px`,
                      [staticSide]: staticOffset,
                      pointerEvents: 'none',
                      transform: `rotate(${{ top: 180, right: 270, bottom: 0, left: 90 }[side]}deg)`,
                    }}
                  >
                    <div
                      className={backgroundClass}
                      style={{
                        margin: (offsetSize - context.arrowSize) / 2,
                        boxSizing: 'border-box',
                        width: `${context.arrowSize}px`,
                        height: `${context.arrowSize}px`,
                        transform: 'rotate(45deg)',
                      }}
                    />
                  </div>
                )}
              </motion.div>
            </FloatingFocusManager>
          )}
        </AnimatePresence>
      </FloatingPortal>
    );
  }
);