import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx } from 'clsx';

import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useHover,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  FloatingFocusManager,
  arrow,
  safePolygon,
} from '@floating-ui/react';
import type { MotionProps } from 'framer-motion';
import type { Placement } from '@floating-ui/react';

interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  triggerOn?: 'click' | 'hover';
  controlledOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  arrowSize?: number;
  useArrow?: boolean;
  crossAxis?: boolean;
  forcePlacement?: boolean;
  placementOffset?: number;
  shiftOffset?: number;
}

export function usePopover({
  initialOpen = false,
  placement = 'right',
  modal,
  triggerOn = 'click',
  arrowSize = 14,
  useArrow = false,
  crossAxis = true,
  forcePlacement = false,
  placementOffset = 0,
  shiftOffset = 0,
  controlledOpen,
  onOpenChange,
}: PopoverOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<string | undefined>();

  const arrowRef = React.useRef(null);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const floatingOffset = Math.sqrt(2 * arrowSize ** 2) / 2;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      flip({ fallbackAxisSideDirection: forcePlacement ? 'none' : 'end', crossAxis }),
      shift({ padding: shiftOffset }),
      ...(useArrow
        ? [offset(floatingOffset + placementOffset), arrow({ element: arrowRef })]
        : [offset(placementOffset)]),
    ],
  });

  const context = data.context;

  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([
    triggerOn === 'click'
      ? useClick(context, { enabled: controlledOpen == null })
      : useHover(context, { enabled: controlledOpen == null, handleClose: safePolygon() }),
    dismiss,
    role,
  ]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      arrowSize,
      ...interactions,
      ...data,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
      useArrow,
      arrowRef,
    }),
    [open, setOpen, interactions, data, modal, labelId, descriptionId]
  );
}

type ContextType = ReturnType<typeof usePopover> | null;
const PopoverContext = React.createContext<ContextType>(null);

export const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);
  if (context == null) throw new Error('Popover components must be wrapped in <Popover />');
  return context;
};

type PopoverProps = { children: React.ReactNode; triggerOn?: 'click' | 'hover' } & PopoverOptions;
export function Popover({ children, modal = false, triggerOn = 'click', ...restOptions }: PopoverProps) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover({ modal, triggerOn, ...restOptions });
  return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
}

type PopoverTriggerProps = { children: React.ReactNode; asChild?: boolean; motionConfig?: MotionProps };
export const PopoverTrigger = React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & PopoverTriggerProps>(
  function PopoverTrigger({ children, asChild = false, motionConfig, ...props }, propRef) {
    const context = usePopoverContext();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const childrenRef = (children as any).ref;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]) as any;

    // `asChild` allows the user to pass any element as the anchor
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          'data-state': context.open ? 'open' : 'closed',
        })
      );
    }

    return (
      <motion.button
        ref={ref}
        type="button"
        // The user can style the trigger based on the state
        data-state={context.open ? 'open' : 'closed'}
        {...context.getReferenceProps(props)}
        {...motionConfig}
      >
        {children}
      </motion.button>
    );
  }
);

type PopoverContentProps = { backgroundClass?: string; popoverClassName?: string; motionConfig?: MotionProps };
export const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement> & PopoverContentProps>(
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
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: 'spring', duration: 0.35 }}
                ref={ref}
                className={clsx(
                  context.useArrow && 'border-4 border-color-2 !border-opacity-30',
                  popoverClassName,
                  backgroundClass,
                  'overflow-hidden'
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
                <div>{props.children}</div>
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

export const PopoverClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function PopoverClose({ children, ...props }, ref) {
    const { setOpen } = usePopoverContext();
    return (
      <button type="button" {...props} ref={ref} onClick={() => setOpen(false)}>
        {children}
      </button>
    );
  }
);
