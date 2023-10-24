import MenuList from './MenuList';
import Popover from '../../atoms/Popup/Popover/Popover';
import PopoverContent from '../../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../../atoms/Popup/Popover/PopoverTrigger';

import clsx from 'clsx';

import type { MenuProps } from '@okampus/shared/types';
import type { Placement } from '@floating-ui/react';

export type MenuButtonProps = {
  children: React.ReactNode;
  triggerOn: 'click' | 'hover';
  menuProps: MenuProps;
  className?: string;
  placement?: Placement;
  placementOffset?: number;
};

export default function MenuButton({
  children,
  triggerOn,
  menuProps,
  className,
  placement,
  placementOffset,
}: MenuButtonProps) {
  return (
    <Popover
      triggerOn={triggerOn}
      forcePlacement={true}
      placement={placement ?? 'bottom-start'}
      placementOffset={placementOffset ?? 10}
    >
      <PopoverTrigger className={clsx(className)}>{children}</PopoverTrigger>

      <PopoverContent>
        <MenuList {...menuProps} />
      </PopoverContent>
    </Popover>
  );
}
