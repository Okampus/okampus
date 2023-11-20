import TabBarItem from './TabBarItem';
import TabBarTeamMember from './TabBarTeamMember';
import TabBarBottom from './TabBarBottom';

import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus.svg';
import { ReactComponent as OkampusSquareLogo } from '@okampus/assets/svg/brands/okampus-square.svg';
import { Compass, Calendar, House, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';

import clsx from 'clsx';
import Link from 'next/link';

export type TabBarProps = { smallMode?: boolean };
export default function TabBar({ smallMode }: TabBarProps) {
  const home = {
    base: <House weight="duotone" className="w-7 h-7 ml-0.5" />,
    selected: <House weight="fill" className="w-7 h-7 ml-0.5" />,
  };
  const search = {
    base: <MagnifyingGlass weight="duotone" className="w-7 h-7 ml-0.5" />,
    selected: <MagnifyingGlass weight="fill" className="w-7 h-7 ml-0.5" />,
  };
  const calendar = {
    base: <Calendar weight="duotone" className="w-7 h-7 ml-0.5" />,
    selected: <Calendar weight="fill" className="w-7 h-7 ml-0.5" />,
  };
  const explore = {
    base: <Compass weight="duotone" className="w-7 h-7 ml-0.5" />,
    selected: <Compass weight="fill" className="w-7 h-7 ml-0.5" />,
  };

  const defaultLinks = [
    { icons: home, regex: '/', label: 'Accueil', action: '/' },
    { icons: search, regex: '/search', label: 'Rechercher', action: '/search' },
    { icons: explore, regex: '(?:/team|/teams)', label: 'Associations', action: '/teams' },
    { icons: calendar, regex: '(?:/calendar|/event)', label: 'Événements', action: '/calendar' },
  ];

  return (
    <nav
      className={clsx(
        'h-full shrink-0 flex flex-col justify-between py-6 w-[var(--w-tabbar)] border-r border-[var(--border-1)]',
        smallMode ? '[&_.sidebar-label]:hidden' : 'md:w-[var(--w-sidebar)]',
      )}
    >
      <div>
        <div className="mb-6">
          <Link href="/">
            <OkampusSquareLogo className={clsx('text-0 h-10 px-4', !smallMode && 'md:hidden')} />
            <OkampusLogo className={clsx('text-0 h-10 px-[1.15rem]', smallMode ? 'hidden' : 'md-max:hidden')} />
          </Link>
        </div>
        <div className="flex flex-col scrollbar-on-hover gap-2">
          {defaultLinks.map((props) => (
            <TabBarItem key={props.regex} {...props} />
          ))}
          <TabBarTeamMember />
        </div>
      </div>
      <TabBarBottom />
    </nav>
  );
}
