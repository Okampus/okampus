'use client';

import MenuButton from '../_components/molecules/Button/MenuButton';

import { useCurrentBreakpoint } from '../_hooks/useCurrentBreakpoint';
import { DotsThree, DotsThreeVertical } from '@phosphor-icons/react';

import clsx from 'clsx';

import type { MenuActionProps } from '@okampus/shared/types';

export default function MoreButton(props: MenuActionProps) {
  const isMobile = useCurrentBreakpoint() === 'mobile';
  return (
    <MenuButton {...props} className={clsx(props.className, 'p-1.5 hover:bg-[var(--bg-1)] rounded-[50%]')}>
      {isMobile ? (
        <DotsThreeVertical weight="bold" className="w-6 h-6 md:w-7 md:h-7" />
      ) : (
        <DotsThree weight="bold" className="w-6 h-6 md:w-7 md:h-7" />
      )}
    </MenuButton>
  );
}
