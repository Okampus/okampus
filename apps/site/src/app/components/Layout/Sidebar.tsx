import { menus } from '../../menus';

import { ReactComponent as LogoutIcon } from '@okampus/assets/svg/icons/logout.svg';
import { ReactComponent as SortArrowsFilledIcon } from '@okampus/assets/svg/icons/filled/sort-arrows.svg';
import { ReactComponent as AdminFilledIcon } from '@okampus/assets/svg/icons/filled/admin-settings.svg';
import { ReactComponent as PublicFilledIcon } from '@okampus/assets/svg/icons/filled/public.svg';

import { ReactComponent as EventFilledIcon } from '@okampus/assets/svg/icons/filled/event.svg';
import { ReactComponent as EventOutlinedIcon } from '@okampus/assets/svg/icons/outlined/event.svg';
import { ReactComponent as WorkFilledIcon } from '@okampus/assets/svg/icons/filled/work.svg';
import { ReactComponent as WorkOutlinedIcon } from '@okampus/assets/svg/icons/outlined/work.svg';
import { ReactComponent as AddBoxFilledIcon } from '@okampus/assets/svg/icons/filled/add-box.svg';
import { ReactComponent as AddBoxOutlinedIcon } from '@okampus/assets/svg/icons/outlined/add-box.svg';

import {
  AVATAR_TENANT_ROUNDED,
  AVATAR_USER_ROUNDED,
  CLUBS_ROUTE,
  CLUB_CATEGORY_ROUTE,
  COLORS,
  EVENTS_ROUTE,
  PROJECTS_ROUTE,
  TEAM_MANAGE_ROUTE,
} from '@okampus/shared/consts';
import { ViewType } from '@okampus/shared/enums';
import {
  getFragmentData,
  getTeamCategoriesQuery,
  logoutMutation,
  ScopeRole,
  teamCategoryFragment,
} from '@okampus/shared/graphql';
import { isNotNull, nonEmptyOrNull } from '@okampus/shared/utils';

import { Avatar, Popover, PopoverContent, PopoverTrigger, Skeleton } from '@okampus/ui/atoms';
import { NavigationContext, useMe } from '@okampus/ui/hooks';
import { ActionList, SelectMenu } from '@okampus/ui/molecules';
import { getAvatar } from '@okampus/ui/utils';

import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import type { Menu } from '../../menus';

export const smallHideClassName = 'xl-max:hidden';

const menusClassName = 'xl-max:gap-6 flex flex-col h-full p-3 overflow-y-scroll scrollbar';
const iconClassName = 'xl-max:w-full w-9 aspect-square shrink-0';
const linkClassName = 'xl-max:hidden font-heading line-clamp-1';
const hrClassName = 'xl-max:hidden border-color-3 m-3';
const sectionClassName = 'xl-max:gap-2 flex flex-col';
const textSeparatorClassName = clsx(linkClassName, 'text-1 px-2 pb-1.5 font-semibold text-lg');

const eventsMenu = {
  icon: EventOutlinedIcon,
  iconSelected: EventFilledIcon,
  label: 'Événements',
  link: EVENTS_ROUTE,
};

const projectsMenu = {
  icon: WorkOutlinedIcon,
  iconSelected: WorkFilledIcon,
  label: 'Projets',
  link: PROJECTS_ROUTE,
};

const clubsMenu = {
  icon: AddBoxOutlinedIcon,
  iconSelected: AddBoxFilledIcon,
  label: 'Associations',
  link: CLUBS_ROUTE,
};

const sidebarLinkClass = 'p-2 text-hover flex items-center gap-item rounded-lg';
type SidebarLinkProps = {
  menu: Menu;
  selected: boolean;
};

function SidebarLink({ menu, selected }: SidebarLinkProps) {
  const icon = selected && menu.iconSelected ? menu.iconSelected : menu.icon;
  return (
    <motion.div whileTap={{ scale: 0.95 }} className="w-full bg-1-hover rounded-xl">
      <Link to={menu.link} className={clsx(selected ? 'text-0 font-bold' : 'text-1 font-semibold', sidebarLinkClass)}>
        {icon && icon({ className: iconClassName })}
        <div className={linkClassName}>{menu.label}</div>
      </Link>
    </motion.div>
  );
}

