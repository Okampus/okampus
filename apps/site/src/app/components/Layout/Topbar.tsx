import { ReactComponent as SearchIcon } from '@okampus/assets/svg/icons/search.svg';
import { ReactComponent as LogoutIcon } from '@okampus/assets/svg/icons/logout.svg';

import { ReactComponent as ChevronLeftIcon } from '@okampus/assets/svg/icons/outlined/back.svg';
import { ReactComponent as ChevronRightIcon } from '@okampus/assets/svg/icons/outlined/next.svg';

import { Avatar, Bubble, Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';
import { NavigationContext, useMe } from '@okampus/ui/hooks';
import { getAvatar } from '@okampus/ui/utils';
import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import { logoutMutation } from '@okampus/shared/graphql';

import { useApolloClient, useMutation } from '@apollo/client';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

// TODO: make avatar active when popper is open
// TODO: improve popover

export function Topbar() {
  const navigate = useNavigate();
  const client = useApolloClient();
  const { me } = useMe();

  const { isSearching, setIsSearching, history, setTenant } = useContext(NavigationContext);

  const [logout] = useMutation(logoutMutation, {
    onCompleted: () => {
      setTenant(null);
      client.clearStore();
      navigate('/welcome', { replace: true });
    },
  });

  const avatar = getAvatar(me?.actor?.actorImages);
  const buttonClass = 'h-10 w-10 py-2 rounded-[50%] bg-0';

  const last = history[history.length - 1];
  const isFirst = window.history.state?.idx === 0;
  const isLast =
    window.history.state?.idx === last?.idx || !history.some((route) => route.idx === window.history.state?.idx);

  return (
    <header className="sticky top-0 w-full h-[var(--topbar-height)] bg-topbar pl-[var(--padding-view)] pr-[calc(var(--padding-inner)*4)] z-[51] flex items-center justify-between">
      <div className="flex gap-6 items-center">
        {/* History navigation */}
        <div className="flex gap-4">
          <div
            className={clsx(buttonClass, 'pl-1.5', isFirst ? 'text-3 cursor-not-allowed' : 'text-0 cursor-pointer')}
            onClick={() => !isFirst && navigate(-1)}
          >
            <ChevronLeftIcon className="h-6" />
          </div>
          <div
            className={clsx(buttonClass, 'pl-2.5', isLast ? 'text-3 cursor-not-allowed' : 'text-0 cursor-pointer')}
            onClick={() => !isLast && navigate(1)}
          >
            <ChevronRightIcon className="h-6" />
          </div>
        </div>

        {/* Search */}
        <Bubble onClick={() => setIsSearching(true)} selected={isSearching} showBg={true}>
          <SearchIcon className="p-1" />
        </Bubble>
        {/* Current location */}
        {/* <div className="text-0 text-[1.75rem] tracking-tighter font-semibold font-title">
        </div> */}
      </div>

      {/* User settings */}
      <Popover forcePlacement={true} placement="bottom-end" placementOffset={10}>
        <PopoverTrigger>
          <Avatar name={me?.actor?.name} src={avatar} size={18} rounded={AVATAR_USER_ROUNDED} />
        </PopoverTrigger>
        <PopoverContent popoverClassName="!p-0 bg-1 ">
          <div className="flex flex-col items-center">
            {/* TODO: add as component */}
            <div className="card-sm bg-4 m-2 flex flex-col gap-2">
              <div className="pr-24 flex items-center gap-4">
                <Avatar src={avatar} name={me?.actor?.name} size={24} rounded={AVATAR_USER_ROUNDED} />
                <div className="flex flex-col">
                  <div className="text-0 text-lg font-heading leading-tight">{me?.actor?.name}</div>
                  <div className="text-3 text-sm font-heading">{me?.actor?.primaryEmail}</div>
                </div>
              </div>
              <button onClick={() => navigate('/me')} className="button bg-opposite text-opposite w-full">
                Gérer mon profil
              </button>
            </div>

            <button
              className="w-full text-0 text-lg font-semibold font-title flex gap-4 items-center px-4 py-3 bg-hover-1"
              onClick={() => logout()}
            >
              <LogoutIcon height={20} />
              Se déconnecter
            </button>
            <hr className="border-color-2 w-full" />
            <div className="text-xs py-3">RGPD • Conditions d'utilisation</div>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
}
