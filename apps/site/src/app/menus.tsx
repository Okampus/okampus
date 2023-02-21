import { ReactComponent as ExploreFilledIcon } from '@okampus/assets/svg/icons/filled/explore.svg';
import { ReactComponent as ExploreOutlinedIcon } from '@okampus/assets/svg/icons/outlined/explore.svg';
import { ReactComponent as ArticleFilledIcon } from '@okampus/assets/svg/icons/filled/article.svg';
import { ReactComponent as EventFilledIcon } from '@okampus/assets/svg/icons/filled/event.svg';
import { ReactComponent as EventOutlinedIcon } from '@okampus/assets/svg/icons/outlined/event.svg';
import { ReactComponent as ArticleOutlinedIcon } from '@okampus/assets/svg/icons/outlined/article.svg';
import { ReactComponent as AtSignFilledIcon } from '@okampus/assets/svg/icons/filled/at-sign.svg';
import { ReactComponent as AtSignOutlinedIcon } from '@okampus/assets/svg/icons/outlined/at-sign.svg';
import { ReactComponent as TenancyFilledIcon } from '@okampus/assets/svg/icons/filled/tenancy.svg';
import { ReactComponent as TenancyOutlinedIcon } from '@okampus/assets/svg/icons/outlined/tenancy.svg';
import { ReactComponent as DashboardFilledIcon } from '@okampus/assets/svg/icons/filled/dashboard.svg';
import { ReactComponent as DashboardOutlinedIcon } from '@okampus/assets/svg/icons/outlined/dashboard.svg';
import { ReactComponent as AddArticleFilledIcon } from '@okampus/assets/svg/icons/filled/article-add.svg';
import { ReactComponent as AddArticleOutlinedIcon } from '@okampus/assets/svg/icons/outlined/article-add.svg';
import { ReactComponent as CalendarMonthFilledIcon } from '@okampus/assets/svg/icons/filled/event-month.svg';
import { ReactComponent as CalendarMonthOutlinedIcon } from '@okampus/assets/svg/icons/outlined/event-month.svg';
import { ReactComponent as OverviewFilledIcon } from '@okampus/assets/svg/icons/filled/overview.svg';
import { ReactComponent as OverviewOutlinedIcon } from '@okampus/assets/svg/icons/outlined/overview.svg';
import { ReactComponent as SettingsFilledIcon } from '@okampus/assets/svg/icons/filled/settings.svg';
import { ReactComponent as SettingsOutlinedIcon } from '@okampus/assets/svg/icons/outlined/settings.svg';
import { ReactComponent as PaletteFilledIcon } from '@okampus/assets/svg/icons/filled/palette.svg';
import { ReactComponent as PaletteOutlinedIcon } from '@okampus/assets/svg/icons/outlined/palette.svg';
import { ReactComponent as GroupFilledIcon } from '@okampus/assets/svg/icons/filled/group.svg';
import { ReactComponent as GroupOutlinedIcon } from '@okampus/assets/svg/icons/outlined/group.svg';
import { ReactComponent as ValidateStepFilledIcon } from '@okampus/assets/svg/icons/filled/validate.svg';
import { ReactComponent as ValidateStepOutlinedIcon } from '@okampus/assets/svg/icons/outlined/validate.svg';
import { ReactComponent as FolderFilledIcon } from '@okampus/assets/svg/icons/filled/folder-open.svg';
import { ReactComponent as FolderOutlinedIcon } from '@okampus/assets/svg/icons/outlined/folder-open.svg';
import { ReactComponent as WalletFilledIcon } from '@okampus/assets/svg/icons/filled/wallet.svg';
import { ReactComponent as WalletOutlinedIcon } from '@okampus/assets/svg/icons/outlined/wallet.svg';
import { ReactComponent as EditEventFilledIcon } from '@okampus/assets/svg/icons/filled/event-edit.svg';
import { ReactComponent as EditEventOutlinedIcon } from '@okampus/assets/svg/icons/outlined/event-edit.svg';
import { ReactComponent as EventPendingFilledIcon } from '@okampus/assets/svg/icons/filled/event-repeat.svg';
import { ReactComponent as EventPendingOutlinedIcon } from '@okampus/assets/svg/icons/outlined/event-repeat.svg';
import { ReactComponent as EventUpcomingFilledIcon } from '@okampus/assets/svg/icons/filled/event-upcoming.svg';
import { ReactComponent as EventUpcomingOutlinedIcon } from '@okampus/assets/svg/icons/outlined/event-upcoming.svg';
import { ReactComponent as CameraFilledIcon } from '@okampus/assets/svg/icons/filled/camera.svg';
import { ReactComponent as CameraOutlinedIcon } from '@okampus/assets/svg/icons/outlined/camera.svg';

