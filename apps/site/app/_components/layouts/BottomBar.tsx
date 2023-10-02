'use client';

import { useMe, useTenant } from '../../_context/navigation';
import AvatarImage from '../atoms/Image/AvatarImage';

import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus.svg';
import { IconBell, IconBellFilled, IconCircleArrowUpRight, IconCircleArrowUpRightFilled } from '@tabler/icons-react';
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
  icon: (props: IconProps) => React.ReactNode;
  node?: React.ReactNode;
};

function AvatarIcon({ node }: IconProps) {
  return node;
}

function HomeIcon() {
  return <OkampusLogo className="h-7 w-7" />;
}

function ExploreIcon({ selected }: IconProps) {
  return selected ? (
    <IconCircleArrowUpRightFilled className="h-7 w-7" />
  ) : (
    <IconCircleArrowUpRight className="h-7 w-7" />
  );
}

function NotificationsIcon({ selected }: IconProps) {
  return selected ? <IconBellFilled className="h-7 w-7" /> : <IconBell className="h-7 w-7" />;
}
export default function BottomBar() {
  const me = useMe();
  const { tenant } = useTenant();

  const pathname = usePathname();

  const bottomBarLinks: BottomBarLink[] = [
    {
      href: '/',
      label: 'Accueil',
      regex: /^\/$/,
      icon: HomeIcon,
    },
    {
      label: tenant.actor.name,
      href: '/tenant',
      regex: /^\/tenant/,
      icon: AvatarIcon,
      node: (
        <AvatarImage
          size={22}
          className="rounded-full m-px"
          type="team"
          name={tenant.actor.name}
          src={tenant.actor.avatar}
        />
      ),
    },
    {
      href: '/teams',
      label: 'Explorer',
      regex: /^\/(team(s)|event(s))/,
      icon: ExploreIcon,
    },
    {
      href: '/notifications',
      label: 'Notifications',
      regex: /^\/notifications/,
      icon: NotificationsIcon,
    },
    {
      href: '/me',
      label: 'Profil',
      regex: /^\/me/,
      icon: AvatarIcon,
      node: <AvatarImage size={22} className="rounded-full m-px" name={me.actor.name} src={me.actor.avatar} />,
    },
  ];

  return (
    <nav className="fixed z-[101] bottom-0 inset-x-0 bg-main hidden h-[var(--h-bottombar)] md-max:flex items-stretch justify-between px-6 sm:px-12 pt-1.5 border-t border-color-1">
      {bottomBarLinks.map(({ href, icon, label, node, regex }) => {
        const selected = regex.test(pathname);

        return (
          <Link
            href={href}
            key={href}
            className={clsx(
              'my-auto flex flex-col items-center text-[0.85rem] gap-[3px] font-medium',
              selected ? 'text-0' : 'text-1 opacity-75',
            )}
          >
            {icon({ selected, node })}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
