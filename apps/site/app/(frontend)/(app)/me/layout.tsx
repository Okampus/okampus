'use client';

import UserSideBar from '../../../../app/_components/layouts/SideBar/UserSideBar';
import UserSidePanel from '../../../../app/_components/layouts/SidePanel/UserSidePanel';

import { useMe } from '../../../_context/navigation';

type MeLayoutProps = { children: React.ReactNode };
export default function MeLayout({ children }: MeLayoutProps) {
  const me = useMe();

  return (
    <>
      <UserSideBar user={me} />
      {children}
      <UserSidePanel user={me} />
    </>
  );
}
