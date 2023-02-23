import { SideShortcut } from './SideShortcut';
import { SidebarMenu } from './SidebarMenu';

import { menus, shortcutMenus } from '../../../menus';
import { getLink } from '#site/app/utils/get-link';

import { ReactComponent as AdminIcon } from '@okampus/assets/svg/icons/filled/admin-settings.svg';
import { ReactComponent as HomeIcon } from '@okampus/assets/svg/icons/filled/home.svg';

import { Avatar, Bubble } from '@okampus/ui/atoms';
import { CurrentContext, NavigationContext, useCurrentContext } from '@okampus/ui/hooks';
import { getAvatar } from '@okampus/ui/utils';

import { ScopeRole } from '@okampus/shared/enums';
import { defaultSelectedMenu } from '@okampus/shared/types';
import { SubspaceTypes } from '@okampus/shared/types';

import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import type { Menu } from '../../../menus';
import type { SelectedMenu, SideBubble } from '@okampus/shared/types';
import type { ShortcutType } from '@okampus/shared/enums';

const getMenu = (selected: SelectedMenu): Menu => {
  const menu = menus[selected.subSpace].menus[selected.menu];
  if (!menu.sub) return menu;
  return menu.sub[selected.subMenu];
};

const baseBubble: SideBubble = { subSpace: SubspaceTypes.Home, icon: HomeIcon };
const adminBubbles: SideBubble[] = [{ subSpace: SubspaceTypes.Admin, icon: AdminIcon }];

export function Sidebar() {
  const navigate = useNavigate();
  const { isSearching, setIsSearching, selected } = useContext(NavigationContext);
  const { setCurrentOrgId } = useContext(CurrentContext);

  const [{ org, user, tenant }] = useCurrentContext();

  const switchSubspace = (subSpace: SubspaceTypes, shortcutKey?: ShortcutType, orgSlug?: string) => {
    if (isSearching) setIsSearching(false);
    if (subSpace !== SubspaceTypes.Manage) setCurrentOrgId(null);

    const selected = shortcutKey ? shortcutMenus[shortcutKey] : { ...defaultSelectedMenu, subSpace };
    const menu = getMenu(selected);

    navigate(getLink(menu.link, { orgSlug: orgSlug ?? org?.actor?.slug }));
  };

  const showBubbles = user?.scopeRole === ScopeRole.Admin ? adminBubbles : [];
  const shortcuts = user?.shortcuts || [];

  const tenantSubpsaces = new Set([SubspaceTypes.Home, SubspaceTypes.Admin]);

  const getSubspaceName = () => {
    if (tenantSubpsaces.has(selected.subSpace)) return tenant?.actor?.name;
    if (selected.subSpace === SubspaceTypes.Manage) return org?.actor?.name;
    return;
  };

  const getSubspaceAvatar = () => {
    if (tenantSubpsaces.has(selected.subSpace)) return getAvatar(tenant?.actor?.actorImages);
    if (selected.subSpace === SubspaceTypes.Manage) return getAvatar(org?.actor?.actorImages);
    return;
  };

  return (
    <nav className="h-full flex flex-col p-inner w-sidebar bg-0">
      {/* Header */}
      <div className="flex gap-inner">
        <Bubble
          onClick={() => switchSubspace(baseBubble.subSpace)}
          selected={selected.subSpace === baseBubble.subSpace && !isSearching}
          showBg={true}
        >
          <baseBubble.icon height="26" />
        </Bubble>
        <div className="flex gap-2 items-center">
          <Avatar name={getSubspaceName()} src={getSubspaceAvatar()} size={18} rounded={50} />
          <h2 className="text-0 text-2xl tracking-tighter font-semibold font-title lg-max:hidden line-clamp-1">
            {getSubspaceName()}
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
                <bubble.icon height="26" />
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
        <div className="overflow-scroll scrollbar h-full w-full relative pt-2">
          {Object.entries(menus[selected.subSpace].menus).map(([_, menu]: [string, Menu], idx) => (
            <SidebarMenu idx={idx} menu={menu} key={idx} />
          ))}
        </div>
      </div>
    </nav>
  );
}
