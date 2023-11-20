'use client';

import { usePopoverContext } from './usePopover';
import { cloneElement, forwardRef, isValidElement } from 'react';
import { useMergeRefs } from '@floating-ui/react';
import { motion } from 'framer-motion';

import type { MotionProps } from 'framer-motion';

type PopoverTriggerProps = { children: React.ReactNode; asChild?: boolean; motionConfig?: MotionProps };
export default forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & PopoverTriggerProps>(function PopoverTrigger(
  { children, asChild = false, motionConfig, ...props },
  propRef,
) {
  const context = usePopoverContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useMergeRefs([context.refs.setReference, propRef, (children as any).ref]) as any;

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && isValidElement(children)) {
    const elementProps = { ref, ...props, ...children.props, 'data-state': context.open ? 'open' : 'closed' };
    return cloneElement(children, context.getReferenceProps(elementProps));
  }

  const triggerProps = { ref, ...context.getReferenceProps(props), 'data-state': context.open ? 'open' : 'closed' };
  return (
    <motion.button type="button" {...motionConfig} {...triggerProps}>
      {children}
    </motion.button>
  );
});
