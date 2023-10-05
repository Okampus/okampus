// A list of buttons that are displayed horizontally.
// When the list overflows, buttons that don't fit are hidden and their action are added to a dropdown menu.

import OverflowList from './OverflowList';
import ActionButton from '../Button/ActionButton';
import MenuButton from '../Button/MenuButton';
import { DotsThree } from '@phosphor-icons/react/dist/ssr';
import type { Action, ActionButtonProps } from '@okampus/shared/types';

export type ButtonListProps = { buttons: ActionButtonProps[]; className?: string; hiddenActions?: Action[] };
export default function ButtonList({ className, buttons, hiddenActions = [] }: ButtonListProps) {
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
          <DotsThree className="button-circle" />
        </MenuButton>
      )}
    />
  );
}