import { ShortcutType } from '@okampus/shared/enums';

import { defaultSelectedMenu, SubspaceTypes } from '@okampus/shared/types';
import type { SelectedMenu } from '@okampus/shared/types';

export enum ResourceRouteType {
  Org = 'Org',
  User = 'User',
  Event = 'Event',
}

export const routeIdStrings = {
  [ResourceRouteType.Org]: ':orgId',
  [ResourceRouteType.User]: ':userId',
};

export type ResourceRoute = {
  noIdRedirect: string;
  idString: string;
};

export type Menu = {
  icon?: React.FC;
  iconSelected?: React.FC;
  label: string;
  link: string;
  tip?: string;
  sub?: Menu[];
  shortcutKey?: ShortcutType;
};

export type Subspace = {
  isResourceRoute: ResourceRoute | null;
  manageView: SubspaceTypes | null;
  menus: Menu[];
};

export const menus: { [key in SubspaceTypes]: Subspace } = {
  [SubspaceTypes.Home]: {
    isResourceRoute: null,
    manageView: SubspaceTypes.Admin,
    menus: [
      {
        icon: ExploreOutlinedIcon,
        iconSelected: ExploreFilledIcon,
        label: 'Associations',
        link: '/clubs',
        tip: 'Toutes les associations',
      },
      {
        icon: ArticleOutlinedIcon,
        iconSelected: ArticleFilledIcon,
        label: 'Guides',
        link: '/guides',
        tip: 'Guides & tutoriels',
      },
      {
        icon: EventOutlinedIcon,
        iconSelected: EventFilledIcon,
        label: 'Événements',
        link: '/events',
        tip: 'Événements, sorties et activités',
      },
      {
        icon: AtSignOutlinedIcon,
        iconSelected: AtSignFilledIcon,
        label: 'Annuaire',
        link: '/people',
        tip: 'Contacts et profils',
      },
      {
        icon: TenancyOutlinedIcon,
        iconSelected: TenancyFilledIcon,
        label: 'Staff',
        link: '/staff',
        tip: "Découvre le staff de l'école",
      },
    ],
  },
  [SubspaceTypes.Admin]: {
    isResourceRoute: null,
    manageView: null,
    menus: [
      {
        icon: DashboardOutlinedIcon,
        iconSelected: DashboardFilledIcon,
        label: 'Dashboard',
        link: '/admin/clubs',
        tip: 'Dashboard des associations',
      },
      {
        icon: AddArticleOutlinedIcon,
        iconSelected: AddArticleFilledIcon,
        label: 'Guides',
        link: '/admin/guides',
        tip: 'Guides & tutoriels',
      },
      {
        icon: CalendarMonthOutlinedIcon,
        iconSelected: CalendarMonthFilledIcon,
        label: 'Événements',
        link: '/admin/events',
        tip: 'Gestion des événements',
      },
      {
        icon: OverviewOutlinedIcon,
        iconSelected: OverviewFilledIcon,
        label: "Vue d'ensemble",
        link: '/admin',
        tip: 'KPIs et alertes',
      },
      {
        icon: SettingsOutlinedIcon,
        iconSelected: SettingsFilledIcon,
        label: 'Portail',
        link: '/admin/settings',
        sub: [
          {
            icon: PaletteOutlinedIcon,
            iconSelected: PaletteFilledIcon,
            label: 'Apparence',
            link: '/admin/settings',
            tip: 'Personnalisation graphique du portail',
          },
          {
            icon: GroupOutlinedIcon,
            iconSelected: GroupFilledIcon,
            label: 'Rôles',
            link: '/admin/roles',
            tip: 'Accès et permissions',
          },
          {
            icon: ValidateStepOutlinedIcon,
            iconSelected: ValidateStepFilledIcon,
            label: 'Processus',
            link: '/admin/validations',
            tip: 'Étapes de validations & processus',
          },
        ],
        tip: 'Paramètres du portail',
      },
    ],
  },
  [SubspaceTypes.Manage]: {
    isResourceRoute: {
      idString: ':orgId',
      noIdRedirect: '/home/explore/clubs',
    },
    manageView: null,
    menus: [
      {
        icon: PaletteOutlinedIcon,
        iconSelected: PaletteFilledIcon,
        label: 'Profil public',
        link: '/:orgId/manage',
        tip: 'Informations générales',
        shortcutKey: ShortcutType.TeamManage,
      },
      {
        icon: FolderOutlinedIcon,
        iconSelected: FolderFilledIcon,
        label: 'Documents',
        link: '/:orgId/manage/documents',
        tip: 'Informations générales',
        shortcutKey: ShortcutType.TeamManage,
      },
      {
        icon: WalletOutlinedIcon,
        iconSelected: WalletFilledIcon,
        label: 'Trésorerie',
        link: '/:orgId/manage/treasury',
        tip: 'Gestion des membres et invitations',
        shortcutKey: ShortcutType.TeamManageTreasury,
      },
      {
        icon: EditEventOutlinedIcon,
        iconSelected: EditEventFilledIcon,
        label: 'Événements',
        link: '/:orgId/manage/events',
        sub: [
          {
            icon: CameraOutlinedIcon,
            iconSelected: CameraFilledIcon,
            label: 'Rétrospectives',
            link: '/:orgId/manage/events',
            tip: 'Événements passés',
          },
          {
            icon: EventPendingOutlinedIcon,
            iconSelected: EventPendingFilledIcon,
            label: 'En attente',
            link: '/:orgId/manage/events',
            tip: 'Événements en attente de validation',
          },
          {
            icon: EventUpcomingOutlinedIcon,
            iconSelected: EventUpcomingFilledIcon,
            label: 'À venir',
            link: '/:orgId/manage/events',
            tip: 'Événements à venir',
          },
        ],
        tip: 'Liste des événements',
      },
      {
        icon: SettingsOutlinedIcon,
        iconSelected: SettingsFilledIcon,
        label: 'Paramètres',
        link: '/:orgId/manage/settings',
        sub: [
          {
            icon: OverviewOutlinedIcon,
            iconSelected: OverviewFilledIcon,
            label: "Vue d'ensemble",
            link: '/:orgId/manage/settings',
            tip: "Informations générales de l'association",
          },
          {
            icon: GroupOutlinedIcon,
            iconSelected: GroupFilledIcon,
            label: 'Rôles',
            link: '/:orgId/manage/roles',
            tip: 'Gestion des rôles',
          },
        ],
        tip: "Paramètres de l'association",
      },
    ],
  },
  [SubspaceTypes.Me]: {
    isResourceRoute: {
      idString: ':userId',
      noIdRedirect: '/home/explore/people',
    },
    manageView: null,
    menus: [
      {
        icon: PaletteOutlinedIcon,
        iconSelected: PaletteFilledIcon,
        label: 'Mon profil',
        link: '/:userId/me',
      },
    ],
  },
};

