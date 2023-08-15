'use client';

import SideBar from '../SideBar';
import GroupItem from '../../atoms/Item/GroupItem';
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
      <GroupItem
        headingClassName="ml-3 mt-6 opacity-60"
        heading="Vos associations"
        groupClassName="flex flex-col gap-1"
      >
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
      </GroupItem>
    </SideBar>
  );
}
