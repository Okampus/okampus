'use client';

import Backdrop from '../atoms/Layout/Backdrop';
import clsx from 'clsx';

export type SidepanelWrapperProps = {
  children: React.ReactNode;
  topPadding?: boolean;
};

const sidepanelClass =
  'h-full shrink-0 bg-[var(--bg-main)] w-[var(--w-sidepanel)] overflow-x-hidden md:relative xl-max:hidden md-max:absolute xl-max:top-0 xl-max:right-0 xl-max:[&.active]:block md-max:[&.active]:z-[103] md-max:[&.active+div]:block';

export default function Sidepanel({ children, topPadding = true }: SidepanelWrapperProps) {
  return (
    <>
      <aside id="sidepanel" className={clsx(sidepanelClass, topPadding && 'pt-4')}>
        {children}
      </aside>
      <Backdrop className="hidden" activeElementSelector="#sidepanel" />
    </>
  );
}
