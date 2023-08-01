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

import type { Placement } from '@floating-ui/react';

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
}: PopoverOptions = {}) {
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

  const onClick =
    triggerOn === 'click'
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useClick(data.context, { enabled: controlledOpen == null })
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useHover(data.context, { enabled: controlledOpen == null, handleClose: safePolygon() });
  const dismiss = useDismiss(data.context);
  const role = useRole(data.context);

  const interactions = useInteractions([onClick, dismiss, role]);

  return useMemo(
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
    [open, setOpen, arrowSize, interactions, data, modal, labelId, descriptionId, useArrow]
  );
}

type ContextType = ReturnType<typeof usePopover> | null;
export const PopoverContext = createContext<ContextType>(null);
export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (context == null) throw new Error('Popover components must be wrapped in <Popover />');
  return context;
};
