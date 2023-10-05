'use client';

import SideBarTitle from './SidebarTitle';
import SideBar from '../SideBar';
import AvatarImage from '../../atoms/Image/AvatarImage';
import LinkItem from '../../atoms/Item/LinkItem';

import { useMe } from '../../../_context/navigation';

import { Calendar, Users } from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';

export default function HomeSideBar() {
  const pathname = usePathname();
  const me = useMe();

  const teams = me.teamMemberships.map(({ team }) => (
    <LinkItem
      key={team.id}
      pathname={pathname}
      href={`/team/${team.slug}`}
      label={team.actor.name}
      icon={<AvatarImage actor={team.actor} size={40} type="team" />}
      customIcon={true}
    />
  ));

  return (
    <SideBar>
      <SideBarTitle>Accueil</SideBarTitle>
      <div>
        {[
          ...(teams || []),
          <LinkItem key="teams" pathname={pathname} href="/teams" label="Associations" icon={<Users />} />,
          <LinkItem key="events" pathname={pathname} href="/events" label="Événements" icon={<Calendar />} />,
        ]}
      </div>
    </SideBar>
  );
}
