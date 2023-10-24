'use client';

import {
  arrow,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useClick,
  useHover,
} from '@floating-ui/react';

import { createContext, useContext, useMemo, useRef, useState } from 'react';

import type { FloatingContext, Placement, ReferenceType } from '@floating-ui/react';

export type PopoverOptions = {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  triggerOn?: 'click' | 'hover';
  controlledOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  arrowSize?: number;
  useArrow?: boolean;
  sameWidthAsTarget?: boolean;
  crossAxis?: boolean;
  forcePlacement?: boolean;
  placementCrossOffset?: number;
  placementOffset?: number;
  shiftOffset?: number;
};

export function usePopover({
  initialOpen = false,
  placement = 'right',
  modal,
  triggerOn = 'click',
  arrowSize = 14,
  useArrow = false,
  sameWidthAsTarget = true,
  crossAxis = true,
  forcePlacement = false,
  placementOffset = 0,
  placementCrossOffset = 0,
  shiftOffset = 0,
  controlledOpen,
  onOpenChange,
}: PopoverOptions = {}): {
  arrowRef: React.RefObject<HTMLDivElement>;
  arrowSize: number;
  useArrow: boolean;
  modal?: boolean;
  open: boolean;
  labelId?: string;
  descriptionId?: string;
  setOpen: (open: boolean) => void;
  setLabelId: (id: string) => void;
  setDescriptionId: (id: string) => void;
  getReferenceProps: (props?: Record<string, unknown>) => Record<string, unknown>;
  getFloatingProps: (props?: Record<string, unknown>) => Record<string, unknown>;
  getItemProps: (props?: Record<string, unknown>) => Record<string, unknown>;
  placement: Placement;
  x: number;
  y: number;
  isPositioned: boolean;
  update: () => void;
  strategy: 'fixed' | 'absolute';
  middlewareData: { arrow?: { x?: number; y?: number } };
  refs: {
    reference: React.RefObject<ReferenceType>;
    floating: React.RefObject<ReferenceType>;
    setReference: (ref: HTMLElement | null) => void;
    setFloating: (ref: HTMLElement | null) => void;
  };
  context: FloatingContext<ReferenceType>;
} {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  const [labelId, setLabelId] = useState<string | undefined>();
  const [descriptionId, setDescriptionId] = useState<string | undefined>();

  const arrowRef = useRef(null);

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
      ...(sameWidthAsTarget
        ? [
            size({
              apply({ rects, elements }) {
                elements.floating.style.minWidth = `${rects.reference.width}px`;
              },
            }),
          ]
        : []),
      ...(useArrow
        ? [
            offset({ mainAxis: floatingOffset + placementOffset, crossAxis: placementCrossOffset }),
            arrow({ element: arrowRef }),
          ]
        : [offset({ mainAxis: placementOffset, crossAxis: placementCrossOffset })]),
    ],
  });

  const openInteractionHook = triggerOn === 'click' ? useClick : useHover;
  const openInteraction = openInteractionHook(data.context, {
    enabled: controlledOpen == null,
    handleClose: safePolygon(),
  });

  const dismiss = useDismiss(data.context);
  const role = useRole(data.context);

  const interactions = useInteractions([openInteraction, dismiss, role]);

  return useMemo(
    () => ({
      arrowRef,
      arrowSize,
      useArrow,
      modal,
      open,
      labelId,
      descriptionId,
      setOpen,
      setLabelId,
      setDescriptionId,
      ...interactions,
      ...data,
    }),
    [open, setOpen, arrowSize, interactions, data, modal, labelId, descriptionId, useArrow],
  );
}

type ContextType = ReturnType<typeof usePopover> | null;
export const PopoverContext = createContext<ContextType>(null);
export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (context == null) throw new Error('Popover components must be wrapped in <Popover />');
  return context;
};
