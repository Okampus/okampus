import { menus } from '../../menus';

import { ReactComponent as LogoutIcon } from '@okampus/assets/svg/icons/logout.svg';
import { ReactComponent as SortArrowsFilledIcon } from '@okampus/assets/svg/icons/material/filled/sort-arrows.svg';
import { ReactComponent as AdminFilledIcon } from '@okampus/assets/svg/icons/material/filled/admin-settings.svg';
import { ReactComponent as PublicFilledIcon } from '@okampus/assets/svg/icons/material/filled/public.svg';

import { ReactComponent as EventFilledIcon } from '@okampus/assets/svg/icons/material/filled/event.svg';
import { ReactComponent as EventOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/event.svg';
import { ReactComponent as WorkFilledIcon } from '@okampus/assets/svg/icons/material/filled/work.svg';
import { ReactComponent as WorkOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/work.svg';
import { ReactComponent as AddBoxFilledIcon } from '@okampus/assets/svg/icons/material/filled/add-box.svg';
import { ReactComponent as AddBoxOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/add-box.svg';

import {
  AVATAR_USER_ROUNDED,
  CLUBS_ROUTE,
  CLUB_CATEGORY_ROUTE,
  COLORS,
  EVENTS_ROUTE,
  PROJECTS_ROUTE,
  TEAM_MANAGE_ROUTE,
  WELCOME_ROUTE,
} from '@okampus/shared/consts';
import { ScopeRole, TagType, TeamType, ViewType } from '@okampus/shared/enums';
import { fileUploadBaseInfo, OrderBy, tagBaseInfo, useTypedLazyQuery, logoutMutation } from '@okampus/shared/graphql';
import { isIn, isNotNull, arrayNotEmptyOrNull } from '@okampus/shared/utils';
import { AvatarImage, Popover, PopoverContent, PopoverTrigger, Skeleton } from '@okampus/ui/atoms';
import { NavigationContext, useCurrentUser } from '@okampus/ui/hooks';
import { MenuList } from '@okampus/ui/molecules';
import { getAvatar } from '@okampus/ui/utils';

import { useApolloClient, useMutation } from '@apollo/client';

import clsx from 'clsx';

import { motion } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import type { Menu } from '../../menus';

const eventsMenu: Menu = {
  icon: EventOutlinedIcon,
  iconSelected: EventFilledIcon,
  label: 'Événements',
  linkOrAction: EVENTS_ROUTE,
};

const projectsMenu: Menu = {
  icon: WorkOutlinedIcon,
  iconSelected: WorkFilledIcon,
  label: 'Projets',
  linkOrAction: PROJECTS_ROUTE,
};

const clubsMenu: Menu = {
  icon: AddBoxOutlinedIcon,
  iconSelected: AddBoxFilledIcon,
  label: 'Associations',
  linkOrAction: CLUBS_ROUTE,
};

export const smallHideClassName = 'xl-max:hidden';

const menusClassName =
  'xl-max:ml-1 xl-max:mt-1 xl-max:gap-6 flex flex-col h-full xl-max:p-2.5 p-3.5 overflow-y-scroll scrollbar text-1';
const iconClassName = 'w-9 aspect-square shrink-0 !transition-none';
const linkClassName = clsx(smallHideClassName, 'line-clamp-1');
const hrClassName = clsx(smallHideClassName, 'separator');
const sectionClassName = 'flex flex-col';
const textSeparatorClassName = clsx(linkClassName, 'label px-2');

const sidebarLinkClass = 'p-2 flex items-center gap-item rounded-lg text-lg font-bold !transition-none';

export type SidebarLinkProps = { menu: Menu; selected: boolean };
function SidebarLink({ menu, selected }: SidebarLinkProps) {
  const context = useContext(NavigationContext);

  const icon = selected && menu.iconSelected ? menu.iconSelected : menu.icon;
  const inner = (
    <>
      {icon && icon({ className: iconClassName })}
      <div className={linkClassName}>{menu.label}</div>
    </>
  );

  const linkOrAction = menu.linkOrAction;
  return (
    <motion.div whileTap={{ scale: 0.95 }} className="w-full rounded-lg xl-max:mx-auto">
      {typeof linkOrAction === 'string' ? (
        <Link
          to={linkOrAction}
          className={clsx(
            selected ? 'text-primary contrast-hover' : 'text-2 text-0-hover text-hover opacity-95 hover:opacity-100',
            sidebarLinkClass
          )}
        >
          {inner}
        </Link>
      ) : (
        <button
          className={clsx(
            selected ? 'text-primary contrast-hover' : 'text-2 text-0-hover text-hover opacity-95 hover:opacity-100',
            sidebarLinkClass
          )}
          onClick={() => linkOrAction(context)}
        >
          {inner}
        </button>
      )}
    </motion.div>
  );
}

export function Sidebar() {
  const navigate = useNavigate();

  const client = useApolloClient();
  const { selected, setSelected, tenant, setTenant, setIsLoggedIn } = useContext(NavigationContext);
  const { currentUser } = useCurrentUser();

  const [getTeamCategories, { data }] = useTypedLazyQuery({
    tag: [
      { where: { type: { _eq: TagType.TeamCategory } }, orderBy: [{ name: OrderBy.ASC }] },
      { ...tagBaseInfo, image: fileUploadBaseInfo },
    ],
  });

  const [logout] = useMutation(logoutMutation, {
    onCompleted: () => {
      setTenant(null);
      setIsLoggedIn(false);
      client.clearStore();
      navigate(WELCOME_ROUTE, { replace: true });
    },
  });

  const shortcuts = arrayNotEmptyOrNull(currentUser?.shortcuts.map((shortcut) => shortcut?.actor).filter(isNotNull));
  const tags = data?.tag;

  useEffect(() => {
    if (!shortcuts) getTeamCategories();
  }, [getTeamCategories, shortcuts]);

  const tenantActions = [
    {
      actions: [
        ...(currentUser?.individual?.scopeRole === ScopeRole.Admin
          ? [
              selected.viewType === ViewType.Admin
                ? {
                    label: 'Passer en vue publique',
                    iconOrSwitch: <PublicFilledIcon />,
                    linkOrActionOrMenu: () => setSelected({ ...selected, viewType: ViewType.Community }),
                  }
                : {
                    label: 'Passer en vue administrateur',
                    iconOrSwitch: <AdminFilledIcon />,
                    linkOrActionOrMenu: () => setSelected({ ...selected, viewType: ViewType.Admin }),
                  },
            ]
          : []),
        {
          label: 'Se déconnecter',
          iconOrSwitch: <LogoutIcon />,
          linkOrActionOrMenu: logout,
        },
      ],
    },
  ];

  const adminTeam = tenant?.tenantManages.find(
    (manage) => !manage.campusCluster && manage.team.type === TeamType.Tenant
  )?.team;

  return (
    <nav className="h-screen flex flex-col w-sidebar bg-main shrink-0 bg-1">
      {/* Subspace name */}
      <Popover forcePlacement={true} placement="bottom-start">
        <PopoverTrigger>
          <div className="bg-1-hover cursor-pointer shrink-0 flex justify-between items-center h-[var(--topbar-height)] px-5 border-b border-color-2">
            <div className="flex gap-item items-center">
              {tenant ? (
                <>
                  <AvatarImage
                    name={tenant.name}
                    src={getAvatar(adminTeam?.actor?.actorImages)}
                    size={16}
                    type="tenant"
                  />
                  <div className={clsx('flex flex-col items-start', smallHideClassName)}>
                    <h2 className="text-0 text-xl tracking-tighter font-bold line-clamp-1">{tenant.name}</h2>
                    <div className="text-3 text-sm -mt-0.5">
                      {selected.viewType === ViewType.Community ? 'Vie associative' : 'Administration'}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Skeleton className="rounded-[12.5%]" width={19} ratio={1} />
                  <div className={smallHideClassName}>
                    <Skeleton height={6} width={48} />
                    <Skeleton height={4} width={48} />
                  </div>
                </>
              )}
            </div>
            <SortArrowsFilledIcon className={clsx('h-7 text-1 -mr-2', smallHideClassName)} />
          </div>
        </PopoverTrigger>

        <PopoverContent popoverClassName="!p-0">
          <MenuList sections={tenantActions} />
        </PopoverContent>
      </Popover>

      {/* Menus */}
      <div className={menusClassName}>
        <div className={sectionClassName}>
          {Object.entries(menus[selected.viewType].menus).map(([_, menu]: [string, Menu], idx) => (
            <SidebarLink
              key={idx}
              menu={menu}
              selected={
                selected.menuId === menu.linkOrAction ||
                !!(
                  menu.sub &&
                  menu.sub.some(
                    (subMenu) =>
                      typeof subMenu.linkOrAction === 'string' && selected.menuId.startsWith(subMenu.linkOrAction)
                  )
                )
              }
            />
          ))}
        </div>
        <hr className={hrClassName} />
        <div className={sectionClassName}>
          <div className={textSeparatorClassName}>Activités</div>
          <SidebarLink menu={eventsMenu} selected={selected.menuId.startsWith(EVENTS_ROUTE)} />
          <SidebarLink menu={projectsMenu} selected={selected.menuId.startsWith(PROJECTS_ROUTE)} />
        </div>
        <hr className={hrClassName} />
        <div className={sectionClassName}>
          <div className={textSeparatorClassName}>Associations</div>
          {shortcuts && shortcuts.length > 0
            ? [
                ...shortcuts.map((teamShortcut) => {
                  const link = TEAM_MANAGE_ROUTE(teamShortcut.slug);
                  return (
                    <SidebarLink
                      key={teamShortcut.id as string}
                      selected={selected.menuId.startsWith(link)}
                      menu={{
                        linkOrAction: link,
                        label: teamShortcut.name,
                        icon: () => (
                          <AvatarImage
                            name={teamShortcut.name}
                            src={getAvatar(teamShortcut.actorImages)}
                            className={clsx(selected.menuId.startsWith(link) && 'shadow-primary')}
                            type="team"
                            size={14}
                          />
                        ),
                      }}
                    />
                  );
                }),
                <SidebarLink key={CLUBS_ROUTE} menu={clubsMenu} selected={selected.menuId === CLUBS_ROUTE} />,
              ]
            : tags
            ? [
                <SidebarLink key={CLUBS_ROUTE} selected={selected.menuId === CLUBS_ROUTE} menu={clubsMenu} />,
                ...tags.map((category) => {
                  const link = CLUB_CATEGORY_ROUTE(category.slug);
                  return (
                    <SidebarLink
                      key={category.id as string}
                      selected={selected.menuId.startsWith(link)}
                      menu={{
                        linkOrAction: link,
                        label: category.name,
                        icon: ({ className }) =>
                          category.image ? (
                            <img
                              src={category.image.url}
                              alt={category.name}
                              className={clsx(className, selected.menuId.startsWith(link) && 'shadow-primary')}
                              style={{
                                borderRadius: `${AVATAR_USER_ROUNDED}%`,
                                opacity: selected.menuId === link ? 1 : 0.8,
                              }}
                            />
                          ) : (
                            <div
                              className={clsx(className, selected.menuId.startsWith(link) && 'shadow-primary')}
                              style={{
                                borderRadius: `${AVATAR_USER_ROUNDED}%`,
                                backgroundColor: isIn(category.color, COLORS) ? COLORS[category.color] : category.color,
                                opacity: selected.menuId === link ? 1 : 0.8,
                              }}
                            />
                          ),
                      }}
                    />
                  );
                }),
              ]
            : Array.from({ length: 4 })
                .fill(0)
                .map((_, idx) => (
                  <div className={sidebarLinkClass} key={idx}>
                    <Skeleton className={clsx(iconClassName, 'roudned-full')} />
                    <Skeleton height={6} width={64} className={linkClassName} />
                  </div>
                ))}
        </div>
      </div>
    </nav>
  );
}