const findShortcutMenu = (subspace: SubspaceTypes, shortcutKey: ShortcutType): SelectedMenu => {
  const menu = menus[subspace].menus.findIndex((m) => m.shortcutKey === shortcutKey);
  if (menu !== -1) return { subSpace: subspace, menu, subMenu: 0 };

  for (let i = 0; i < menus[subspace].menus.length; i++) {
    const sub = menus[subspace].menus[i].sub;
    if (sub) {
      const subMenu = sub.findIndex((m) => m.shortcutKey === shortcutKey);
      if (subMenu !== -1) return { subSpace: subspace, menu: i, subMenu };
    }
  }

  throw new Error(`Shortcut menu not found for ${shortcutKey}`);
};

function matchPath(path: string, pattern: string) {
  const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '[a-zA-Z0-9-]+')}$`);
  return regex.test(path);
}

// TODO: ugly, should be refactored
export function selectedMenuFromPath(path: string): SelectedMenu {
  for (const subSpaceType of Object.values(SubspaceTypes)) {
    const subSpace = menus[subSpaceType];
    for (const [menuIdx, menu] of subSpace.menus.entries()) {
      if (!menu.sub && matchPath(path, menu.link)) return { subSpace: subSpaceType, menu: menuIdx, subMenu: 0 };
      if (menu.sub) {
        for (const [subMenuIdx, [, subMenu]] of Object.entries(menu.sub).entries()) {
          if (matchPath(path, subMenu.link)) return { subSpace: subSpaceType, menu: menuIdx, subMenu: subMenuIdx };
        }
      }
    }
  }
  return defaultSelectedMenu;
}

// TODO: expand
export const shortcutMenus: { [key in ShortcutType]: SelectedMenu } = {
  [ShortcutType.General]: { subSpace: SubspaceTypes.Manage, menu: 0, subMenu: 0 },
  [ShortcutType.Project]: { subSpace: SubspaceTypes.Manage, menu: 0, subMenu: 0 },
  [ShortcutType.Team]: { subSpace: SubspaceTypes.Manage, menu: 0, subMenu: 0 },
  [ShortcutType.TeamManage]: findShortcutMenu(SubspaceTypes.Manage, ShortcutType.TeamManage),
  [ShortcutType.TeamManageTreasury]: findShortcutMenu(SubspaceTypes.Manage, ShortcutType.TeamManageTreasury),
  [ShortcutType.User]: { subSpace: SubspaceTypes.Manage, menu: 0, subMenu: 0 },
};