export function SidebarMenu({ menu }: { menu: Menu }) {
  const { selected } = useContext(NavigationContext);

  if (!menu.sub || menu.sub.length === 0)
    return <SidebarLink menu={menu} selected={selected.menuId.startsWith(menu.link)} />;

  return (
    <SelectMenu
      items={menu.sub.map((subMenu) => ({
        label: <SidebarLink menu={subMenu} selected={selected.menuId.startsWith(subMenu.link)} />,
        value: subMenu.link,
      }))}
      placeholder={<SidebarLink menu={menu} selected={selected.menuId.startsWith(menu.link)} />}
      customDropdown={null}
      fullWidth={true}
      isContentAbsolute={false}
      showSelected={false}
      isControlled={true}
      open={selected.menuId === menu.link}
      placeholderClassName={'!p-0'}
      contentClassName={'bg-2 !p-0'}
      itemClassName=""
    />
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  // const breakpoint = useBreakpoint();

  const client = useApolloClient();
  const { selected, setSelected, tenant, setTenant } = useContext(NavigationContext);
  const { me } = useMe();

  const [getTeamCategories, { data }] = useLazyQuery(getTeamCategoriesQuery);

  const [logout] = useMutation(logoutMutation, {
    onCompleted: () => {
      setTenant(null);
      client.clearStore();
      navigate('/welcome', { replace: true });
    },
  });

  const teamShortcuts = nonEmptyOrNull(
    me?.shortcuts
      .map((shortcut) => (shortcut.targetActor?.org?.__typename === 'TeamModel' ? shortcut.targetActor : null))
      .filter(isNotNull)
  );

  const teamCategories = data?.teamCategories.edges?.map((edge) => getFragmentData(teamCategoryFragment, edge?.node));

  useEffect(() => {
    if (!teamShortcuts) getTeamCategories();
  }, [getTeamCategories, teamShortcuts]);

  const tenantActions = [
    ...(me?.scopeRole === ScopeRole.Admin
      ? [
          selected.viewType === ViewType.Admin
            ? {
                label: 'Passer en vue publique',
                icon: <PublicFilledIcon className="h-6" />,
                linkOrAction: () => setSelected({ ...selected, viewType: ViewType.Community }),
              }
            : {
                label: 'Passer en vue administrateur',
                icon: <AdminFilledIcon className="h-6" />,
                linkOrAction: () => setSelected({ ...selected, viewType: ViewType.Admin }),
              },
        ]
      : []),
    {
      label: 'Se déconnecter',
      icon: <LogoutIcon className="h-6" />,
      linkOrAction: () => logout(),
    },
  ];

  return (
    <nav className="h-full flex flex-col w-sidebar bg-main shrink-0 border-r border-color-3">
      {/* Subspace name */}
      <Popover forcePlacement={true} placement="bottom-start" placementOffset={10}>
        <PopoverTrigger>
          <div className="bg-1-hover cursor-pointer shrink-0 flex justify-between items-center h-[var(--topbar-height)] px-4">
            <div className="flex gap-item items-center">
              {tenant && tenant.actor ? (
                <>
                  <Avatar
                    name={tenant.actor.name}
                    src={getAvatar(tenant.actor.actorImages)}
                    size={18}
                    rounded={AVATAR_TENANT_ROUNDED}
                  />
                  <div className={clsx('flex flex-col items-start', smallHideClassName)}>
                    <h2 className="text-0 text-xl tracking-tighter font-bold font-heading line-clamp-1">
                      {tenant.actor.name}
                    </h2>
                    <div className="text-3 text-sm -mt-0.5">
                      {selected.viewType === ViewType.Community ? 'Vie associative' : 'Administration'}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Skeleton rounded={`${AVATAR_TENANT_ROUNDED}%`} height={16} width={16} />
                  <div className={smallHideClassName}>
                    <Skeleton height={14} width={48} />
                    <Skeleton height={6} width={48} />
                  </div>
                </>
              )}
            </div>
            <SortArrowsFilledIcon className={clsx('h-7 text-1 -mr-2', smallHideClassName)} />
          </div>
        </PopoverTrigger>

        <PopoverContent popoverClassName="!p-0">
          <div className="flex flex-col w-popover-card">
            {/* TODO: add as component */}
            <div className="card-sm bg-4 m-2 flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="flex gap-item items-center">
                  <Avatar
                    name={tenant?.actor?.name}
                    src={getAvatar(tenant?.actor?.actorImages)}
                    size={26}
                    rounded={AVATAR_TENANT_ROUNDED}
                  />
                  <div className={clsx('flex flex-col')}>
                    <h2 className="text-0 text-xl tracking-tighter font-bold font-heading line-clamp-1">
                      {tenant?.actor?.name}
                    </h2>
                    <div className="text-3 text-sm -mt-0.5">
                      {selected.viewType === ViewType.Community ? 'Vie associative' : 'Administration'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ActionList actions={tenantActions} />
          </div>
        </PopoverContent>
      </Popover>

      {/* Menus */}
      <div className={menusClassName}>
        <div className={sectionClassName}>
          {Object.entries(menus[selected.viewType].menus).map(([_, menu]: [string, Menu], idx) => (
            <SidebarMenu key={idx} menu={menu} />
          ))}
        </div>
        <hr className={hrClassName} />
        <div className={sectionClassName}>
          <div className={textSeparatorClassName}>Activités</div>
          <SidebarMenu menu={eventsMenu} />
          <SidebarMenu menu={projectsMenu} />
        </div>
        <hr className={hrClassName} />
        <div className={sectionClassName}>
          <div className={textSeparatorClassName}>Associations</div>
          {teamShortcuts && teamShortcuts.length > 0
            ? [
                ...teamShortcuts.map((teamShortcut) => {
                  const link = TEAM_MANAGE_ROUTE(teamShortcut.slug);
                  return (
                    <SidebarMenu
                      key={teamShortcut.id}
                      menu={{
                        link,
                        label: teamShortcut.name,
                        icon: ({ className }) => (
                          <Avatar
                            name={teamShortcut.name}
                            rounded={AVATAR_USER_ROUNDED}
                            src={getAvatar(teamShortcut.actorImages)}
                            className={className}
                            size={13.5}
                          />
                        ),
                      }}
                    />
                  );
                }),
                <SidebarMenu key={clubsMenu.link} menu={clubsMenu} />,
              ]
            : teamCategories
            ? teamCategories.map((category) => {
                const link = CLUB_CATEGORY_ROUTE(category.slug);
                return (
                  <SidebarMenu
                    key={category.id}
                    menu={{
                      link,
                      label: category.name,
                      icon: ({ className }) =>
                        category.iconImage ? (
                          <img
                            src={category.iconImage.url}
                            alt={category.name}
                            className={className}
                            style={{
                              borderRadius: `${AVATAR_USER_ROUNDED}%`,
                              opacity: selected.menuId === link ? 1 : 0.8,
                            }}
                          />
                        ) : (
                          <div
                            className={className}
                            style={{
                              borderRadius: `${AVATAR_USER_ROUNDED}%`,
                              backgroundColor: COLORS[category.color],
                              opacity: selected.menuId === link ? 1 : 0.8,
                            }}
                          />
                        ),
                    }}
                  />
                );
              })
            : Array.from({ length: 4 })
                .fill(0)
                .map((_, idx) => (
                  <div className={sidebarLinkClass} key={idx}>
                    <Skeleton rounded={`${AVATAR_USER_ROUNDED}%`} className={iconClassName} />
                    <Skeleton height={6} width={64} className={linkClassName} />
                  </div>
                ))}
        </div>
      </div>
    </nav>
  );
}
