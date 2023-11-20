// A list of buttons that are displayed horizontally.
// When the list overflows, buttons that don't fit are hidden and their action are added to a dropdown menu.

import OverflowList from './OverflowList';
import Button from '../Button/Button';
import MenuButton from '../Button/MenuButton';

import { DotsThree } from '@phosphor-icons/react/dist/ssr';

import type { ActionProps, ButtonProps } from '@okampus/shared/types';

// TODO: add icon to button props
export type ButtonListProps = {
  buttons: (ButtonProps & { icon: React.ReactNode })[];
  className?: string;
  hiddenActions?: (ActionProps & { icon: React.ReactNode })[];
};
export default function ButtonList({ className, buttons, hiddenActions = [] }: ButtonListProps) {
  return (
    <OverflowList
      className={className}
      items={buttons}
      itemRenderer={Button}
      alwaysRenderOverflow={hiddenActions.length > 0}
      overflowRenderer={(items) => (
        <MenuButton actions={[...items, ...hiddenActions]}>
          <DotsThree className="button-circle" />
        </MenuButton>
      )}
    />
  );
}
