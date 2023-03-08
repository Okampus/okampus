import { SidebarMenu } from './SidebarMenu';

import { menus, ResourceRouteType, shortcutMenus } from '../../../menus';

import { getLink } from '#site/app/utils/get-link';

import { ReactComponent as AdminIcon } from '@okampus/assets/svg/icons/filled/admin-settings.svg';
import { ReactComponent as HomeIcon } from '@okampus/assets/svg/icons/filled/home.svg';

import {
  AVATAR_SHORTCUT_ROUNDED,
  AVATAR_TEAM_ROUNDED,
  AVATAR_TENANT_ROUNDED,
  AVATAR_USER_ROUNDED,
} from '@okampus/shared/consts';

import { Avatar, Bubble, Skeleton } from '@okampus/ui/atoms';
import { NavigationContext, useManageOrg, useMe, useOrg, useUser } from '@okampus/ui/hooks';
import { getAvatar } from '@okampus/ui/utils';

import { ScopeRole } from '@okampus/shared/enums';
import { defaultSelectedMenu, tenantSubspaces } from '@okampus/shared/types';
import { SubspaceType } from '@okampus/shared/types';

import { enumChecker, isNotNull } from '@okampus/shared/utils';
import { getFragmentData, teamFragment } from '@okampus/shared/graphql';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import type { Menu } from '../../../menus';
import type { LinkContext } from '#site/app/utils/get-link';
import type { ShortcutType } from '@okampus/shared/enums';
import type { SelectedMenu, SideBubble } from '@okampus/shared/types';

const isSubSpace = enumChecker(SubspaceType);

const subSpaceMenu = (subSpace: SubspaceType): SelectedMenu => ({
  menu: defaultSelectedMenu.menu,
  subMenu: defaultSelectedMenu.subMenu,
  subSpace,
});

const getMenuLink = (selected: SelectedMenu): string => {
  const menu = menus[selected.subSpace].menus[selected.menu];
  if (!menu.sub) return menu.link;
  return menu.sub[selected.subMenu].link;
};

const baseBubble: SideBubble = { subSpace: SubspaceType.Home, icon: HomeIcon };
const adminBubbles: SideBubble[] = [{ subSpace: SubspaceType.Admin, icon: AdminIcon }];

export function Sidebar() {
  const navigate = useNavigate();
  const { isSearching, setIsSearching, selected, tenant } = useContext(NavigationContext);

  const { me } = useMe();
  const { user } = useUser();
  const { org } = useOrg();
  const { manageOrg } = useManageOrg();

  const switchSubspace = (shortcutType: SubspaceType | ShortcutType, context?: LinkContext) => {
    if (isSearching) setIsSearching(false);
    const link = getMenuLink(isSubSpace(shortcutType) ? subSpaceMenu(shortcutType) : shortcutMenus[shortcutType]);
    navigate(getLink(link, context));
  };

  const showBubbles = me?.scopeRole === ScopeRole.Admin ? adminBubbles : [];
  const shortcuts = me?.shortcuts || [];

  const getSubspaceInfo = () => {
    if (tenantSubspaces.has(selected.subSpace) && tenant?.actor)
      return {
        name: tenant.actor.name,
        avatar: getAvatar(tenant.actor.actorImages),
        rounded: AVATAR_TENANT_ROUNDED,
      };
    if (selected.subSpace === SubspaceType.Org && org?.actor)
      return { name: org.actor.name, avatar: getAvatar(org.actor.actorImages), rounded: AVATAR_TEAM_ROUNDED };
    if (selected.subSpace === SubspaceType.Manage && manageOrg?.actor)
      return {
        name: manageOrg.actor.name,
        avatar: getAvatar(manageOrg.actor.actorImages),
        rounded: AVATAR_TEAM_ROUNDED,
      };
    if (selected.subSpace === SubspaceType.User && user?.actor)
      return { name: user.actor.name, avatar: getAvatar(user.actor.actorImages), rounded: AVATAR_USER_ROUNDED };
    if (selected.subSpace === SubspaceType.Me && me?.actor)
      return { name: me.actor.name, avatar: getAvatar(me.actor.actorImages), rounded: AVATAR_USER_ROUNDED };
    return null;
  };

  const info = getSubspaceInfo();

  return (
    <nav className="h-full flex flex-col w-sidebar bg-0">
      {/* Header */}
      <div className="flex h-[calc(var(--topbar-height)-var(--padding-inner))]">
        {/* Home shortcut */}
        <div className="bg-1 px-[var(--padding-inner)] pt-[var(--padding-inner)]">
          <Bubble
            onClick={() => switchSubspace(baseBubble.subSpace)}
            selected={selected.subSpace === baseBubble.subSpace && !isSearching}
            showBg={true}
          >
            <baseBubble.icon className="p-1" />
          </Bubble>
        </div>

        {/* Subspace name */}
        <div className="flex gap-item items-center px-[calc(var(--padding-inner)*2)] lg:px-[calc(var(--padding-inner)*3)]">
          {info ? (
            <>
              <Avatar name={info.name} src={info.avatar} size={18} rounded={info.rounded} />
              <h2 className="text-0 text-xl tracking-tighter font-semibold font-title lg-max:hidden line-clamp-1">
                {info.name}
              </h2>
            </>
          ) : (
            <>
              <Skeleton rounded="16%" height={16} width={16} />
              <Skeleton className="lg-max:hidden" width={48} />
            </>
          )}
        </div>
      </div>
      <div className="h-full flex overflow-hidden">
        {/* Shortcuts */}
        <div className="h-full flex flex-col bg-1 w-[var(--topbar-height)] px-[var(--padding-inner)] pb-[var(--padding-inner)] shrink-0">
          {showBubbles.map((bubble, idx) => (
            <Bubble
              key={idx}
              onClick={() => switchSubspace(bubble.subSpace)}
              selected={selected.subSpace === bubble.subSpace && !isSearching}
              showBg={true}
            >
              <bubble.icon className="p-1" />
            </Bubble>
          ))}
          <hr className="m-[var(--padding-inner)] border-color-3" />
          <div className="scrollbar flex flex-col rounded-t-2xl">
            {shortcuts
              .filter(isNotNull)
              .map((shortcut) => {
                const actor = shortcut.targetActor;
                // TODO: Add support for other shortcut types
                if (actor?.org && actor.org.__typename === 'TeamModel') {
                  const targetOrg = getFragmentData(teamFragment, actor.org);
                  return (
                    <Bubble
                      key={shortcut.id}
                      onClick={() =>
                        switchSubspace(shortcut.type, {
                          [ResourceRouteType.Org]: targetOrg.actor?.slug,
                          [ResourceRouteType.ManageOrg]: targetOrg?.actor?.slug,
                        })
                      }
                      selected={(org?.id === targetOrg.id || manageOrg?.id === targetOrg.id) && !isSearching}
                    >
                      <Avatar
                        src={getAvatar(actor?.actorImages)}
                        name={actor?.name}
                        size="full"
                        rounded={AVATAR_SHORTCUT_ROUNDED}
                      />
                    </Bubble>
                  );
                }
                return null;
              })
              .filter(isNotNull)}
          </div>
        </div>

        {/* Menus */}
        <div className="scrollbar h-full w-full relative lg:px-[calc(var(--padding-inner)*3)] mt-[var(--padding-inner)]">
          {Object.entries(menus[selected.subSpace].menus).map(([_, menu]: [string, Menu], idx) => (
            <SidebarMenu idx={idx} menu={menu} key={idx} />
          ))}
        </div>
      </div>
    </nav>
  );
}
