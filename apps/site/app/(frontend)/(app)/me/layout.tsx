'use client';

import UserSideBar from '../../../../components/layouts/SideBar/UserSideBar';
import UserSidePanel from '../../../../components/layouts/SidePanel/UserSidePanel';

import { useMe } from '../../../../context/navigation';

type MeLayoutProps = { children: React.ReactNode };
export default function MeLayout({ children }: MeLayoutProps) {
  const me = useMe();

  return (
    <>
      <UserSideBar user={me.user} />
      {children}
      <UserSidePanel user={me.user} />
    </>
  );
}
