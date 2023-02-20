import './Sidebar.css';

import { HOME, ADMIN, MANAGE } from './Sidebar.types';
import { SideShortcut } from './SideShortcut';
import { SidebarMenu } from './SidebarMenu';

import { menus, shortcutMenus } from '../../../menus';

import { ReactComponent as ShieldAccountIcon } from '@okampus/assets/svg/icons/shield-account.svg';
import { ReactComponent as HomeIcon } from '@okampus/assets/svg/icons/home.svg';

import { Bubble } from '@okampus/ui/atoms';
import { CurrentContext, NavigationContext, useCurrentContext } from '@okampus/ui/hooks';
import { getLink } from '#site/app/utils/get-link';
import { ScopeRole } from '@okampus/shared/enums';

import { defaultSelectedMenu } from '@okampus/shared/types';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import type { SelectedMenu, SubspaceTypes } from '@okampus/shared/types';
import type { SideBubble } from './Sidebar.types';
import type { ShortcutType } from '@okampus/shared/enums';
import type { Menu } from '../../../menus';

const getMenu = (selected: SelectedMenu): Menu => {
  const menu = menus[selected.subSpace].menus[selected.menu];
  if (!menu.sub) return menu;
  return menu.sub[selected.subMenu];
};

const baseBubbles: SideBubble[] = [{ subSpace: HOME, icon: HomeIcon }];
const adminBubbles: SideBubble[] = [{ subSpace: ADMIN, icon: ShieldAccountIcon }];

export function Sidebar() {
  const navigate = useNavigate();
  const { isSearching, setIsSearching, selected } = useContext(NavigationContext);
  const { setCurrentOrgId } = useContext(CurrentContext);

  const [{ org, user }] = useCurrentContext();

  const switchSubspace = (subSpace: SubspaceTypes, shortcutKey?: ShortcutType, orgSlug?: string) => {
    if (isSearching) setIsSearching(false);
    if (subSpace !== MANAGE) setCurrentOrgId(null);

    const selected = shortcutKey ? shortcutMenus[shortcutKey] : { ...defaultSelectedMenu, subSpace };
    const menu = getMenu(selected);

    navigate(getLink(menu.link, { orgSlug: orgSlug ?? org?.actor?.slug }));
  };

  const showBubbles = [...baseBubbles, ...(user?.scopeRole === ScopeRole.Admin ? adminBubbles : [])];

  const shortcuts = user?.shortcuts || [];
  return (
    <div className="flex bg-0 px-2 py-4">
      <nav className="flex flex-col justify-between">
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
          <hr className="m-2 border-color-2" />
          <div className="overflow-scroll scrollbar-none flex flex-col rounded-t-2xl">
            {shortcuts
              .map((shortcut, idx) => <SideShortcut shortcut={shortcut} switchSubspace={switchSubspace} key={idx} />)
              .filter((shortcut) => shortcut !== null)}
          </div>
        </div>
      </nav>
      <nav className="lg:w-56 flex flex-col justify-between">
        <div className="flex flex-col gap-6 px-3">
          <div className="lg-max:-mt-0.5 flex flex-col gap-2 justify-between w-full h-full">
            <div className="flex flex-col overflow-scroll-y scrollbar h-full pb-4 w-full gap-10">
              <div className="flex flex-col gap-1 relative z-[1]">
                {Object.entries(menus[selected.subSpace].menus).map(([_, menu]: [string, Menu], idx) => (
                  <SidebarMenu idx={idx} menu={menu} key={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
