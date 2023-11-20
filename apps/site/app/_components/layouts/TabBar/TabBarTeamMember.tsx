'use client';

import TabBarItem from './TabBarItem';
import AvatarImage from '../../atoms/Image/AvatarImage';

import { useMe } from '../../../_hooks/context/useMe';

export default function TabBarTeamMember() {
  const { data: me } = useMe();

  return me.teamMemberships.map(({ team }) => {
    const icons = { base: <AvatarImage className="w-7 h-7 rounded-lg" actor={team.actor} /> };
    const regex = `(/team/${team.slug}|/manage/team/${team.slug})`;
    const action = `/manage/team/${team.slug}`;

    const tabBarItemProps = { icons, regex, action, isCustomIcon: true, label: team.actor.name };
    return <TabBarItem key={team.id} {...tabBarItemProps} />;
  });
}
