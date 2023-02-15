import { HOME, ADMIN, MANAGE } from './Sidebar/Sidebar.types';

import { ReactComponent as SearchIcon } from '@okampus/assets/svg/icons/search.svg';
import { ReactComponent as LogoutIcon } from '@okampus/assets/svg/icons/logout.svg';

import { Avatar, Bubble, Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';
import { CurrentContext, NavigationContext, useCurrentContext } from '@okampus/ui/hooks';
import { logoutMutation } from '@okampus/shared/graphql';

import { getAvatar } from '#site/app/utils/get-avatar';

import { useApolloClient, useMutation } from '@apollo/client';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// TODO: make avatar active when popper is open

export function Topbar() {
  const navigate = useNavigate();
  const client = useApolloClient();

  const { isSearching, setIsSearching, selected } = useContext(NavigationContext);
  const [{ org, tenant, user }, updateCache] = useCurrentContext();
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

  const getSubspaceName = () => {
    if (selected.subSpace === HOME) return tenant?.actor?.name;
    if (selected.subSpace === ADMIN) return `${tenant?.actor?.name}`;
    if (selected.subSpace === MANAGE) return `${org?.actor?.name}`;
    return;
  };

  const getSubspaceAvatar = () => {
    if (selected.subSpace === HOME) return getAvatar(tenant?.actor?.actorImages);
    if (selected.subSpace === ADMIN) return getAvatar(tenant?.actor?.actorImages);
    if (selected.subSpace === MANAGE) return getAvatar(org?.actor?.actorImages);
    return;
  };

  const avatar = getAvatar(user?.actor?.actorImages);

  return (
    <div className="w-full h-[3.75rem] bg-topbar pl-2 pr-6">
      <div className="w-full h-full flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Bubble onClick={() => setIsSearching(true)} selected={isSearching} showBg={true}>
            <SearchIcon height="26" />
          </Bubble>
          <div className="flex gap-3 px-2 items-center lg:w-56">
            <Avatar name={getSubspaceName()} src={getSubspaceAvatar()} size={14} rounded={20} />
            <h2 className="text-0 text-2xl tracking-tight font-semibold font-title lg-max:hidden">
              {getSubspaceName()}
            </h2>
          </div>
          <div className="pl-12">{}</div>
        </div>
        <Popover useArrow={false} forcePlacement={true} placementOffset={6}>
          <PopoverTrigger>
            <Avatar name={user?.actor?.name} src={avatar} size={16} />
          </PopoverTrigger>
          <PopoverContent popoverClassName="!p-0">
            <div className="flex flex-col gap-2">
              {/* TODO: add as component */}
              <div className="p-2 flex gap-4">
                <Avatar src={avatar} name={user?.actor?.name} size={24} />
                <div className="flex flex-col">
                  <div className="text-0 text-lg font-heading leading-tight">{user?.actor?.name}</div>
                  <div className="text-3 text-base font-heading">{user?.actor?.primaryEmail}</div>
                  <div className="text-blue-400 hover:underline hover:cursor-pointer">Gérer votre profil</div>
                </div>
              </div>

              <button
                className="text-0 text-1xl font-semibold font-title flex gap-2 items-center px-3 py-2 rounded-xl hover:bg-gray-500"
                onClick={() => logout()}
              >
                <LogoutIcon height={20} />
                Se déconnecter
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
