// import { AvatarImage, Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';
import { TopbarUser } from './TopbarUser';
import { ReactComponent as RightPanelOpen } from '@okampus/assets/svg/icons/material/outlined/right-panel-open.svg';

import { NavigationContext, useCurrentUser, useTheme } from '@okampus/ui/hooks';
// import { MenuList } from '@okampus/ui/molecules';
import { NovuProvider, PopoverNotificationCenter, NotificationBell } from '@novu/notification-center';
import { useContext } from 'react';

// TODO: make avatar active when popper is open
// TODO: improve popover

export type TopbarProps = { color?: string; isSmall: boolean; opacity: number };
export function Topbar({ color = 'var(--bg-main)', isSmall, opacity }: TopbarProps) {
  const { currentUser } = useCurrentUser();
  const { sidePanel, setIsSidePanelUncollapsed, topbar, isTopbarAlwaysShown } = useContext(NavigationContext);

  const [theme, setTheme] = useTheme();

  // const buttonClass = 'h-10 w-10 py-2 rounded-[50%] bg-main';

  // const last = history[history.length - 1];
  // const isFirst = window.history.state?.idx === 0;
  // const isLast =
  //   window.history.state?.idx === last?.idx || !history.some((route) => route.idx === window.history.state?.idx);

  const currentIndividualId = currentUser?.individualById?.id as string | undefined;
  const novuAppId = import.meta.env.VITE_NOVU_APP_ID;
  return (
    <header className="shrink-0 relative bg-transparent h-[var(--topbar-height)] z-[51] flex items-center justify-between border-b border-color-2">
      <div className="absolute inset-0" style={{ opacity, backgroundColor: color }} />
      <div className="w-full flex items-center z-20 overflow-x-scroll scrollbar">
        <div className="w-full px-content" style={{ opacity: isTopbarAlwaysShown ? 1 : opacity }}>
          {topbar}
        </div>
      </div>

      <div className="px-content flex items-center gap-5 text-3 justify-end z-20 shrink-0">
        {isSmall && sidePanel && (
          <RightPanelOpen className="h-8 w-8 cursor-pointer" onClick={() => setIsSidePanelUncollapsed(true)} />
        )}
        {currentIndividualId && (
          <NovuProvider subscriberId={currentIndividualId} applicationIdentifier={novuAppId} i18n="fr">
            <PopoverNotificationCenter colorScheme={theme || 'light'}>
              {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
            </PopoverNotificationCenter>
          </NovuProvider>
        )}
        <TopbarUser theme={theme} setTheme={setTheme} />
      </div>
      {/* <div className="flex gap-6 items-center"> */}
      {/* History navigation */}
      {/* <div className="flex gap-4 opacity-80">
          <div
            className={clsx(
              buttonClass,
              'pl-1.5',
              isFirst ? 'text-3 cursor-not-allowed opacity-70' : 'text-0 cursor-pointer'
            )}
            onClick={() => !isFirst && navigate(-1)}
          >
            <ChevronLeftIcon className="h-6" />
          </div>
          <div
            className={clsx(
              buttonClass,
              'pl-2.5',
              isLast ? 'text-3 cursor-not-allowed opacity-70' : 'text-0 cursor-pointer'
            )}
            onClick={() => !isLast && navigate(1)}
          >
            <ChevronRightIcon className="h-6" />
          </div>
        </div> */}

      {/* Current location */}
      {/* <div className="text-0 text-[1.75rem] tracking-tighter font-semibold font-title">
        </div> */}
      {/* </div> */}

      {/* User settings */}
      {/* <div className="z-20">
        <Popover forcePlacement={true} placement="bottom-end" placementOffset={20}>
          <PopoverTrigger>
            <AvatarImage
              name={currentUser?.individualById?.actor?.name}
              src={avatar}
              size={18}
              rounded={AVATAR_USER_ROUNDED}
            />
          </PopoverTrigger>
          <PopoverContent popoverClassName="!p-0">
            <MenuList
              header={
                <div className="mb-2 pb-2 border-b border-color-2">
                  <div className="flex items-center gap-4 px-8 py-5 bg-0 -m-2">
                    <AvatarImage
                      src={avatar}
                      name={currentUser?.individualById?.actor?.name}
                      size={22}
                      rounded={AVATAR_USER_ROUNDED}
                    />
                    <div>
                      <div className="text-1 text-xl font-semibold">{currentUser?.individualById?.actor?.name}</div>
                      <div className="text-2">{currentUser?.individualById?.actor?.email}</div>
                    </div>
                  </div>
                </div>
              }
              sections={sections}
              footer={
                <div className="text-0 mt-2 border-t border-color-2">
                  <div className="text-xs py-3 text-center">RGPD • Conditions d'utilisation</div>
                </div>
              }
            />
          </PopoverContent>
        </Popover>
      </div> */}
    </header>
  );
}
