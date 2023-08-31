'use client';

import TabBarItem from './TabBarItem';
import AvatarImage from '../../atoms/Image/AvatarImage';
import DarkModeToggle from '../../molecules/Input/DarkModeToggle';

import { notificationAtom } from '../../../context/global';
import { useMe, useTenant } from '../../../context/navigation';

import { useLocale } from '../../../hooks/context/useLocale';
import { useTheme } from '../../../hooks/context/useTheme';

import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus.svg';
import { isNotNull, arrayNotEmptyOrNull } from '@okampus/shared/utils';

import { usePathname } from 'next/navigation';
import { IconBrandSafari, IconCalendarEvent } from '@tabler/icons-react';
import { useAtom } from 'jotai';

export default function TabBar() {
  const me = useMe();
  const pathname = usePathname();

  const [theme, toggleTheme] = useTheme();
  const [locale, setLocale] = useLocale();
  const [, setNotification] = useAtom(notificationAtom);

  const { tenant } = useTenant();
  if (!tenant) return null;

  const shortcuts = arrayNotEmptyOrNull(me.user.shortcuts.map((shortcut) => shortcut.actor).filter(isNotNull));

  return (
    <nav className="h-full shrink-0 w-[var(--w-tabbar)] flex flex-col justify-between border-r border-color-1">
      <div className="flex flex-col scrollbar-on-hover">
        <TabBarItem pathname={pathname} label="Accueil" linkOrAction="/">
          <OkampusLogo className="p-1.5" />
        </TabBarItem>
        <TabBarItem pathname={pathname} label="Tenant" linkOrAction="/tenant">
          <AvatarImage
            size={52}
            name={tenant.adminTeam?.actor?.name}
            src={tenant.adminTeam?.actor.avatar}
            type="none"
            hasBorder={false}
          />
        </TabBarItem>
        <TabBarItem pathname={pathname} icon={<IconCalendarEvent />} label="Calendrier" linkOrAction="/events" />
        <TabBarItem pathname={pathname} icon={<IconBrandSafari />} label="Équipes" linkOrAction="/teams" />
        {shortcuts && (
          <>
            <hr className="border-color-2 ml-5 my-1" />
            {shortcuts.map((shortcutActor) => (
              <TabBarItem
                key={shortcutActor.id}
                pathname={pathname}
                label={shortcutActor.name}
                linkOrAction={
                  shortcutActor.team
                    ? `/manage/team/${shortcutActor.team.slug}`
                    : shortcutActor.user
                    ? `/user/${shortcutActor.user.slug}`
                    : () => setNotification({ message: 'Ressource non trouvée.' })
                }
              >
                <AvatarImage actor={shortcutActor} />
              </TabBarItem>
            ))}
          </>
        )}
      </div>
      <div className="flex flex-col pb-2">
        <TabBarItem
          pathname={pathname}
          icon={<DarkModeToggle checked={theme === 'dark'} />}
          label="Mode sombre"
          linkOrAction={toggleTheme}
        />
        <TabBarItem
          pathname={pathname}
          icon={
            <div className="flex items-center justify-center font-semibold text-xl text-2">
              {locale === 'fr-FR' ? 'FR' : 'EN'}
            </div>
          }
          label="Mode sombre"
          linkOrAction={() => setLocale(locale === 'fr-FR' ? 'en-US' : 'fr-FR')}
        />
      </div>
    </nav>
  );
}
