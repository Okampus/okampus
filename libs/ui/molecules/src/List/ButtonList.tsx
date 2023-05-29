// A list of buttons that are displayed horizontally.
// When the list overflows, button that don't fit are hidden and their action is added to a dropdown menu.

import { OverflowList } from './OverflowList';
import { MenuButton } from '../Button/MenuList';
import { ActionButton } from '../Button/ActionButton';
import { ReactComponent as EllipsisFilledIcon } from '@okampus/assets/svg/icons/material/filled/ellipsis-horizontal.svg';
import type { Action, ActionButtonProps } from '@okampus/shared/types';

export type ButtonListProps = { buttons: ActionButtonProps[]; className?: string; hiddenActions?: Action[] };
export function ButtonList({ className, buttons, hiddenActions = [] }: ButtonListProps) {
  return (
    <OverflowList
      className={className}
      items={buttons}
      itemRenderer={ActionButton}
      alwaysRenderOverflow={hiddenActions.length > 0}
      overflowRenderer={(items) => (
        <MenuButton
          triggerOn="hover"
          menuProps={{ sections: [{ actions: [...items.map((item) => item.action), ...hiddenActions] }] }}
        >
          <EllipsisFilledIcon className="button-circle" />
        </MenuButton>
      )}
    />
  );
}
