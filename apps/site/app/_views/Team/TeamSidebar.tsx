import SidebarLinkItem from '../../_components/atoms/Item/SidebarLinkItem';
import Sidebar from '../../_components/layouts/Sidebar';
import SidebarBanner from '../../_components/layouts/SideBar/SidebarBanner';

import { Info, SealCheck, Ticket, Users } from '@phosphor-icons/react/dist/ssr';

import type { ActorWithAvatar } from '../../../types/prisma/Actor/actor-with-avatar';

export type TeamSidebarProps = { team: { slug: string; actor: ActorWithAvatar } };
export default async function TeamSidebar({ team }: TeamSidebarProps) {
  const baseRoute = `/team/${team.slug}`;
  const teamRoute = (route: string) => `${baseRoute}/${route}`;

  const links = [
    { label: 'Présentation', href: baseRoute, icon: <Info />, iconSelected: <Info weight="fill" /> },
    { label: 'Membres', href: teamRoute('members'), icon: <Users />, iconSelected: <Users weight="fill" /> },
    { label: 'Missions', href: teamRoute('jobs'), icon: <SealCheck />, iconSelected: <SealCheck weight="fill" /> },
    { label: 'Événements', href: teamRoute('events'), icon: <Ticket />, iconSelected: <Ticket weight="fill" /> },
  ];

  return (
    <Sidebar header={<SidebarBanner name={team.actor.name} src={team.actor.banner} />}>
      {links.map((link) => (
        <SidebarLinkItem key={link.href} {...link} />
      ))}
    </Sidebar>
  );
}
