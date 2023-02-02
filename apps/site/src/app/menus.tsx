import { ReactComponent as CalendarIcon } from '@okampus/assets/svg/icons/calendar.svg';
import { ReactComponent as PeopleIcon } from '@okampus/assets/svg/icons/people.svg';
import { ReactComponent as SiteMapIcon } from '@okampus/assets/svg/icons/sitemap.svg';
import { ReactComponent as DocumentIcon } from '@okampus/assets/svg/icons/document.svg';
import { ReactComponent as TeamsIcon } from '@okampus/assets/svg/icons/team.svg';
import { ReactComponent as GaugeIcon } from '@okampus/assets/svg/icons/gauge.svg';
import { ReactComponent as SettingsIcon } from '@okampus/assets/svg/icons/settings.svg';
import { ReactComponent as CalendarUpcomingIcon } from '@okampus/assets/svg/icons/calendar-upcoming.svg';
import { ReactComponent as TablesIcon } from '@okampus/assets/svg/icons/tables.svg';
import { ReactComponent as WalletIcon } from '@okampus/assets/svg/icons/wallet.svg';
import { ShortcutType } from '@okampus/shared/enums';
import { defaultSelectedMenu, SelectedMenu, SubspaceTypes } from '@okampus/shared/types';

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

export const menus = {
  [SubspaceTypes.Home]: {
    isResourceRoute: null,
    manageView: SubspaceTypes.Admin,
    menus: [
      {
        icon: TeamsIcon,
        label: 'Associations',
        link: '/clubs',
        tip: 'Toutes les associations',
      },
      {
        icon: DocumentIcon,
        label: 'Guides',
        link: '/guides',
        tip: 'Guides & tutoriels',
      },
      {
        icon: CalendarIcon,
        label: 'Événements',
        link: '/events',
        tip: 'Événements, sorties et activités',
      },
      {
        icon: PeopleIcon,
        label: 'Annuaire',
        link: '/people',
        tip: 'Contacts et profils',
      },
      {
        icon: SiteMapIcon,
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
        icon: TablesIcon,
        label: 'Dashboards',
        link: '/admin/clubs',
        tip: 'Dashboards des associations',
      },
      {
        icon: DocumentIcon,
        label: 'Guides',
        link: '/admin/guides',
        tip: 'Guides & tutoriels',
      },
      {
        icon: CalendarIcon,
        label: 'Événements',
        link: '/admin/events',
        tip: 'Gestion des événements',
      },
      {
        icon: GaugeIcon,
        label: "Vue d'ensemble",
        link: '/admin',
        tip: 'KPIs et alertes',
      },
      {
        icon: SettingsIcon,
        label: 'Portail',
        link: '/admin/settings',
        sub: [
          {
            label: 'Apparence',
            link: '/admin/settings',
            tip: 'Personnalisation graphique du portail',
          },
          {
            label: 'Rôles',
            link: '/admin/roles',
            tip: 'Accès et permissions',
          },
          {
            label: 'Équipes',
            link: '/admin/staff',
            tip: 'Gestion des équipes du staff',
          },
          {
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
        icon: TeamsIcon,
        label: 'Association',
        link: '/:orgId/manage',
        tip: 'Informations générales',
        shortcutKey: ShortcutType.TeamManage,
      },
      {
        icon: DocumentIcon,
        label: 'Documents',
        link: '/:orgId/manage/documents',
        tip: 'Informations générales',
        shortcutKey: ShortcutType.TeamManage,
      },
      {
        icon: WalletIcon,
        label: 'Trésorerie',
        link: '/:orgId/manage/treasury',
        tip: 'Gestion des membres et invitations',
        shortcutKey: ShortcutType.TeamManageTreasury,
      },
      {
        icon: CalendarUpcomingIcon,
        label: 'Événements',
        link: '/:orgId/manage/events',
        sub: {
          past: {
            label: 'Rétrospectives',
            link: '/:orgId/manage/events',
            tip: 'Événements passés',
          },
          pending: {
            label: 'En attente',
            link: '/:orgId/manage/events',
            tip: 'Événements en attente de validation',
          },
          soon: {
            label: 'À venir',
            link: '/:orgId/manage/events',
            tip: 'Événements à venir',
          },
        },
        tip: 'Liste des événements',
      },
      {
        icon: SettingsIcon,
        label: 'Paramètres',
        link: '/:orgId/manage/settings',
        sub: {
          general: {
            label: "Vue d'ensemble",
            link: '/:orgId/manage/settings',
            tip: "Informations générales de l'association",
          },
          roles: {
            label: 'Rôles',
            link: '/:orgId/manage/roles',
            tip: 'Gestion des rôles',
          },
        },
        tip: "Paramètres de l'association",
      },
    ],
  },
} as { [key in SubspaceTypes]: Subspace };

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
  const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '[a-zA-Z0-9]+')}$`);
  return regex.test(path);
}

// TODO: ugly, should be refactored
export function selectedMenuFromPath(path: string): SelectedMenu {
  for (const [subSpaceName, subSpace] of Object.entries(menus)) {
    for (const [menuIdx, menu] of subSpace.menus.entries()) {
      if (!menu.sub && matchPath(path, menu.link))
        return { subSpace: subSpaceName as SubspaceTypes, menu: menuIdx, subMenu: 0 };
      if (menu.sub) {
        for (const [subMenuIdx, [, subMenu]] of Object.entries(menu.sub).entries()) {
          if (matchPath(path, subMenu.link))
            return { subSpace: subSpaceName as SubspaceTypes, menu: menuIdx, subMenu: subMenuIdx };
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
