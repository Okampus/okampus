'use client';

import TabBarItem from './TabBarItem';
import AvatarImage from '../../atoms/Image/AvatarImage';

import { useMe } from '../../../context/navigation';
import { getAvatar } from '../../../utils/actor-image/get-avatar';

import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus.svg';

import { isNotNull, arrayNotEmptyOrNull } from '@okampus/shared/utils';
import { usePathname } from 'next/navigation';
import { IconCalendarEvent, IconUsers } from '@tabler/icons-react';

export default function TabBar() {
  const me = useMe();
  const pathname = usePathname();
  const tenant = me?.user.tenant;

  const adminTeam = tenant?.adminTeam;
  const tenantAvatar = getAvatar(adminTeam?.actor?.actorImages);

  const shortcuts = arrayNotEmptyOrNull(me?.user.shortcuts.map((shortcut) => shortcut?.actor).filter(isNotNull));

  return (
    <nav className="h-full shrink-0 w-[var(--w-tabbar)] flex flex-col scrollbar-on-hover gap-2 py-2 bg-0">
      <TabBarItem pathname={pathname} label="Accueil" href="/">
        <OkampusLogo className="p-1.5" />
      </TabBarItem>
      <TabBarItem pathname={pathname} label="Tenant" href="/tenant">
        <AvatarImage name={adminTeam?.actor?.name} src={tenantAvatar?.image.url} />
      </TabBarItem>
      <TabBarItem pathname={pathname} icon={<IconCalendarEvent />} label="Calendrier" href="/events" />
      <TabBarItem pathname={pathname} icon={<IconUsers />} label="Équipes" href="/teams" />
      {shortcuts && (
        <>
          <hr className="border-color-2 ml-5 my-1" />
          {shortcuts.map((shortcutActor) => (
            <TabBarItem
              key={shortcutActor.id}
              pathname={pathname}
              label={shortcutActor.name}
              href={`/manage/team/${shortcutActor.slug}`}
            >
              <AvatarImage actor={shortcutActor} />
            </TabBarItem>
          ))}
        </>
      )}
    </nav>
  );
}
