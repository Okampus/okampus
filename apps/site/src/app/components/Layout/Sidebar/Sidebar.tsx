import './Sidebar.css';

import { HOME, ADMIN, MANAGE } from './Sidebar.types';
import { SideShortcut } from './SideShortcut';
import { SidebarMenu } from './SidebarMenu';

import { menus, shortcutMenus } from '../../../menus';

import { ReactComponent as ShieldAccountIcon } from '@okampus/assets/svg/icons/shield-account.svg';
import { ReactComponent as HomeIcon } from '@okampus/assets/svg/icons/home.svg';

import { Bubble } from '@okampus/ui/atoms';
import { CurrentContext, NavigationContext, useCurrentContext, useTheme } from '@okampus/ui/hooks';
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

    const selected = shortcutKey ? shortcutMenus[shortcutKey] : { ...defaultSelectedMenu, subSpace };
    const menu = getMenu(selected);

    console.log('switchSubspace', { subSpace, shortcutKey, orgSlug, selected, menu });

    navigate(getLink(menu.link, { orgSlug: orgSlug ?? org?.actor?.slug }));
    if (subSpace !== MANAGE) {
      setCurrentOrgId(null);
    }
  };

  const showBubbles = [...baseBubbles, ...(user?.scopeRole === ScopeRole.Admin ? adminBubbles : [])];

  const [theme, setTheme] = useTheme();

  // const tenantImages = tenant?.actor?.actorImages || [];
  // const tenantAvatarSrc = tenantImages.find((img) => img.type === ActorImageType.Avatar)?.image?.url;
  // const tenantAvatarDarkSrc = tenantImages.find((img) => img.type === ActorImageType.AvatarDarkMode)?.image?.url;

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
        {/* <div className="flex lg-max:flex-col-reverse items-center justify-center gap-4 my-4 px-4">
            <div className="lg-max:hidden text-0">
              <UserLabel
                avatar={
                  user?.actor?.actorImages
                    .map((actorImageFragment) => {
                      const actorImageBare = getFragmentData(actorImageBareFragment, actorImageFragment);
                      return { type: actorImageBare.type, image: actorImageBare.image };
                    })
                    .find((actorImage) => actorImage.type === ActorImageType.Avatar)?.image?.url
                }
                name={user?.actor?.name}
                ellipsis={true}
              />
            </div>
            <div
              className="text-0 h-9 w-10 bg-2 p-2 rounded-lg cursor-pointer items-center justify-center"
              onClick={() => logout()}
            >
              <LogoutIcon />
            </div>
            <DarkModeToggle checked={theme === 'light'} onChange={changeTheme} size={23} />
          </div> */}
      </nav>
    </div>
  );
}

if (import.meta.vitest) {
  // add tests related to your file here
  // For more information please visit the Vitest docs site here: https://vitest.dev/guide/in-source.html

  const { it, expect, beforeEach } = import.meta.vitest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let render: any;

  beforeEach(async () => {
    // eslint-disable-next-line unicorn/no-await-expression-member
    render = (await import('@testing-library/react')).render;
  });

  it('should render successfully', () => {
    const { baseElement } = render(<Sidebar />);
    expect(baseElement).toBeTruthy();
  });
}
