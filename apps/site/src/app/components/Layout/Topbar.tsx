import { ReactComponent as ChevronLeftIcon } from '@okampus/assets/svg/icons/outlined/back.svg';
import { ReactComponent as ChevronRightIcon } from '@okampus/assets/svg/icons/outlined/next.svg';
import { ReactComponent as LogoutIcon } from '@okampus/assets/svg/icons/logout.svg';

import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import { logoutMutation } from '@okampus/shared/graphql';
import { ActionButton, Avatar, Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';
import { NavigationContext, useMe } from '@okampus/ui/hooks';
import { ActionList } from '@okampus/ui/molecules';
import { getAvatar } from '@okampus/ui/utils';

import { useApolloClient, useMutation } from '@apollo/client';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

// TODO: make avatar active when popper is open
// TODO: improve popover

type TopbarProps = {
  opacity: number;
  color: string;
};

export function Topbar({ opacity, color = 'black' }: TopbarProps) {
  const navigate = useNavigate();
  const client = useApolloClient();

  const { me } = useMe();
  const { history, setTenant } = useContext(NavigationContext);

  const [logout] = useMutation(logoutMutation, {
    onCompleted: () => {
      setTenant(null);
      client.clearStore();
      navigate('/welcome', { replace: true });
    },
  });

  const avatar = getAvatar(me?.actor?.actorImages);
  const buttonClass = 'h-10 w-10 py-2 rounded-[50%] bg-main';

  const last = history[history.length - 1];
  const isFirst = window.history.state?.idx === 0;
  const isLast =
    window.history.state?.idx === last?.idx || !history.some((route) => route.idx === window.history.state?.idx);

  const actions = [
    {
      label: 'Se déconnecter',
      icon: <LogoutIcon className="h-6" />,
      linkOrAction: logout,
    },
  ];

  return (
    <header className="fixed top-0 w-content bg-transparent h-[var(--topbar-height)] px-[var(--padding-view)] z-[51] flex items-center justify-between">
      <div className="absolute inset-0" style={{ opacity, backgroundColor: color }} />
      <div className="flex gap-6 items-center">
        {/* History navigation */}
        <div className="flex gap-4 opacity-80">
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
        </div>

        {/* Current location */}
        {/* <div className="text-0 text-[1.75rem] tracking-tighter font-semibold font-title">
        </div> */}
      </div>

      {/* User settings */}
      <div className="z-20">
        <Popover forcePlacement={true} placement="bottom-end" placementOffset={20}>
          <PopoverTrigger>
            <Avatar name={me?.actor?.name} src={avatar} size={18} rounded={AVATAR_USER_ROUNDED} />
          </PopoverTrigger>
          <PopoverContent popoverClassName="!p-0">
            <div className="flex flex-col w-popover-card">
              {/* TODO: add as component */}
              <div className="card-sm bg-4 m-2 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <Avatar src={avatar} name={me?.actor?.name} size={26} rounded={AVATAR_USER_ROUNDED} />
                  <div className="flex flex-col">
                    <div className="text-0 text-lg font-heading leading-tight font-medium">{me?.actor?.name}</div>
                    <div className="text-3 text-sm font-heading">{me?.actor?.primaryEmail}</div>
                  </div>
                </div>
                <ActionButton onClick={() => navigate('/me')}>Gérer mon profil</ActionButton>
              </div>
              <ActionList actions={actions} />
              <hr className="border-color-2 w-full" />
              <div className="text-xs py-3 text-center">RGPD • Conditions d'utilisation</div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
