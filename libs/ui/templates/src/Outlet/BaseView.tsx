import { NavigationContext } from '@okampus/ui/hooks';

import clsx from 'clsx';
import { useContext, useEffect } from 'react';

export type BaseViewProps = {
  children: React.ReactNode;
  className?: string;
  topbar?: React.ReactNode;
  isTopbarAlwaysShown?: boolean;
};

export function BaseView({
  children,
  className = 'px-content py-content',
  topbar,
  isTopbarAlwaysShown,
}: BaseViewProps) {
  const { setTopbar, setIsTopbarAlwaysShown } = useContext(NavigationContext);

  useEffect(() => (setTopbar(topbar), setIsTopbarAlwaysShown(!!isTopbarAlwaysShown)), []);
  useEffect(() => () => (setTopbar(null), setIsTopbarAlwaysShown(false)), []);

  return <div className={clsx(className, 'flex flex-col text-0')}>{children}</div>;
}
