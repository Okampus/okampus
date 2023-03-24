import { ReactComponent as ExploreFilledIcon } from '@okampus/assets/svg/icons/material/filled/explore.svg';
import { ReactComponent as ExploreOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/explore.svg';
import { ReactComponent as FavoriteFilledIcon } from '@okampus/assets/svg/icons/material/filled/favorite.svg';
import { ReactComponent as FavoriteOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/favorite.svg';
// import { ReactComponent as ArticleFilledIcon } from '@okampus/assets/svg/icons/material/filled/article.svg';
// import { ReactComponent as EventFilledIcon } from '@okampus/assets/svg/icons/material/filled/event.svg';
// import { ReactComponent as EventOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/event.svg';
// import { ReactComponent as ArticleOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/article.svg';
// import { ReactComponent as AtSignFilledIcon } from '@okampus/assets/svg/icons/material/filled/at-sign.svg';
// import { ReactComponent as AtSignOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/at-sign.svg';
// import { ReactComponent as TenancyFilledIcon } from '@okampus/assets/svg/icons/material/filled/tenancy.svg';
// import { ReactComponent as TenancyOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/tenancy.svg';
import { ReactComponent as DashboardFilledIcon } from '@okampus/assets/svg/icons/material/filled/dashboard.svg';
import { ReactComponent as DashboardOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/dashboard.svg';
import { ReactComponent as AddArticleFilledIcon } from '@okampus/assets/svg/icons/material/filled/article-add.svg';
import { ReactComponent as AddArticleOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/article-add.svg';
import { ReactComponent as EventValidateFilledIcon } from '@okampus/assets/svg/icons/material/filled/event-validate.svg';
import { ReactComponent as EventValidateOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/event-validate.svg';
import { ReactComponent as SquareFilledIcon } from '@okampus/assets/svg/icons/material/filled/square.svg';
import { ReactComponent as SquareOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/square.svg';
import { ReactComponent as SettingsFilledIcon } from '@okampus/assets/svg/icons/material/filled/settings.svg';
import { ReactComponent as SettingsOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/settings.svg';
import { ReactComponent as HomeFilledIcon } from '@okampus/assets/svg/icons/material/filled/home.svg';
import { ReactComponent as HomeOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/home.svg';
import { ReactComponent as PaletteFilledIcon } from '@okampus/assets/svg/icons/material/filled/palette.svg';
import { ReactComponent as PaletteOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/palette.svg';
import { ReactComponent as GroupFilledIcon } from '@okampus/assets/svg/icons/material/filled/user-group.svg';
import { ReactComponent as GroupOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/user-group.svg';
import { ReactComponent as StepValidationFilledIcon } from '@okampus/assets/svg/icons/material/filled/step-validation.svg';
import { ReactComponent as StepValidationOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/step-validation.svg';
import { ViewType } from '@okampus/shared/enums';
import { ADMIN_ROUTE, DISCOVER_ROUTE, FAVORITES_ROUTE, HOME_ROUTE } from '@okampus/shared/consts';
// // import { ReactComponent as UserAddFilledIcon } from '@okampus/assets/svg/icons/material/filled/user-add.svg';
// // import { ReactComponent as UserAddOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/user-add.svg';
// import { ReactComponent as FolderFilledIcon } from '@okampus/assets/svg/icons/material/filled/folder-open.svg';
// import { ReactComponent as FolderOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/folder-open.svg';
// import { ReactComponent as WalletFilledIcon } from '@okampus/assets/svg/icons/material/filled/wallet.svg';
// import { ReactComponent as WalletOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/wallet.svg';
// import { ReactComponent as EditEventFilledIcon } from '@okampus/assets/svg/icons/material/filled/event-edit.svg';
// import { ReactComponent as EditEventOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/event-edit.svg';
// // import { ReactComponent as EventPendingFilledIcon } from '@okampus/assets/svg/icons/material/filled/event-repeat.svg';
// // import { ReactComponent as EventPendingOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/event-repeat.svg';
// // import { ReactComponent as EventUpcomingFilledIcon } from '@okampus/assets/svg/icons/material/filled/event-upcoming.svg';
// // import { ReactComponent as EventUpcomingOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/event-upcoming.svg';
// import { ReactComponent as CameraFilledIcon } from '@okampus/assets/svg/icons/material/filled/camera.svg';
// import { ReactComponent as CameraOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/camera.svg';
// import { ReactComponent as ProfileFilledIcon } from '@okampus/assets/svg/icons/material/filled/profile.svg';
// import { ReactComponent as ProfileOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/profile.svg';

// import { ShortcutType } from '@okampus/shared/enums';

// import { defaultSelectedMenu, SubspaceType } from '@okampus/shared/types';
// import type { SelectedMenu } from '@okampus/shared/types';

export type ResourceRoute = {
  noIdRedirect: string;
  idString: string;
};

export type Menu = {
  icon?: React.FC<{ className?: string }>;
  iconSelected?: React.FC<{ className?: string }>;
  label: string;
  link: string;
  sub?: Menu[];
};

export type Subspace = {
  menus: Menu[];
};

export const menus = {
  [ViewType.Community]: {
    menus: [
      {
        icon: HomeOutlinedIcon,
        iconSelected: HomeFilledIcon,
        label: 'Accueil',
        link: HOME_ROUTE,
      },
      {
        icon: ExploreOutlinedIcon,
        iconSelected: ExploreFilledIcon,
        label: 'Découverte',
        link: DISCOVER_ROUTE,
      },
      {
        icon: FavoriteOutlinedIcon,
        iconSelected: FavoriteFilledIcon,
        label: 'Favoris',
        link: FAVORITES_ROUTE,
      },
      // {
      //   icon: ArticleOutlinedIcon,
      //   iconSelected: ArticleFilledIcon,
      //   label: 'Guides',
      //   link: '/guides',
      //   tip: 'Guides & tutoriels',
      // },
      // {
      //   icon: EventOutlinedIcon,
      //   iconSelected: EventFilledIcon,
      //   label: 'Événements',
      //   link: '/events',
      //   tip: 'Événements, sorties et activités',
      // },
      // {
      //   icon: AtSignOutlinedIcon,
      //   iconSelected: AtSignFilledIcon,
      //   label: 'Annuaire',
      //   link: '/people',
      //   tip: 'Contacts et profils',
      // },
      // {
      //   icon: TenancyOutlinedIcon,
      //   iconSelected: TenancyFilledIcon,
      //   label: 'Staff',
      //   link: '/staff',
      //   tip: "Découvre le staff de l'école",
      // },
    ],
  },
  [ViewType.Admin]: {
    menus: [
      {
        icon: SquareOutlinedIcon,
        iconSelected: SquareFilledIcon,
        label: "Vue d'ensemble",
        link: ADMIN_ROUTE,
      },
      {
        icon: DashboardOutlinedIcon,
        iconSelected: DashboardFilledIcon,
        label: 'Dashboard',
        link: '/admin/clubs',
      },
      {
        icon: AddArticleOutlinedIcon,
        iconSelected: AddArticleFilledIcon,
        label: 'Guides',
        link: '/admin/guides',
        tip: 'Guides & tutoriels',
      },
      {
        icon: EventValidateOutlinedIcon,
        iconSelected: EventValidateFilledIcon,
        label: 'Événements',
        link: '/admin/events',
        tip: 'Gestion des événements',
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
          },
          {
            icon: GroupOutlinedIcon,
            iconSelected: GroupFilledIcon,
            label: 'Rôles',
            link: '/admin/roles',
          },
          {
            icon: StepValidationOutlinedIcon,
            iconSelected: StepValidationFilledIcon,
            label: 'Processus',
            link: '/admin/validations',
          },
        ],
        tip: 'Paramètres du portail',
      },
    ],
  },
  // [SubspaceType.Org]: {
  //   menus: [
  //     {
  //       icon: HomeOutlinedIcon,
  //       iconSelected: HomeFilledIcon,
  //       label: 'Accueil',
  //       link: `/org/${RouteParamStrings[ResourceRouteType.Org]}/${TeamRoute.Profile}`,
  //       tip: 'Informations générales',
  //       shortcutKey: ShortcutType.TeamManage,
  //     },
  //     {
  //       icon: EventOutlinedIcon,
  //       iconSelected: EventFilledIcon,
  //       label: 'Événéments',
  //       link: `/org/${RouteParamStrings[ResourceRouteType.Org]}/${TeamRoute.Events}`,
  //       tip: 'Informations générales',
  //       shortcutKey: ShortcutType.TeamManage,
  //     },
  //     {
  //       icon: CameraOutlinedIcon,
  //       iconSelected: CameraFilledIcon,
  //       label: 'Galleries',
  //       link: `/org/${RouteParamStrings[ResourceRouteType.Org]}/${TeamRoute.Galleries}`,
  //       tip: 'Informations générales',
  //       shortcutKey: ShortcutType.TeamManage,
  //     },
  //   ],
  // },
  // [SubspaceType.Manage]: {
  //   menus: [
  //     {
  //       icon: SquareOutlinedIcon,
  //       iconSelected: SquareFilledIcon,
  //       label: "Vue d'ensemble",
  //       link: `/manage/${RouteParamStrings[ResourceRouteType.ManageOrg]}/${TeamManageRoute.Overview}`,
  //       tip: "Informations générales de l'association",
  //     },
  //     // {
  //     //   icon: UserAddOutlinedIcon,
  //     //   iconSelected: UserAddFilledIcon,
  //     //   label: 'Adhésions',
  //     //   link: `/manage/${RouteParamStrings[ResourceRouteType.ManageOrg]}/${TeamManageRoute.TeamJoin}`,
  //     //   tip: 'Adhésions & invitations',
  //     //   shortcutKey: ShortcutType.TeamManage,
  //     // },
  //     // {
  //     //   icon: PaletteOutlinedIcon,
  //     //   iconSelected: PaletteFilledIcon,
  //     //   label: 'Profil public',
  //     //   link: `/manage/${RouteParamStrings[ResourceRouteType.ManageOrg]}/${TeamManageRoute.Profile}`,
  //     //   tip: 'Informations générales',
  //     //   shortcutKey: ShortcutType.TeamManage,
  //     // },
  //     {
  //       icon: FolderOutlinedIcon,
  //       iconSelected: FolderFilledIcon,
  //       label: 'Documents',
  //       link: `/manage/${RouteParamStrings[ResourceRouteType.ManageOrg]}/${TeamManageRoute.Documents}`,
  //       tip: 'Informations générales',
  //       shortcutKey: ShortcutType.TeamManage,
  //     },
  //     {
  //       icon: WalletOutlinedIcon,
  //       iconSelected: WalletFilledIcon,
  //       label: 'Trésorerie',
  //       link: `/manage/${RouteParamStrings[ResourceRouteType.ManageOrg]}/${TeamManageRoute.Treasury}`,
  //       tip: 'Gestion des membres et invitations',
  //       shortcutKey: ShortcutType.TeamManageTreasury,
  //     },
  //     {
  //       icon: EditEventOutlinedIcon,
  //       iconSelected: EditEventFilledIcon,
  //       label: 'Événements',
  //       link: `/manage/${RouteParamStrings[ResourceRouteType.ManageOrg]}/${TeamManageRoute.Events}`,
  //       // sub: [
  //       //   {
  //       //     icon: CameraOutlinedIcon,
  //       //     iconSelected: CameraFilledIcon,
  //       //     label: 'Rétrospectives',
  //       //     link: `/manage/${RouteParamStrings[ResourceRouteType.ManageOrg]}/events`,
  //       //     tip: 'Événements passés',
  //       //   },
  //       //   {
  //       //     icon: EventPendingOutlinedIcon,
  //       //     iconSelected: EventPendingFilledIcon,
  //       //     label: 'En attente',
  //       //     link: `/manage/${RouteParamStrings[ResourceRouteType.ManageOrg]}/events`,
  //       //     tip: 'Événements en attente de validation',
  //       //   },
  //       //   {
  //       //     icon: EventUpcomingOutlinedIcon,
  //       //     iconSelected: EventUpcomingFilledIcon,
  //       //     label: 'À venir',
  //       //     link: `/manage/${RouteParamStrings[ResourceRouteType.ManageOrg]}/events`,
  //       //     tip: 'Événements à venir',
  //       //   },
  //       // ],
  //       tip: 'Liste des événements',
  //     },
  //     // {
  //     //   icon: SettingsOutlinedIcon,
  //     //   iconSelected: SettingsFilledIcon,
  //     //   label: 'Paramètres',
  //     //   link: `/manage/${RouteParamStrings[ResourceRouteType.ManageOrg]}/${TeamManageRoute.Roles}`,
  //     //   sub: [
  //     //     {
  //     //       icon: GroupOutlinedIcon,
  //     //       iconSelected: GroupFilledIcon,
  //     //       label: 'Rôles',
  //     //       link: `/manage/${RouteParamStrings[ResourceRouteType.ManageOrg]}/${TeamManageRoute.Roles}`,
  //     //       tip: 'Gestion des rôles',
  //     //     },
  //     //   ],
  //     //   tip: "Paramètres de l'association",
  //     // },
  //   ],
  // },
  // [SubspaceType.Me]: {
  //   menus: [
  //     {
  //       icon: PaletteOutlinedIcon,
  //       iconSelected: PaletteFilledIcon,
  //       label: 'Mon profil',
  //       link: `/me/${MyRoute.Profile}`,
  //     },
  //   ],
  // },
  // [SubspaceType.User]: {
  //   menus: [
  //     {
  //       icon: ProfileOutlinedIcon,
  //       iconSelected: ProfileFilledIcon,
  //       label: 'À propos',
  //       link: `/user/${RouteParamStrings[ResourceRouteType.User]}/${UserRoute.Profile}`,
  //     },
  //   ],
  // },
};
