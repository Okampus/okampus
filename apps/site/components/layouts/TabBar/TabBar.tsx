'use client';

import TabBarItem from './TabBarItem';
import AvatarImage from '../../atoms/Image/AvatarImage';

import { useMe, useTenant } from '../../../context/navigation';
import { getAvatar } from '../../../utils/actor-image/get-avatar';

import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus.svg';

import { isNotNull, arrayNotEmptyOrNull } from '@okampus/shared/utils';
import { usePathname } from 'next/navigation';
import { IconBrandSafari, IconCalendarEvent } from '@tabler/icons-react';

export default function TabBar() {
  const me = useMe();
  const pathname = usePathname();

  const { tenant } = useTenant();
  if (!tenant) return null;

  const tenantAvatar = getAvatar(tenant.adminTeam?.actor.actorImages);

  const shortcuts = arrayNotEmptyOrNull(me.user.shortcuts.map((shortcut) => shortcut.actor).filter(isNotNull));

  return (
    <nav className="h-full shrink-0 w-[var(--w-tabbar)] flex flex-col justify-between bg-0">
      <div className="flex flex-col scrollbar-on-hover">
        <TabBarItem pathname={pathname} label="Accueil" href="/">
          <OkampusLogo className="p-1.5" />
        </TabBarItem>
        <TabBarItem pathname={pathname} label="Tenant" href="/tenant">
          <AvatarImage size={20} name={tenant.adminTeam?.actor?.name} src={tenantAvatar?.image.url} />
        </TabBarItem>
        <TabBarItem pathname={pathname} icon={<IconCalendarEvent />} label="Calendrier" href="/events" />
        <TabBarItem pathname={pathname} icon={<IconBrandSafari />} label="Équipes" href="/teams" />
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
      </div>
      <div className="flex flex-col gap-2"></div>
    </nav>
  );
}
