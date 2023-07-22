'use client';

import { PopoverContext, usePopover } from './usePopover';
import type { PopoverOptions } from './usePopover';

type PopoverProps = { children: React.ReactNode; triggerOn?: 'click' | 'hover' } & PopoverOptions;
export default function Popover({ children, modal = false, triggerOn = 'click', ...restOptions }: PopoverProps) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover({ modal, triggerOn, ...restOptions });
  return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
}
