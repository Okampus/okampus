import SidebarLinkItem from '../../_components/atoms/Item/SidebarLinkItem';
import Sidebar from '../../_components/layouts/Sidebar';

import { SignOut, UserFocus } from '@phosphor-icons/react/dist/ssr';

export function MeSidebar() {
  const links = [
    { label: 'Présentation', href: '/me', icon: <UserFocus /> },
    { label: 'Se déconnecter', href: '/api/auth/signout', icon: <SignOut /> },
  ];

  return (
    <Sidebar>
      {links.map((link) => (
        <SidebarLinkItem key={link.href} {...link} />
      ))}
    </Sidebar>
  );
}
