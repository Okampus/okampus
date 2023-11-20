'use client';

import { useMe } from '../../_hooks/context/useMe';
import { useTenant } from '../../_hooks/context/useTenant';
import AvatarImage from '../atoms/Image/AvatarImage';

import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus-square.svg';
import { BellSimple, Compass } from '@phosphor-icons/react';

import clsx from 'clsx';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

type IconProps = {
  selected: boolean;
  node?: React.ReactNode;
};

type BottomBarLink = {
  href: string;
  label: string;
  regex: RegExp;
  icon: React.ReactNode;
};

function AvatarIcon({ node }: IconProps) {
  return node;
}

// function HomeIcon() {
//   return <OkampusLogo className="h-6 w-6" />;
// }

// function ExploreIcon({ selected }: IconProps) {
//   return <Compass className="h-6 w-6" weight={selected ? 'fill' : 'regular'} />;
// }

// function NotificationsIcon({ selected }: IconProps) {
//   return <BellSimple className="h-6 w-6" weight={selected ? 'fill' : 'regular'} />;
// }

export default function BottomBar() {
  const { data: me } = useMe();
  const { data: tenant } = useTenant();

  const pathname = usePathname();

  const bottomBarLinks: BottomBarLink[] = [
    {
      href: '/',
      label: 'Accueil',
      regex: /^\/$/,
      icon: <OkampusLogo className="h-6 w-6" />,
    },
    {
      label: 'École',
      href: '/tenant',
      regex: /^\/tenant/,
      icon: <AvatarImage size={26} className="rounded-full" name={tenant.actor.name} src={tenant.actor.avatar} />,
    },
    {
      href: '/teams',
      label: 'Explorer',
      regex: /^\/(team(s)|event(s))/,
      icon: <Compass className="h-6 w-6" weight="fill" />,
    },
    {
      href: '/notifications',
      label: 'Notifications',
      regex: /^\/notifications/,
      icon: <BellSimple className="h-6 w-6" weight="fill" />,
    },
    {
      href: '/me',
      label: 'Profil',
      regex: /^\/me/,
      icon: <AvatarImage size={26} className="rounded-full" name={me.actor.name} src={me.actor.avatar} />,
    },
  ];

  return (
    <nav className="fixed z-20 bottom-0 inset-x-0 bg-main hidden h-[var(--h-bottombar)] md-max:flex items-end justify-between px-6 py-1.5">
      {bottomBarLinks.map(({ href, icon, label, regex }) => {
        const selected = regex.test(pathname);

        return (
          <Link
            href={href}
            key={href}
            className={clsx(
              'flex flex-col gap-0.5 items-center font-medium tracking-wide text-xs',
              selected ? 'text-0' : 'text-1 opacity-50',
            )}
          >
            {icon}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
