import * as React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  Placement,
  FloatingPortal,
  FloatingFocusManager,
  arrow,
  // useId,
} from '@floating-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx } from 'clsx';

interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  arrowSize?: number;
}

export function usePopover({
  initialOpen = false,
  placement = 'bottom',
  modal,
  arrowSize = 8,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: PopoverOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<string | undefined>();

  const arrowRef = React.useRef(null);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const floatingOffset = Math.sqrt(2 * arrowSize ** 2) / 2;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(floatingOffset),
      flip({
        fallbackAxisSideDirection: 'end',
      }),
      shift({ padding: 5 }),
      arrow({ element: arrowRef }),
    ],
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

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
      arrowRef,
    }),
    [open, setOpen, interactions, data, modal, labelId, descriptionId]
  );
}

type ContextType = ReturnType<typeof usePopover> | null;

const PopoverContext = React.createContext<ContextType>(null);

export const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);

  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }

  return context;
};

export function Popover({
  children,
  modal = false,
  ...restOptions
}: {
  children: React.ReactNode;
} & PopoverOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover({ modal, ...restOptions });
  return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & PopoverTriggerProps>(
  function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
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
      <button
        ref={ref}
        type="button"
        // The user can style the trigger based on the state
        data-state={context.open ? 'open' : 'closed'}
        {...context.getReferenceProps(props)}
      >
        {children}
      </button>
    );
  }
);

export const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(function PopoverContent(
  {
    backgroundClass = 'bg-2 border border-color-2',
    ...props
  }: React.HTMLProps<HTMLDivElement> & { backgroundClass?: string },
  propRef
) {
  const { context: floatingContext, ...context } = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  const side = context.placement.split('-')[0];

  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[side];

  const arrowX = context.middlewareData.arrow?.x;
  const arrowY = context.middlewareData.arrow?.y;

  const offsetSize = Math.sqrt(2 * context.arrowSize ** 2);

  return (
    <FloatingPortal>
      <AnimatePresence>
        {context.open && (
          <FloatingFocusManager context={floatingContext} modal={context.modal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ type: 'spring', duration: 0.35 }}
              ref={ref}
              className={clsx('rounded-lg text-1 shadow-lg pb-4 px-5 pt-3 z-10', props.className, backgroundClass)}
              style={{
                position: context.strategy,
                top: context.y ?? 0,
                left: context.x ?? 0,
                width: 'max-content',
                ...props.style,
              }}
              aria-labelledby={context.labelId}
              aria-describedby={context.descriptionId}
              {...context.getFloatingProps(props)}
            >
              <div>{props.children}</div>
              <div
                ref={context.arrowRef}
                style={{
                  position: 'absolute',
                  width: `${offsetSize}px`,
                  height: `${offsetSize / 2}px`,
                  overflow: 'hidden',
                  left: arrowX == null ? '' : `${arrowX}px`,
                  top: arrowY == null ? '' : `${arrowY}px`,
                  right: '',
                  bottom: '',
                  [staticSide as 'top' | 'bottom' | 'left' | 'right']: `-${offsetSize / 2}px`,
                  pointerEvents: 'none',
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
                ></div>
              </div>
            </motion.div>
          </FloatingFocusManager>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
});

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