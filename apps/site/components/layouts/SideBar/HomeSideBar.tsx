'use client';

import SideBarTitle from './SidebarTitle';
import SideBar from '../SideBar';
import AvatarImage from '../../atoms/Image/AvatarImage';
import LinkItem from '../../atoms/Item/LinkItem';

import { useMe } from '../../../context/navigation';

import { IconUsers } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

export default function HomeSideBar() {
  const pathname = usePathname();
  const me = useMe();

  const teams = me.user.teamMembers.map(({ team }) => (
    <LinkItem
      key={team.id}
      pathname={pathname}
      href={`/team/${team.actor?.slug}`}
      label={team.actor.name}
      icon={<AvatarImage actor={team.actor} size={null} type="team" indicativeSize={40} />}
      customIcon={true}
      large={true}
    />
  ));

  return (
    <SideBar>
      <SideBarTitle>Accueil</SideBarTitle>
      <div>
        {[
          ...(teams || []),
          <LinkItem
            key="teams"
            pathname={pathname}
            href="/teams"
            label="Associations"
            icon={<IconUsers />}
            large={true}
          />,
        ]}
      </div>
    </SideBar>
  );
}
