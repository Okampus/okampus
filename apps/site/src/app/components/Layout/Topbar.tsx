import { ReactComponent as SearchIcon } from '@okampus/assets/svg/icons/search.svg';
import { ReactComponent as LogoutIcon } from '@okampus/assets/svg/icons/logout.svg';

import { Avatar, Bubble, Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';
import { CurrentContext, NavigationContext, useCurrentContext } from '@okampus/ui/hooks';
import { logoutMutation } from '@okampus/shared/graphql';

import { getAvatar } from '@okampus/ui/utils';
import { useApolloClient, useMutation } from '@apollo/client';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// TODO: make avatar active when popper is open
// TODO: improve popover

export function Topbar() {
  const navigate = useNavigate();
  const client = useApolloClient();

  const { isSearching, setIsSearching } = useContext(NavigationContext);
  const [{ user }, updateCache] = useCurrentContext();
  const { setCurrentOrgId, setCurrentUserId, setCurrentTenantId } = useContext(CurrentContext);

  const [logout] = useMutation(logoutMutation, {
    onCompleted: () => {
      setCurrentOrgId(null);
      setCurrentUserId(null);
      setCurrentTenantId(null);

      updateCache();
      client.clearStore();

      navigate('/welcome');
    },
  });

  const avatar = getAvatar(user?.actor?.actorImages);

  return (
    <nav className="sticky top-0 w-full h-topbar bg-topbar p-inner z-[51] flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Bubble onClick={() => setIsSearching(true)} selected={isSearching} showBg={true}>
          <SearchIcon height="26" />
        </Bubble>
        <div className="pl-12">{}</div>
      </div>
      <Popover useArrow={false} forcePlacement={true} placementOffset={6}>
        <PopoverTrigger>
          <Avatar name={user?.actor?.name} src={avatar} size={18} />
        </PopoverTrigger>
        <PopoverContent popoverClassName="!px-0 bg-1 ">
          <div className="flex flex-col gap-2">
            {/* TODO: add as component */}
            <div className="px-4 pr-6 flex gap-4">
              <Avatar src={avatar} name={user?.actor?.name} size={18} />
              <div className="flex flex-col">
                <div className="text-0 text-lg font-heading leading-tight">{user?.actor?.name}</div>
                <div className="text-3 text-base font-heading">{user?.actor?.primaryEmail}</div>
              </div>
            </div>

            <button
              className="text-0 text-1xl font-semibold font-title flex gap-2 items-center px-3 py-2 rounded-xl bg-hover-2"
              onClick={() => logout()}
            >
              <LogoutIcon height={20} />
              Se déconnecter
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </nav>
  );
}
