import { ReactComponent as SearchIcon } from '@okampus/assets/svg/icons/search.svg';
import { ReactComponent as LogoutIcon } from '@okampus/assets/svg/icons/logout.svg';

import { ReactComponent as ChevronLeftIcon } from '@okampus/assets/svg/icons/outlined/back.svg';
import { ReactComponent as ChevronRightIcon } from '@okampus/assets/svg/icons/outlined/next.svg';

import { Avatar, Bubble, Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';
import { CurrentContext, NavigationContext, useCurrentContext } from '@okampus/ui/hooks';
import { logoutMutation } from '@okampus/shared/graphql';

import { getAvatar } from '@okampus/ui/utils';
import { useApolloClient, useMutation } from '@apollo/client';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

// TODO: make avatar active when popper is open
// TODO: improve popover

export function Topbar() {
  const navigate = useNavigate();
  const client = useApolloClient();

  const { isSearching, setIsSearching, history } = useContext(NavigationContext);
  const [{ user }, updateCache] = useCurrentContext();
  const { setCurrentOrgId, setCurrentUserId, setCurrentTenantId } = useContext(CurrentContext);

  const [logout] = useMutation(logoutMutation, {
    onCompleted: () => {
      setCurrentOrgId(null);
      setCurrentUserId(null);
      setCurrentTenantId(null);

      updateCache();
      client.clearStore();

      navigate('/welcome', { replace: true });
    },
  });

  const avatar = getAvatar(user?.actor?.actorImages);
  const buttonClass = 'p-1.5 rounded-[50%] bg-0';

  const last = history[history.length - 1];
  const isFirst = window.history.state?.idx === 0;
  const isLast =
    window.history.state?.idx === last?.idx || !history.some((route) => route.idx === window.history.state?.idx);

  return (
    <nav className="sticky top-0 w-full h-topbar bg-topbar p-inner z-[51] flex items-center justify-between">
      <div className="flex gap-2 items-center">
        {/* Search */}
        <Bubble onClick={() => setIsSearching(true)} selected={isSearching} showBg={true}>
          <SearchIcon height="26" />
        </Bubble>

        {/* History navigation */}
        <div className="flex gap-4 px-4">
          <div
            className={clsx(buttonClass, isFirst ? 'text-3 cursor-not-allowed' : 'text-0 cursor-pointer')}
            onClick={() => !isFirst && navigate(-1)}
          >
            <ChevronLeftIcon height="20" />
          </div>
          <div
            className={clsx(buttonClass, isLast ? 'text-3 cursor-not-allowed' : 'text-0 cursor-pointer')}
            onClick={() => !isLast && navigate(1)}
          >
            <ChevronRightIcon height="20" />
          </div>
        </div>

        {/* Current location */}
        {/* <div className="text-0 text-[1.75rem] tracking-tighter font-semibold font-title">
        </div> */}
      </div>

      {/* User settings */}
      <Popover useArrow={false} forcePlacement={true} placementOffset={6}>
        <PopoverTrigger>
          <Avatar name={user?.actor?.name} src={avatar} size={18} />
        </PopoverTrigger>
        <PopoverContent popoverClassName="!p-0 bg-1 ">
          <div className="flex flex-col">
            {/* TODO: add as component */}
            <div className="card-sm bg-4 m-2 flex flex-col gap-2">
              <div className="pr-24 flex items-center gap-4">
                <Avatar src={avatar} name={user?.actor?.name} size={24} />
                <div className="flex flex-col">
                  <div className="text-0 text-xl font-heading leading-tight">{user?.actor?.name}</div>
                  <div className="text-3 text-base font-heading">{user?.actor?.primaryEmail}</div>
                </div>
              </div>
              <button className="button bg-opposite text-opposite w-full">Gérer mon profil</button>
            </div>

            <div className="pb-2">
              <button
                className="w-full text-0 text-xl font-semibold font-title flex gap-4 items-center px-4 py-3 bg-hover-1"
                onClick={() => logout()}
              >
                <LogoutIcon height={20} />
                Se déconnecter
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </nav>
  );
}
