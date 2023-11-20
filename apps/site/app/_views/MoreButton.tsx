'use client';

import MenuButton from '../_components/molecules/Button/MenuButton';

import { useCurrentBreakpoint } from '../_hooks/useCurrentBreakpoint';
import { DotsThree, DotsThreeVertical } from '@phosphor-icons/react';

import clsx from 'clsx';

import type { MenuActionProps } from '@okampus/shared/types';

export default function MoreButton(props: MenuActionProps) {
  const isMobile = useCurrentBreakpoint() === 'mobile';
  return (
    <MenuButton {...props} className={clsx(props.className, 'h-10 w-10 p-2 hover:bg-[var(--bg-1)] rounded-[50%]')}>
      {isMobile ? <DotsThreeVertical /> : <DotsThree />}
    </MenuButton>
  );
}
