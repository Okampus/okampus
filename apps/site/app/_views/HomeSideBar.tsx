import SidebarLinkItem from '../_components/atoms/Item/SidebarLinkItem';
import SidebarTitle from '../_components/layouts/SideBar/SidebarTitle';
import Sidebar from '../_components/layouts/Sidebar';

// import { useMe } from '../../../_context/navigation';

import { Calendar, Compass } from '@phosphor-icons/react/dist/ssr';
// import { usePathname } from 'next/navigation';

export type HomeSidebarProps = { title?: string };
export default async function HomeSideBar({ title }: HomeSidebarProps) {
  // const teams = me.teamMemberships.map(({ team }) => (
  //   <LinkItem
  //     key={team.id}
  //     pathname={pathname}
  //     href={`/team/${team.slug}`}
  //     label={team.actor.name}
  //     icon={<<AvatarImage actor={team.actor} size={40} /> />} iconSelected={<<AvatarImage actor={team.actor} size={40} /> weight="fill" />}
  //     customIcon={true}
  //   />
  // ));

  const links = [
    { href: '/', label: 'Accueil', icon: <Calendar />, iconSelected: <Calendar weight="fill" /> },
    { href: '/teams', label: 'Explorer', icon: <Compass />, iconSelected: <Compass weight="fill" /> },
  ];

  return (
    <Sidebar>
      <SidebarTitle>{title ?? 'Accueil'}</SidebarTitle>
      {links.map((link) => (
        <SidebarLinkItem key={link.href} {...link} />
      ))}
      <hr className="m-2 border-[var(--border-2)]" />
      {/* TODO: my links */}
    </Sidebar>
  );
}
