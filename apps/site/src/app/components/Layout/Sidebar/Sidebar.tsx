import { SideShortcut } from './SideShortcut';
import { SidebarMenu } from './SidebarMenu';

import { menus, shortcutMenus } from '../../../menus';

import { ReactComponent as AdminIcon } from '@okampus/assets/svg/icons/filled/admin-settings.svg';
import { ReactComponent as HomeIcon } from '@okampus/assets/svg/icons/filled/home.svg';

import { Avatar, Bubble } from '@okampus/ui/atoms';
import { NavigationContext, useManageOrg, useMe, useOrg } from '@okampus/ui/hooks';
import { getAvatar } from '@okampus/ui/utils';

import { ScopeRole } from '@okampus/shared/enums';
import { defaultSelectedMenu } from '@okampus/shared/types';
import { SubspaceType } from '@okampus/shared/types';

import { ShortcutType } from '@okampus/shared/enums';
import { enumChecker } from '@okampus/shared/utils';
import { getLink } from '#site/app/utils/get-link';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import type { Menu } from '../../../menus';
import type { LinkContext } from '#site/app/utils/get-link';
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
  const { me } = useMe();
  const { isSearching, setIsSearching, selected, tenant } = useContext(NavigationContext);
  const { org } = useOrg();
  const { manageOrg } = useManageOrg();

  const switchSubspace = (shortcutType: SubspaceType | ShortcutType, context?: LinkContext) => {
    if (isSearching) setIsSearching(false);
    const link = getMenuLink(isSubSpace(shortcutType) ? subSpaceMenu(shortcutType) : shortcutMenus[shortcutType]);
    navigate(getLink(link, context));
  };

  const showBubbles = me?.scopeRole === ScopeRole.Admin ? adminBubbles : [];
  const shortcuts = me?.shortcuts || [];

  const tenantSubpsaces = new Set([SubspaceType.Home, SubspaceType.Admin]);

  const getSubspaceInfo = () => {
    if (tenantSubpsaces.has(selected.subSpace) && tenant?.actor)
      return { name: tenant.actor.name, avatar: getAvatar(tenant.actor.actorImages) };
    if (selected.subSpace === SubspaceType.Org && org?.actor)
      return { name: org.actor.name, avatar: getAvatar(org.actor.actorImages) };
    if (selected.subSpace === SubspaceType.Manage && manageOrg?.actor)
      return { name: manageOrg.actor.name, avatar: getAvatar(manageOrg.actor.actorImages) };
    return {};
  };

  const { name, avatar } = getSubspaceInfo();

  return (
    <nav className="h-full flex flex-col p-sidebar w-sidebar bg-0">
      {/* Header */}
      <div className="flex gap-inner">
        {/* Home shortcut */}
        <Bubble
          onClick={() => switchSubspace(baseBubble.subSpace)}
          selected={selected.subSpace === baseBubble.subSpace && !isSearching}
          showBg={true}
        >
          <baseBubble.icon className="p-1" />
        </Bubble>

        {/* Subspace name */}
        <div className="flex gap-2 items-center p-sidebar-name">
          <Avatar name={name} src={avatar} size={16} rounded={50} />
          <h2 className="text-0 text-2xl tracking-tighter font-semibold font-title lg-max:hidden line-clamp-1">
            {name}
          </h2>
        </div>
      </div>
      <div className="flex flex-1 gap-inner overflow-hidden">
        {/* Shortcuts */}
        <div className="flex flex-col">
          <div className="h-full flex flex-col shrink-0">
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
            <hr className="m-2 border-color-3" />
            <div className="overflow-scroll scrollbar flex flex-col rounded-t-2xl">
              {shortcuts
                .map((shortcut, idx) => <SideShortcut shortcut={shortcut} switchSubspace={switchSubspace} key={idx} />)
                .filter((shortcut) => shortcut !== null)}
            </div>
          </div>
        </div>

        {/* Menus */}
        <div className="overflow-scroll scrollbar h-full w-full relative p-sidebar-menu-list">
          {Object.entries(menus[selected.subSpace].menus).map(([_, menu]: [string, Menu], idx) => (
            <SidebarMenu idx={idx} menu={menu} key={idx} />
          ))}
        </div>
      </div>
    </nav>
  );
}
