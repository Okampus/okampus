'use client';

import { useMe, useTenant } from '../../context/navigation';
import AvatarImage from '../atoms/Image/AvatarImage';
import { getAvatar } from '../../utils/actor-image/get-avatar';

import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus.svg';
import { IconBell, IconBrandSafari } from '@tabler/icons-react';
import Link from 'next/link';

export default function BottomBar() {
  const me = useMe();
  const { tenant } = useTenant();

  const bottomBarLinks = [
    {
      label: 'Accueil',
      href: '/',
      icon: <OkampusLogo className="h-7 w-7" />,
    },
    {
      label: tenant.adminTeam?.actor?.name,
      href: '/tenant',
      icon: (
        <AvatarImage
          size={null}
          className="rounded-full !h-7 !w-7"
          type="team"
          name={tenant.adminTeam?.actor?.name}
          src={getAvatar(tenant.adminTeam?.actor.actorImages)?.image.url}
        />
      ),
    },
    {
      label: 'Explorer',
      href: '/teams',
      icon: <IconBrandSafari className="h-7 w-7" />,
    },
    {
      label: 'Notifications',
      href: '/notifications',
      icon: <IconBell className="h-7 w-7" />,
    },
    {
      label: 'Profil',
      href: '/me',
      icon: (
        <AvatarImage
          size={null}
          className="rounded-full !h-7 !w-7"
          name={me.user.individual.actor.name}
          src={getAvatar(me.user.individual.actor.actorImages)?.image.url}
        />
      ),
    },
  ];

  return (
    <nav className="text-0 fixed z-[101] bottom-0 inset-x-0 bg-main hidden h-[var(--h-bottombar)] md-max:flex items-stretch justify-between px-6 sm:px-12 pt-1.5 border-t border-color-1">
      {bottomBarLinks.map((link) => (
        <Link
          href={link.href}
          key={link.href}
          className="my-auto flex flex-col items-center text-[0.85rem] gap-[3px] font-medium"
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
