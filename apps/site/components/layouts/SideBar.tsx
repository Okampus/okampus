'use client';

import TabBar from './TabBar/TabBar';
import AvatarImage from '../atoms/Image/AvatarImage';
import Backdrop from '../atoms/Layout/Backdrop';
import Popover from '../atoms/Popup/Popover/Popover';
import PopoverContent from '../atoms/Popup/Popover/PopoverContent';
import PopoverTrigger from '../atoms/Popup/Popover/PopoverTrigger';
import MenuList from '../molecules/Button/MenuList';
import DarkModeToggle from '../molecules/Input/DarkModeToggle';

import { isSidebarOpenAtom } from '../../context/global';
import { useMe } from '../../context/navigation';
import { useTheme } from '../../hooks/context/useTheme';
import { useCurrentBreakpoint } from '../../hooks/useCurrentBreakpoint';
import { getAvatar } from '../../utils/actor-image/get-avatar';

import { ME_ROUTE } from '@okampus/shared/consts';
import { logoutMutation } from '@okampus/shared/graphql';

import { IconSettings, IconLogout } from '@tabler/icons-react';
import { useMutation } from '@apollo/client';

import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// const transition = { ease: 'easeInOut', duration: 0.3 };

export type SideBarProps = { children: React.ReactNode };
export default function SideBar({ children }: SideBarProps) {
  const [isSidebarOpen, setIsSideBarOpen] = useAtom(isSidebarOpenAtom);

  const me = useMe();
  const avatar = getAvatar(me?.user.individual?.actor?.actorImages);
  const name = me?.user.individual?.actor?.name;

  const [theme, setTheme] = useTheme();

  const router = useRouter();
  const [logout] = useMutation(logoutMutation, { onCompleted: () => router.push('/signin') });

  const currentWindowSize = useCurrentBreakpoint();
  const isMobile = currentWindowSize === 'mobile';

  useEffect(() => {
    if (isMobile) isSidebarOpen && setIsSideBarOpen(false);
    else !isSidebarOpen && setIsSideBarOpen(true);
  }, [isMobile, setIsSideBarOpen]);

  const sidebarClass = clsx(
    'h-full shrink-0 bg-[var(--bg-navbar)] overflow-x-hidden',
    isMobile ? 'absolute top-0 left-0' : 'relative'
  );

  // const width = children ? 'var(--w-sidepanel)' : 'var(--w-tabbar)';
  // const initial = { x: -width, width: 0 };
  // const animate = { x: 0, width };

  const sections = [
    {
      actions: [
        { label: 'Gérer mon profil', iconOrSwitch: <IconSettings />, linkOrActionOrMenu: ME_ROUTE },
        {
          label: 'Mode sombre',
          iconOrSwitch: <DarkModeToggle checked={theme === 'dark'} />,
          linkOrActionOrMenu: setTheme,
        },
        { label: 'Se déconnecter', iconOrSwitch: <IconLogout />, linkOrActionOrMenu: logout },
      ],
    },
  ];

  const inner = (
    <nav className={clsx('h-full flex bg-1', isMobile && 'mr-4')}>
      <TabBar />
      {children && (
        <div className="h-full w-[var(--w-sidebar)] flex flex-col justify-between">
          <div>{children}</div>
          <Popover forcePlacement={true} placement="bottom" placementOffset={10} placementCrossOffset={10}>
            <PopoverTrigger>
              <div className="flex gap-2 items-center px-4 py-3 border-color-2 border-t">
                <AvatarImage size={16} src={avatar?.image?.url} name={name} type="user" />
                <div className="flex flex-col items-start pb-1">
                  <div className="text-1 font-semibold">{name}</div>
                  <div className="text-2 text-xs font-medium px-0.5">{me?.user.individual?.actor?.email}</div>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent popoverClassName="!p-0">
              <MenuList
                sections={sections}
                header={
                  <div className="flex gap-2 items-center px-2 py-4 bg-0">
                    <AvatarImage size={16} src={avatar?.image?.url} name={name} type="user" />
                    <div className="flex flex-col items-start">
                      <div className="text-1 font-semibold">{name}</div>
                      <div className="text-2 text-xs font-medium">{me?.user.individual?.actor?.email}</div>
                    </div>
                  </div>
                }
                // footer={
                //   <div className="text-0 mt-2 bg-0">
                //     <div className="text-xs py-3 text-center">RGPD • Conditions d&apos;utilisation</div>
                //   </div>
                // }
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </nav>
  );

  const slidingSidebar = (
    <aside
      // initial={initial} animate={animate} exit={initial} transition={transition}
      className={sidebarClass}
      onClick={(e) => e.stopPropagation()}
    >
      {inner}
    </aside>
  );

  const sidebar = isMobile ? (
    <Backdrop onClick={() => setIsSideBarOpen(false)}>{slidingSidebar}</Backdrop>
  ) : (
    slidingSidebar
  );

  // return <AnimatePresence>{isSidebarOpen && sidebar}</AnimatePresence>;
  return isSidebarOpen && sidebar;
}
