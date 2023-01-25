import './Sidebar.css';

import { fuseClasses } from '@okampus/shared/utils';
import { useContext, useState } from 'react';

import { ReactComponent as ShieldAccountIcon } from '@okampus/assets/svg/icons/shield-account.svg';
import { ReactComponent as HomeIcon } from '@okampus/assets/svg/icons/home.svg';
import { ReactComponent as LogoutIcon } from '@okampus/assets/svg/icons/logout.svg';

import { IOrg } from '@okampus/shared/dtos';
import { Link, useNavigate } from 'react-router-dom';
import { NavigationContext } from '#site/app/context/NavigationContext';
import { Bubble, DarkModeToggle } from '@okampus/ui/atoms';
import useTheme from 'apps/site/src/hooks/useDarkSide';
import menus from 'apps/site/src/menus';
import { getLink } from 'apps/site/src/utils/get-link';

const accordeonChildClass = 'child transition-all';
const accordeonHoverClass =
  'relative after:absolute after:left-0 after:z-[-1] after:w-full after:h-full after:[transition:color_0.2s,transform_0.8s_cubic-bezier(.17,.67,0,1.12),opacity_0.5s_cubic-bezier(.17,.67,0,1.12)] after:opacity-0 after:scale-[90%] after:hover:opacity-50 after:hover:scale-100 after:hover:bg-[#dbeafc] after:hover:dark:bg-[#0e1f3f] after:rounded-lg';

export interface Menu {
  label: string;
  icon?: React.FC;
  tip?: string;
  link: string;
  sub?: Record<string, Menu>;
}

export function Sidebar() {
  const navigate = useNavigate();
  const { org, setOrg, setUser } = useContext(NavigationContext);

  const [subSpace, setSubspace] = useState<keyof typeof menus>('home');
  const [selected, setSelected] = useState({ menu: 0, subMenu: 0 });

  const switchSubspace = (newSpace: keyof typeof menus) => {
    if (newSpace !== subSpace) {
      setSelected({ menu: 0, subMenu: 0 });
    }

    navigate(getLink(Object.entries(menus[newSpace].menus)[0][1].link, { orgSlug: org?.actor?.slug }));
    setSubspace(newSpace);
  };

  const [theme, setTheme] = useTheme();

  return (
    <div className="flex">
      <div className="flex flex-col justify-between py-4 px-3">
        <nav className="flex flex-col gap-2.5 overflow-scroll app-scrollbar shrink-0">
          <Bubble onClick={() => switchSubspace('home')} selected={subSpace === 'home'} showBg={true}>
            <HomeIcon height="30" />
          </Bubble>
          <Bubble onClick={() => switchSubspace('admin')} selected={subSpace === 'admin'} showBg={true}>
            <ShieldAccountIcon height="30" />
          </Bubble>
          <Bubble
            onClick={() => {
              setOrg({ actor: { slug: 'horizon' } } as IOrg);
              switchSubspace('manage');
            }}
            selected={subSpace === 'manage'}
          >
            <img
              src="https://cdn.discordapp.com/icons/827518251608178728/3f066f2e311cac3391786c1b1872adc7.webp?size=96"
              alt="Logo Horizon"
            />
          </Bubble>
          {/* {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="h-[3rem] w-[3rem] bg-opposite shrink-0 rounded-[50%] hover:rounded-[35%] transition-all"
            ></div>
          ))} */}
        </nav>
        <div>
          <Bubble onClick={() => setUser(null)} showBg={true}>
            <LogoutIcon height="30" />
          </Bubble>
        </div>
      </div>
      <nav className="px-4 pt-6 md:w-60 h-full">
        <div className="flex flex-col gap-2 justify-between w-full h-full">
          <div className="flex justify-between pb-3 md-max:justify-center">
            <h2 className="text-0 px-3 text-lg pt-1 md-max:hidden">Efrei Paris</h2>
            <div className="px-1.5 pt-1.5 md-max:pb-1.5 bg-2 md:mr-5 rounded-full">
              <DarkModeToggle
                style={{ color: 'black' }}
                checked={theme === 'light'}
                onChange={(isDark) => (isDark ? setTheme('dark') : setTheme('light'))}
                size={20}
              />
            </div>
          </div>

          <div className="flex flex-col overflow-scroll app-scrollbar h-full pb-4 w-full gap-10">
            <div className="flex flex-col gap-1 relative z-[1]">
              {Object.entries(menus[subSpace].menus).map(([route, menu]: [string, Menu], idx) => (
                <div
                  key={route}
                  className={fuseClasses(
                    'flex flex-col [&.active]:bg-[#dbeafc] [&.active]:dark:bg-[#0e1f3f] rounded-lg',
                    idx === selected.menu ? 'active' : ''
                  )}
                >
                  <Link to={getLink(menu.link, { orgSlug: org?.actor?.slug })}>
                    <span
                      title={menu.tip}
                      className={fuseClasses(
                        accordeonHoverClass,
                        idx === selected.menu ? 'bg-active text-1' : 'cursor-pointer text-3',
                        'cursor-pointer py-3 px-4 rounded-lg flex gap-4 items-center font-medium'
                      )}
                      onClick={() => setSelected({ menu: idx, subMenu: 0 })}
                    >
                      {menu.icon && menu.icon({ className: 'h-6' })}
                      <h5 className="text-sm md-max:hidden">{menu.label}</h5>
                    </span>
                  </Link>
                  {menu?.sub && (
                    <ul
                      className={fuseClasses(
                        'accordeon flex flex-col px-2',
                        idx === selected.menu ? 'active py-2' : ''
                      )}
                    >
                      {Object.entries(menu.sub).map(([subRoute, subMenu], subIdx) => (
                        <Link to={getLink(subMenu.link, { orgSlug: org?.actor?.slug })} key={subRoute}>
                          <span
                            key={subRoute}
                            title={subMenu.tip}
                            className={fuseClasses(
                              accordeonChildClass,
                              'flex items-center justify-start gap-4 overflow-hidden rounded-lg px-2 text-sm font-medium',
                              subIdx === selected.subMenu
                                ? 'text-orange-400 bg-orange-300/30 cursor-default'
                                : 'cursor-pointer text-2'
                            )}
                            onClick={() => setSelected({ menu: idx, subMenu: subIdx })}
                          >
                            {subMenu.icon && subMenu.icon({ className: 'h-6' })}
                            <h5 className="text-sm md-max:hidden">{subMenu.label}</h5>
                            {/* <slot name={subRoute} /> */}
                            {/* <i class={subMenu.icon} /> */}
                          </span>
                        </Link>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            {/* <AccordeonTabs selected={selected} onChange={setSelected} menus={menus.home.menus} /> */}
            {/* <div className="flex justify-center">
        </div> */}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;

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
